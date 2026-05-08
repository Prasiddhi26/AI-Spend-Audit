// services/auditEngine.js
// =============================================================================
// AUDIT ENGINE - Pure rule-based logic. No AI. No DB. No Express.
// Takes user's tool inputs -> returns savings recommendations per tool.
//
// Pricing verified from official vendor pages - May 2025
// Full source citations: see PRICING_DATA.md
// =============================================================================

// =============================================================================
// SECTION 1: PRICING TABLE
// The single source of truth for all plan prices in this engine.
// Every number here must trace to an official vendor pricing URL.
// Format: PRICING[toolName][planName] = price per seat per month (USD)
// =============================================================================

const PRICING = {
  cursor: {
    hobby:      0,    // cursor.com/pricing - free tier
    pro:        20,   // cursor.com/pricing
    business:   40,   // cursor.com/pricing
    enterprise: null, // custom pricing - cannot audit
  },
  github_copilot: {
    individual: 10,   // github.com/features/copilot#pricing
    business:   19,   // github.com/features/copilot#pricing
    enterprise: 39,   // github.com/features/copilot#pricing
  },
  chatgpt: {
    free:       0,    // openai.com/chatgpt/pricing
    plus:       20,   // openai.com/chatgpt/pricing
    team:       30,   // openai.com/chatgpt/pricing (per seat)
    enterprise: null, // custom pricing
  },
  claude: {
    free:       0,    // anthropic.com/claude/pricing
    pro:        20,   // anthropic.com/claude/pricing
    max:        100,  // anthropic.com/claude/pricing
    team:       30,   // anthropic.com/claude/pricing (per seat)
    enterprise: null, // custom pricing
  },
  gemini: {
    free:       0,    // one.google.com/about/google-one/ai-premium
    pro:        20,   // Google One AI Premium
    business:   24,   // Google Workspace Business Starter includes Gemini
    ultra:      null, // bundled in workspace enterprise
  },
  windsurf: {
    free:       0,    // codeium.com/windsurf/pricing
    pro:        15,   // codeium.com/windsurf/pricing
    team:       35,   // codeium.com/windsurf/pricing
    enterprise: null, // custom pricing
  },
};

// =============================================================================
// SECTION 2: PLAN TIER ORDERING
// Used to determine if a plan is "higher" or "lower" than another.
// Lower index = cheaper/lighter plan.
// =============================================================================

const PLAN_TIERS = {
  cursor:         ["hobby", "pro", "business", "enterprise"],
  github_copilot: ["individual", "business", "enterprise"],
  chatgpt:        ["free", "plus", "team", "enterprise"],
  claude:         ["free", "pro", "max", "team", "enterprise"],
  gemini:         ["free", "pro", "business", "ultra"],
  windsurf:       ["free", "pro", "team", "enterprise"],
};

// =============================================================================
// SECTION 3: CROSS-TOOL ALTERNATIVE SUGGESTIONS
// For each tool + use case, defines better/cheaper alternatives.
// Only suggested if the alternative costs less than what user pays/seat.
// =============================================================================

const ALTERNATIVES = {
  github_copilot: {
    coding: [
      {
        tool:         "cursor",
        plan:         "pro",
        pricePerSeat: PRICING.cursor.pro,
        reason:
          "Cursor Pro offers better context-aware code generation than Copilot Business at half the price per seat.",
      },
      {
        tool:         "windsurf",
        plan:         "pro",
        pricePerSeat: PRICING.windsurf.pro,
        reason:
          "Windsurf Pro provides full IDE integration with agentic coding at $15/seat vs Copilot Business at $19/seat.",
      },
    ],
    writing:  [],
    research: [],
    data:     [],
    mixed:    [],
  },
  chatgpt: {
    research: [
      {
        tool:         "claude",
        plan:         "pro",
        pricePerSeat: PRICING.claude.pro,
        reason:
          "Claude Pro matches ChatGPT Team for research tasks at the same price but with a significantly larger context window.",
      },
    ],
    coding: [
      {
        tool:         "cursor",
        plan:         "pro",
        pricePerSeat: PRICING.cursor.pro,
        reason:
          "For coding workflows, Cursor Pro provides an integrated coding environment instead of copy-pasting between ChatGPT and your editor.",
      },
    ],
    writing:  [],
    data:     [],
    mixed:    [],
  },
  gemini: {
    writing: [
      {
        tool:         "claude",
        plan:         "pro",
        pricePerSeat: PRICING.claude.pro,
        reason:
          "Claude Pro is widely preferred for long-form writing tasks and costs $4 less per seat than Gemini Business.",
      },
    ],
    coding: [
      {
        tool:         "cursor",
        plan:         "pro",
        pricePerSeat: PRICING.cursor.pro,
        reason:
          "Cursor Pro is purpose-built for coding and costs $4 less per seat than Gemini Business.",
      },
    ],
    research: [],
    data:     [],
    mixed:    [],
  },
  claude:   { coding: [], writing: [], research: [], data: [], mixed: [] },
  cursor:   { coding: [], writing: [], research: [], data: [], mixed: [] },
  windsurf: { coding: [], writing: [], research: [], data: [], mixed: [] },
};

// =============================================================================
// SECTION 4: HELPER UTILITIES
// =============================================================================

/**
 * Normalises a tool name string to match PRICING keys.
 * Handles variations like "GitHub Copilot", "github-copilot", "copilot".
 */
const normaliseToolName = (name) => {
  const n = name.toLowerCase().trim().replace(/[\s-]/g, "_");

  const aliases = {
    copilot:          "github_copilot",
    github_copilot:   "github_copilot",
    chatgpt:          "chatgpt",
    chat_gpt:         "chatgpt",
    claude:           "claude",
    anthropic:        "claude",
    gemini:           "gemini",
    google_gemini:    "gemini",
    cursor:           "cursor",
    windsurf:         "windsurf",
    codeium:          "windsurf",
  };

  return aliases[n] || n;
};

/**
 * Normalises a plan name string to lowercase with no spaces.
 */
const normalisePlan = (plan) =>
  plan.toLowerCase().trim().replace(/\s+/g, "_");

/**
 * Returns the price per seat for a given tool + plan.
 * Returns null if tool unknown, plan unknown, or enterprise (custom pricing).
 */
const getPricePerSeat = (toolName, planName) => {
  const tool = PRICING[toolName];
  if (!tool) return null;
  const price = tool[planName];
  if (price === undefined || price === null) return null;
  return price;
};

/**
 * Returns the tier index for a plan within a tool's tier list.
 */
const getPlanTierIndex = (toolName, planName) => {
  const tiers = PLAN_TIERS[toolName];
  if (!tiers) return -1;
  return tiers.indexOf(planName);
};

/**
 * Finds the cheapest plan in the same tool that is one tier lower.
 * Returns { plan, pricePerSeat } or null if no downgrade is possible.
 */
const findCheaperSamePlan = (toolName, currentPlan) => {
  const currentTierIndex = getPlanTierIndex(toolName, currentPlan);
  if (currentTierIndex <= 0) return null; // already on lowest known plan

  const tiers = PLAN_TIERS[toolName];

  for (let i = currentTierIndex - 1; i >= 0; i--) {
    const candidatePlan  = tiers[i];
    const candidatePrice = getPricePerSeat(toolName, candidatePlan);
    if (candidatePrice === null) continue; // skip unknown
    return { plan: candidatePlan, pricePerSeat: candidatePrice };
  }
  return null;
};

// =============================================================================
// SECTION 5: INDIVIDUAL AUDIT RULES
// Each rule returns an array of finding objects.
// A finding = { recommendedAction, savings, reason }
// savings = 0 means informational only (no numeric saving calculated).
// =============================================================================

/**
 * RULE 1 - Overpayment vs. known price
 * If what the user entered as spend is significantly higher than
 * seats x official price, flag the discrepancy.
 */
const ruleOverpaymentVsKnownPrice = (tool, toolName, plan, pricePerSeat) => {
  const findings = [];
  if (pricePerSeat === null) return findings;

  const expectedSpend = tool.seats * pricePerSeat;
  const buffer        = expectedSpend * 1.15; // 15% buffer for taxes, rounding

  if (tool.monthlySpend > buffer) {
    const savings = +(tool.monthlySpend - expectedSpend).toFixed(2);
    if (savings > 0) {
      findings.push({
        recommendedAction: `Reconcile your ${toolName} billing - you pay $${tool.monthlySpend}/mo but ${tool.seats} seats on ${plan} should cost ~$${expectedSpend}/mo`,
        savings,
        reason: `Unaccounted spend of ~$${savings}/mo detected; verify seat count or billing plan in your vendor dashboard.`,
      });
    }
  }

  return findings;
};

/**
 * RULE 2 - Downgrade to cheaper plan from same vendor
 * If user is on a high-tier plan, check if a lower tier plan is sufficient.
 * Special case: Team/Business plans for <= 2 users are almost always overkill.
 */
const ruleSamePlanDowngrade = (tool, toolName, plan, pricePerSeat) => {
  const findings = [];
  if (pricePerSeat === null) return findings;

  const isTeamOrHigher = ["team", "business", "enterprise"].includes(plan);
  const isSmallTeam    = tool.seats <= 2;

  // Surface downgrade for small teams on group plans (always)
  // Surface downgrade for any team when savings are meaningful (>= $5/mo)
  if (isTeamOrHigher && isSmallTeam) {
    const cheaper = findCheaperSamePlan(toolName, plan);
    if (cheaper) {
      const newSpend = +(cheaper.pricePerSeat * tool.seats).toFixed(2);
      const savings  = +(tool.monthlySpend - newSpend).toFixed(2);
      if (savings > 0) {
        findings.push({
          recommendedAction: `Downgrade ${toolName}: ${plan} -> ${cheaper.plan}`,
          savings,
          reason: `With only ${tool.seats} seats, the ${cheaper.plan} plan ($${cheaper.pricePerSeat}/seat) is sufficient and saves $${savings}/mo.`,
        });
      }
    }
  } else {
    const cheaper = findCheaperSamePlan(toolName, plan);
    if (cheaper) {
      const newSpend = +(cheaper.pricePerSeat * tool.seats).toFixed(2);
      const savings  = +(tool.monthlySpend - newSpend).toFixed(2);
      if (savings >= 5) {
        findings.push({
          recommendedAction: `Downgrade ${toolName}: ${plan} -> ${cheaper.plan}`,
          savings,
          reason: `The ${cheaper.plan} plan covers standard usage at $${cheaper.pricePerSeat}/seat and reduces spend by $${savings}/mo.`,
        });
      }
    }
  }

  return findings;
};

/**
 * RULE 3 - High cost per seat
 * Flag when per-seat cost exceeds $35/month as an informational warning.
 */
const ruleHighCostPerSeat = (tool, toolName, pricePerSeat) => {
  const findings = [];
  if (pricePerSeat === null) return findings;

  const HIGH_COST_THRESHOLD = 35;
  if (pricePerSeat >= HIGH_COST_THRESHOLD) {
    findings.push({
      recommendedAction: `Audit active usage on ${toolName} (currently $${pricePerSeat}/seat)`,
      savings: 0,
      reason: `At $${pricePerSeat}/seat, this is a high-cost tier - confirm all ${tool.seats} seats are actively used to avoid paying for idle licences.`,
    });
  }

  return findings;
};

/**
 * RULE 4 - Cross-tool alternative (use-case aware)
 * If a different tool offers similar capability for less, surface it.
 */
const ruleCrossToolAlternative = (tool, toolName, useCase, pricePerSeat) => {
  const findings = [];
  const altList  = ALTERNATIVES[toolName]?.[useCase] ?? [];

  for (const alt of altList) {
    if (alt.pricePerSeat === null) continue;
    // Only suggest if alternative is strictly cheaper per seat
    if (pricePerSeat !== null && alt.pricePerSeat >= pricePerSeat) continue;

    const altTotalSpend = +(alt.pricePerSeat * tool.seats).toFixed(2);
    const savings       = +(tool.monthlySpend - altTotalSpend).toFixed(2);
    if (savings > 0) {
      findings.push({
        recommendedAction: `Switch ${toolName} (${tool.plan}) -> ${alt.tool} ${alt.plan} at $${alt.pricePerSeat}/seat`,
        savings,
        reason: alt.reason,
      });
    }
  }

  return findings;
};

/**
 * RULE 5 - Coding use case: suggest a dedicated coding IDE tool
 * If user pays for a general LLM for coding and has NO coding IDE tool yet,
 * suggest Cursor Pro as a more efficient alternative.
 */
const ruleCodingToolPreference = (tool, toolName, pricePerSeat) => {
  const findings        = [];
  const generalLLMTools = ["chatgpt", "claude", "gemini"];
  if (!generalLLMTools.includes(toolName)) return findings;

  const cursorPrice = PRICING.cursor.pro; // $20
  if (pricePerSeat !== null && cursorPrice < pricePerSeat) {
    const savings = +((pricePerSeat - cursorPrice) * tool.seats).toFixed(2);
    if (savings > 0) {
      findings.push({
        recommendedAction: `Consider replacing ${toolName} with Cursor Pro ($${cursorPrice}/seat) for coding tasks`,
        savings,
        reason: `Cursor's inline IDE integration eliminates the copy-paste loop between ${toolName} and your editor, and costs $${pricePerSeat - cursorPrice}/seat less.`,
      });
    }
  }

  return findings;
};

// =============================================================================
// SECTION 6: MAIN AUDIT ENGINE FUNCTION (named export)
// =============================================================================

/**
 * runAudit
 *
 * @param {Array}  tools    - Array of tool objects from user input
 * @param {string} useCase  - "coding" | "writing" | "research" | "data" | "mixed"
 *
 * @returns {{
 *   results: Array,
 *   totalMonthlySavings: number,
 *   totalAnnualSavings: number
 * }}
 *
 * Each result item shape:
 * {
 *   tool:              string,
 *   plan:              string,
 *   seats:             number,
 *   currentSpend:      number,
 *   recommendedAction: string,
 *   savings:           number,
 *   reason:            string,
 *   status:            "optimise" | "optimal" | "unknown",
 *   allFindings:       Array    -- all opportunities found, sorted by savings
 * }
 */
export const runAudit = (tools, useCase = "mixed") => {

  // ---- Input validation ------------------------------------------------------
  if (!Array.isArray(tools) || tools.length === 0) {
    throw new Error("runAudit requires a non-empty array of tools.");
  }

  const validUseCases    = ["coding", "writing", "research", "data", "mixed"];
  const normalisedUseCase = useCase.toLowerCase().trim();
  if (!validUseCases.includes(normalisedUseCase)) {
    throw new Error(
      `Invalid useCase "${useCase}". Must be one of: ${validUseCases.join(", ")}`
    );
  }

  // ---- Check if user already has a dedicated coding IDE ---------------------
  // Used by Rule 5 to avoid suggesting Cursor if they already have it / Windsurf
  const userToolNames = tools.map((t) => normaliseToolName(t.name));
  const hasCodingIDE  = userToolNames.some((n) => ["cursor", "windsurf"].includes(n));

  // ---- Process each tool ---------------------------------------------------
  const results = tools.map((rawTool) => {

    // Normalise inputs
    const toolName     = normaliseToolName(rawTool.name);
    const plan         = normalisePlan(rawTool.plan);
    const seats        = Math.max(1, Number(rawTool.seats)        || 1);
    const currentSpend = Math.max(0, Number(rawTool.monthlySpend) || 0);

    // Convenience object passed into rules
    const tool = { ...rawTool, plan, seats, monthlySpend: currentSpend };

    // Known price per seat from our pricing table
    const pricePerSeat = getPricePerSeat(toolName, plan);

    // ---- Run all rules, collect findings -----------------------------------
    const findings = [
      ...ruleOverpaymentVsKnownPrice(tool, toolName, plan, pricePerSeat),
      ...ruleSamePlanDowngrade(tool, toolName, plan, pricePerSeat),
      ...ruleHighCostPerSeat(tool, toolName, pricePerSeat),
      ...ruleCrossToolAlternative(tool, toolName, normalisedUseCase, pricePerSeat),
    ];

    // Rule 5 only runs if the use case is coding AND they don't already have an IDE tool
    if (normalisedUseCase === "coding" && !hasCodingIDE) {
      findings.push(
        ...ruleCodingToolPreference(tool, toolName, pricePerSeat)
      );
    }

    // ---- Pick the best finding (highest concrete savings) ------------------
    const actionableFindings = findings
      .filter((f) => f.savings > 0)
      .sort((a, b) => b.savings - a.savings);

    const bestFinding = actionableFindings[0] || null;

    // ---- Build result object -----------------------------------------------
    if (!bestFinding) {
      // Unknown tool (not in our pricing table)
      if (pricePerSeat === null && !PRICING[toolName]) {
        return {
          tool:              rawTool.name,
          plan:              rawTool.plan,
          seats,
          currentSpend,
          recommendedAction: "Tool not in our database yet",
          savings:           0,
          reason:            "We don't have pricing data for this tool - check the vendor's pricing page directly.",
          status:            "unknown",
          allFindings:       [],
        };
      }

      // Tool is known but no savings found - they are spending optimally
      return {
        tool:              rawTool.name,
        plan:              rawTool.plan,
        seats,
        currentSpend,
        recommendedAction: "No changes needed",
        savings:           0,
        reason:
          pricePerSeat !== null
            ? `You're on the right plan at $${pricePerSeat}/seat - spending looks appropriate for your team size and use case.`
            : `Custom enterprise pricing - contact your vendor to benchmark your rate against market alternatives.`,
        status:      "optimal",
        allFindings: findings, // may include informational-only findings (savings: 0)
      };
    }

    return {
      tool:              rawTool.name,
      plan:              rawTool.plan,
      seats,
      currentSpend,
      recommendedAction: bestFinding.recommendedAction,
      savings:           bestFinding.savings,
      reason:            bestFinding.reason,
      status:            "optimise",
      allFindings:       actionableFindings, // all opportunities, ranked by savings
    };
  });

  // ---- Calculate totals ----------------------------------------------------
  const totalMonthlySavings = +results
    .reduce((sum, r) => sum + r.savings, 0)
    .toFixed(2);

  const totalAnnualSavings = +(totalMonthlySavings * 12).toFixed(2);

  // ---- Return final audit output -------------------------------------------
  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings,
  };
};

// =============================================================================
// SECTION 7: SELF-TEST
// Run directly with: node --input-type=module < services/auditEngine.js
// Or call runAudit() from your Express controller.
// =============================================================================

// Uncomment the block below to run a quick test from the terminal:
/*
const sampleTools = [
  { name: "cursor",         plan: "business",   monthlySpend: 200, seats: 5 },
  { name: "github_copilot", plan: "business",   monthlySpend: 95,  seats: 5 },
  { name: "chatgpt",        plan: "team",       monthlySpend: 150, seats: 5 },
  { name: "claude",         plan: "pro",        monthlySpend: 20,  seats: 1 },
];

const output = runAudit(sampleTools, "coding");
console.log(JSON.stringify(output, null, 2));
console.log("Monthly Savings:", output.totalMonthlySavings);
console.log("Annual Savings: ", output.totalAnnualSavings);
*/

// =============================================================================
// SECTION 8: NAMED EXPORTS for unit testing individual rules and utilities
// =============================================================================

export {
  PRICING,
  PLAN_TIERS,
  ALTERNATIVES,
  normaliseToolName,
  normalisePlan,
  getPricePerSeat,
  getPlanTierIndex,
  findCheaperSamePlan,
  ruleOverpaymentVsKnownPrice,
  ruleSamePlanDowngrade,
  ruleHighCostPerSeat,
  ruleCrossToolAlternative,
  ruleCodingToolPreference,
};