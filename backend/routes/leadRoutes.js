// routes/leadRoutes.js

const express = require("express");
const router = express.Router();

const { createLead } = require("../controllers/leadController");

// -------------------------------------------------------------------
// POST /api/lead
// Called when user submits their email on the results page
// Body: { auditId: string, email: string, companyName?: string, role?: string }
// -------------------------------------------------------------------
router.post("/", createLead);

module.exports = router;