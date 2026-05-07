// models/Lead.js
// This file defines what a "Lead" document looks like in MongoDB.
// A lead is created when a user submits their email after seeing their audit results.
// We keep leads SEPARATE from audits so that:
//   - The public shareable URL can show audit data without exposing the email
//   - We can query leads independently (for CRM / sales team use)

const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    // auditId links this lead to the audit that generated it
    // This is the same custom string ID we generate (not MongoDB's _id)
    auditId: {
      type: String,
      required: [true, "auditId is required to link this lead to an audit"],
      trim: true,
    },

    // The user's email address — required to create a lead
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true, // always store emails in lowercase to avoid duplicates like "Test@email.com" vs "test@email.com"
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        // This regex checks that the email looks valid (basic format check)
        "Please enter a valid email address",
      ],
    },

    // Optional fields — not required, but nice to have for sales team
    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    // timestamps: true adds submittedAt equivalent via createdAt + updatedAt
    timestamps: true,
  }
);

// Export the model
// This creates a "leads" collection in MongoDB
module.exports = mongoose.model("Lead", LeadSchema);