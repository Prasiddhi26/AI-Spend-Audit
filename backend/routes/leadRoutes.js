// routes/leadRoutes.js

import express from "express";
const router = express.Router();

import{ createLead } from "../controllers/leadController.js";

// -------------------------------------------------------------------
// POST /api/lead
// Called when user submits their email on the results page
// Body: { auditId: string, email: string, companyName?: string, role?: string }
// -------------------------------------------------------------------
router.post("/", createLead);

export default router;