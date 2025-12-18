const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    alumni: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumni",
        required: true,
    },
    status: {
        type: String,
        enum: ["Applied", "Shortlisted", "Referred", "Rejected"],
        default: "Applied",
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    shortlistedAt: {
        type: Date,
    },
    referredAt: {
        type: Date,
    },
}, { timestamps: true });

// Compound index to prevent duplicate applications
ApplicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
