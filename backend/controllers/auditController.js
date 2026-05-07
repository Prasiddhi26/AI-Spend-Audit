// controllers/auditController.js
// Controllers contain the actual LOGIC for each route.
// Think of controllers as the "chef" — routes just say "hey, someone ordered X",
// and the controller actually prepares the response.

const { v4: uuidv4 } = require("uuid");
// uuidv4() generates a random unique string like "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
// We'll trim it and use the first 12 characters as our auditId

const Audit = require("../models/Audit");

// -------------------------------------------------------------------
// @desc    Create a new audit and save it to the database
// @route   POST /api/audit
// @access  Public
// -------------------------------------------------------------------
const createAudit = async (req, res) => {
  try {
    // Step 1: Extract data from the request body
    // req.body is the JSON object the frontend sent us
    const { tools, teamSize, useCase } = req.body;

    // Step 2: Basic validation — check required fields are present
    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      // 400 = Bad Request (client sent something wrong)
      return res.status(400).json({
        success: false,
        message: "Please provide at least one tool",
      });
    }

    if (!teamSize || teamSize < 1) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid team size",
      });
    }

    if (!useCase) {
      return res.status(400).json({
        success: false,
        message: "Please provide a use case",
      });
    }

    // Step 3: Generate a unique auditId
    // uuidv4() gives something like "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    // We remove the dashes and take the first 12 characters: "9b1deb4d3b7d"
    // This is short enough to be a URL slug: yourapp.com/audit/9b1deb4d3b7d
    const auditId = uuidv4().replace(/-/g, "").substring(0, 12);

    // Step 4: Create a new Audit document using our model
    // This does NOT save to DB yet — it just creates the object in memory
    const newAudit = new Audit({
      auditId,
      tools,
      teamSize,
      useCase,
      // results, totalMonthlySavings, totalAnnualSavings, aiSummary, isHighValue
      // all have defaults defined in the model — no need to set them here yet
      // The audit engine (Day 3) will update these fields later
    });

    // Step 5: Save to MongoDB
    // .save() returns the saved document with all fields (including _id, createdAt, etc.)
    const savedAudit = await newAudit.save();

    // Step 6: Send a success response back to the frontend
    // 201 = "Created" — standard HTTP status when something new was successfully saved
    return res.status(201).json({
      success: true,
      message: "Audit created successfully",
      data: savedAudit,
    });

  } catch (error) {
    // If something went wrong (DB error, validation error, etc.)
    console.error("Error in createAudit:", error.message);

    // Mongoose validation errors have a specific structure
    // We check for it and send a cleaner message
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// -------------------------------------------------------------------
// @desc    Fetch a single audit by its auditId (for shareable URL)
// @route   GET /api/audit/:id
// @access  Public
// -------------------------------------------------------------------
const getAudit = async (req, res) => {
  try {
    // req.params.id is the value from the URL
    // e.g. GET /api/audit/9b1deb4d3b7d → req.params.id = "9b1deb4d3b7d"
    const { id } = req.params;

    // Search MongoDB for a document where auditId matches
    const audit = await Audit.findOne({ auditId: id });

    // If no audit found with that ID, return 404
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: "Audit not found. The link may be invalid or expired.",
      });
    }

    // -------------------------------------------------------------------
    // IMPORTANT: Return only "public-safe" data
    // The shareable URL must NOT expose any personally identifiable info.
    // Email and company name are stored in the Lead model (separate collection),
    // so the Audit document itself doesn't have those fields.
    // But we explicitly pick only the fields we want to expose, just to be safe.
    // -------------------------------------------------------------------
    const publicAuditData = {
      auditId: audit.auditId,
      tools: audit.tools,
      teamSize: audit.teamSize,
      useCase: audit.useCase,
      results: audit.results,
      totalMonthlySavings: audit.totalMonthlySavings,
      totalAnnualSavings: audit.totalAnnualSavings,
      aiSummary: audit.aiSummary,
      isHighValue: audit.isHighValue,
      createdAt: audit.createdAt,
    };

    return res.status(200).json({
      success: true,
      data: publicAuditData,
    });

  } catch (error) {
    console.error("Error in getAudit:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// Export both controllers so routes can use them
module.exports = { createAudit, getAudit };