// routes/auditRoutes.js
// Routes are like a "menu" — they tell Express what to do when a specific
// HTTP method + URL path is hit. The actual work happens in the controller.

const express = require("express");
const router = express.Router();

// Import the controller functions we wrote
const { createAudit, getAudit } = require("../controllers/auditController");

// -------------------------------------------------------------------
// POST /api/audit
// Called when frontend submits the audit form
// Body: { tools: [...], teamSize: number, useCase: string }
// -------------------------------------------------------------------
router.post("/", createAudit);

// -------------------------------------------------------------------
// GET /api/audit/:id
// Called when someone opens a shareable audit link
// :id is the dynamic auditId in the URL e.g. /api/audit/9b1deb4d3b7d
// -------------------------------------------------------------------
router.get("/:id", getAudit);

module.exports = router;