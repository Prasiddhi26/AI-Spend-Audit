// controllers/leadController.js
// Handles saving a user's email after they've seen their audit results.
// This is the "email gate" — value is shown FIRST, then email is captured.

const Lead = require("../models/Lead");
const Audit = require("../models/Audit");

// -------------------------------------------------------------------
// @desc    Save a lead (email + optional details) linked to an audit
// @route   POST /api/lead
// @access  Public
// -------------------------------------------------------------------
const createLead = async (req, res) => {
  try {
    // Step 1: Extract data from request body
    const { auditId, email, companyName, role } = req.body;

    // Step 2: Validate required fields
    if (!auditId) {
      return res.status(400).json({
        success: false,
        message: "auditId is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Step 3: Check that the audit this lead belongs to actually exists
    // We don't want orphan leads pointing to non-existent audits
    const auditExists = await Audit.findOne({ auditId });

    if (!auditExists) {
      return res.status(404).json({
        success: false,
        message: "No audit found with that ID. Cannot save lead.",
      });
    }

    // Step 4: Check if this email has already submitted for this audit
    // Prevents duplicate leads from the same person refreshing the page
    const existingLead = await Lead.findOne({ auditId, email });

    if (existingLead) {
      // We return 200 (not an error) because this isn't really wrong —
      // the user already submitted. We just don't save a duplicate.
      return res.status(200).json({
        success: true,
        message: "You've already submitted your email for this audit.",
        data: existingLead,
      });
    }

    // Step 5: Create the lead document
    const newLead = new Lead({
      auditId,
      email,
      companyName: companyName || "", // optional, default to empty string
      role: role || "",               // optional, default to empty string
    });

    // Step 6: Save to MongoDB
    const savedLead = await newLead.save();

    // Step 7: (Placeholder) — In Day 4, we'll trigger a confirmation email here
    // via Resend API. For now, we just log it.
    console.log(`📧 New lead saved: ${email} for audit ${auditId}`);

    // Step 8: Send success response
    // Note: We do NOT send back the email in the response data
    // (good habit — don't expose PII unnecessarily in API responses)
    return res.status(201).json({
      success: true,
      message: "Email captured successfully. Check your inbox for your report!",
      data: {
        auditId: savedLead.auditId,
        submittedAt: savedLead.createdAt,
      },
    });

  } catch (error) {
    console.error("Error in createLead:", error.message);

    // Handle Mongoose validation errors (e.g., invalid email format)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

module.exports = { createLead };