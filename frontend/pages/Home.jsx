import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

// ─── tiny helper: staggered fade-up on mount ────────────────────────────────
function useFadeUp(selector, delayStep = 80) {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(selector) ?? [];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.transition = `opacity 0.55s ease ${i * delayStep}ms, transform 0.55s ease ${i * delayStep}ms`;
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }, [selector, delayStep]);
  return ref;
}

// ─── step card data ───────────────────────────────────────────────────────────
const STEPS = [
  {
    number: "01",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12h8M8 8h5M8 16h3" />
      </svg>
    ),
    title: "Enter your tools",
    desc: "Tell us which AI subscriptions you pay for — plans, seats, and monthly cost. Takes under two minutes.",
  },
  {
    number: "02",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Run the audit",
    desc: "Our rules engine checks every plan against current vendor pricing and benchmarks for your team size and use case.",
  },
  {
    number: "03",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Get your savings report",
    desc: "See a per-tool breakdown with exact dollar savings, clear recommendations, and a shareable link.",
  },
];

// ─── social proof ticker ──────────────────────────────────────────────────────
const LOGOS = [
  "Cursor", "Claude", "ChatGPT", "Copilot", "Gemini", "Windsurf",
  "Cursor", "Claude", "ChatGPT", "Copilot", "Gemini", "Windsurf",
];

export default function HomePage() {
  const navigate = useNavigate();
  const heroRef  = useFadeUp("[data-fade]", 90);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">
            SpendLens
            <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mb-0.5 align-middle" />
          </span>
          <button
            onClick={() => navigate("/audit")}
            className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Start audit →
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="pt-36 pb-24 px-5 max-w-5xl mx-auto text-center"
      >
        {/* badge */}
        <div data-fade className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-[12px] font-medium text-gray-500 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          FREE — NO SIGN-UP REQUIRED
        </div>

        {/* headline */}
        <h1
          data-fade
          className="text-[clamp(2.2rem,5.5vw,3.6rem)] font-bold leading-[1.12] tracking-tight text-gray-950 mb-5"
        >
          Find out if you're<br />
          <span className="relative inline-block">
            <span className="relative z-10">overpaying for AI tools</span>
            {/* underline accent */}
            <svg
              className="absolute -bottom-1 left-0 w-full"
              height="6"
              viewBox="0 0 400 6"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 5 Q100 1 200 4 Q300 7 400 3"
                stroke="#10b981"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* subtitle */}
        <p
          data-fade
          className="text-[1.125rem] text-gray-500 leading-relaxed max-w-xl mx-auto mb-10"
        >
          Paste in your AI subscriptions and get an instant audit — which plans
          to downgrade, what to switch, and how much you can save per month.
        </p>

        {/* CTA */}
        <div data-fade className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/audit")}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gray-950 text-white text-[15px] font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-800 active:scale-[.98] transition-all duration-150"
          >
            Start Free Audit
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
          <p className="text-[13px] text-gray-400">No account needed · Results in 30 seconds</p>
        </div>

        {/* stats row */}
        <div
          data-fade
          className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4"
        >
          {[
            { value: "$2,400", label: "avg. annual savings found" },
            { value: "8 tools", label: "supported platforms" },
            { value: "100%", label: "free, always" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-gray-950 tabular-nums">{value}</p>
              <p className="text-[13px] text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOGO TICKER ──────────────────────────────────────────────────── */}
      <div className="border-y border-gray-100 bg-gray-50 py-4 overflow-hidden select-none">
        <div className="flex gap-12 animate-[ticker_20s_linear_infinite] w-max">
          {LOGOS.map((name, i) => (
            <span key={i} className="text-[13px] font-semibold text-gray-300 tracking-widest uppercase whitespace-nowrap">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-5 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold tracking-[0.15em] text-emerald-600 uppercase mb-3">
            How it works
          </p>
          <h2 className="text-[1.85rem] font-bold tracking-tight text-gray-950">
            Three steps to your report
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="group relative bg-white rounded-2xl border border-gray-100 p-7 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              {/* step number — faint bg */}
              <span className="absolute top-6 right-6 text-[2.5rem] font-black text-gray-50 select-none leading-none">
                {step.number}
              </span>

              {/* icon */}
              <div className="mb-5 w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:border-emerald-100 group-hover:text-emerald-600 transition-colors duration-200">
                {step.icon}
              </div>

              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SAMPLE RESULT PREVIEW ────────────────────────────────────────── */}
      <section className="py-20 px-5 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[1.75rem] font-bold tracking-tight text-white mb-3">
              What your report looks like
            </h2>
            <p className="text-gray-400 text-[15px]">
              Per-tool breakdown with exact numbers — no vague advice.
            </p>
          </div>

          {/* mock result card */}
          <div className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
            {/* header */}
            <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-[12px] text-gray-500 uppercase tracking-widest mb-1 font-medium">Total potential savings</p>
                <p className="text-3xl font-bold text-white tabular-nums">$340<span className="text-gray-500 text-xl font-normal">/mo</span></p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-gray-500 uppercase tracking-widest mb-1 font-medium">Annual</p>
                <p className="text-xl font-semibold text-emerald-400 tabular-nums">$4,080</p>
              </div>
            </div>

            {/* rows */}
            {[
              { tool: "GitHub Copilot", plan: "Business · 5 seats", spend: "$95/mo", action: "Switch to Cursor Pro", savings: "$20/mo", good: true },
              { tool: "ChatGPT", plan: "Team · 5 seats", spend: "$150/mo", action: "Downgrade to Plus", savings: "$50/mo", good: true },
              { tool: "Cursor", plan: "Pro · 5 seats", spend: "$100/mo", action: "No changes needed", savings: "—", good: false },
            ].map((row) => (
              <div
                key={row.tool}
                className="px-6 py-4 border-b border-gray-800 last:border-0 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-white">{row.tool}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{row.plan} · {row.spend}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] text-gray-300">{row.action}</p>
                  <p className={`text-[13px] font-semibold mt-0.5 ${row.good ? "text-emerald-400" : "text-gray-600"}`}>
                    {row.savings}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[12px] text-gray-600 mt-4">
            Sample data — your actual results will reflect your real subscriptions
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-28 px-5 text-center max-w-2xl mx-auto">
        <h2 className="text-[2rem] font-bold tracking-tight text-gray-950 mb-4">
          Ready to see what you're paying for?
        </h2>
        <p className="text-gray-500 text-[15px] mb-9 leading-relaxed">
          Free, instant, and no account required. Most audits surface
          savings on the first try.
        </p>
        <button
          onClick={() => navigate("/audit")}
          className="group inline-flex items-center gap-2.5 bg-gray-950 text-white text-[15px] font-semibold px-9 py-4 rounded-xl hover:bg-gray-800 active:scale-[.98] transition-all duration-150"
        >
          Start Free Audit
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 px-5 text-center">
        <p className="text-[12px] text-gray-400">
          Built as a free tool by{" "}
          <a href="https://credex.rocks" className="hover:text-gray-600 transition-colors underline underline-offset-2">
            Credex
          </a>
          {" "}· Pricing data verified weekly from official vendor pages
        </p>
      </footer>

      {/* ── TICKER KEYFRAME (injected via style tag) ─────────────────────── */}
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}