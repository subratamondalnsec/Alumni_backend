const Application = require("../models/ApplicationModel");
const Opportunity = require("../models/OpportunityModel");
const Student = require("../models/StudentModel");
const Alumni = require("../models/AlumniModel");


// View Applications for an Opportunity
exports.viewApplications = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { opportunityId } = req.params;

        // Find opportunity
        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        // Check if the alumni is the owner of the opportunity
        if (opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view applications for this opportunity",
            });
        }

        // Find all applications for this opportunity
        const applications = await Application.find({
            opportunity: opportunityId,
        })
        .populate('student', 'firstName lastName email college branch graduationYear skills profileCompleteness image')
        .populate('opportunity', 'jobTitle experienceLevel')
        .sort({ createdAt: -1 });

        // Group applications by status
        const groupedApplications = {
            applied: applications.filter(app => app.status === "Applied"),
            shortlisted: applications.filter(app => app.status === "Shortlisted"),
            referred: applications.filter(app => app.status === "Referred"),
            rejected: applications.filter(app => app.status === "Rejected"),
        };

        return res.status(200).json({
            success: true,
            total: applications.length,
            data: {
                all: applications,
                grouped: groupedApplications,
                counts: {
                    applied: groupedApplications.applied.length,
                    shortlisted: groupedApplications.shortlisted.length,
                    referred: groupedApplications.referred.length,
                    rejected: groupedApplications.rejected.length,
                }
            },
            message: "Applications fetched successfully",
        });

    } catch (error) {
        console.error("View applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications. Please try again.",
        });
    }
};



// View Student Profile (Read-Only)
exports.viewStudentProfile = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { studentId } = req.params;

        // Find student with full details
        const student = await Student.findById(studentId)
            .select("-password")
            .populate('college', 'name matchingName');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Verify that there's at least one application from this student to any opportunity posted by this alumni
        
        const alumni = await Alumni.findById(alumniId);
        
        if (!alumni || !alumni.college) {
            return res.status(400).json({
                success: false,
                message: "Alumni college information not found",
            });
        }

        // Check if student is from the same college
        if (student.college.toString() !== alumni.college.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only view profiles of students from your college",
            });
        }

        return res.status(200).json({
            success: true,
            data: student,
            message: "Student profile fetched successfully",
        });

    } catch (error) {
        console.error("View student profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student profile. Please try again.",
        });
    }
};

// Shortlist Student
exports.shortlistStudent = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { applicationId } = req.params;

        // Find application
        const application = await Application.findById(applicationId)
            .populate('opportunity')
            .populate('student', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Check if the alumni is the owner of the opportunity
        if (application.opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to shortlist this application",
            });
        }

        // Check if already shortlisted or referred
        if (application.status === "Shortlisted") {
            return res.status(400).json({
                success: false,
                message: "Application is already shortlisted",
            });
        }

        if (application.status === "Referred") {
            return res.status(400).json({
                success: false,
                message: "Application is already referred. Cannot change status.",
            });
        }

        // Update application status
        application.status = "Shortlisted";
        application.shortlistedAt = new Date();
        await application.save();

        return res.status(200).json({
            success: true,
            data: application,
            message: "Student shortlisted successfully",
        });

    } catch (error) {
        console.error("Shortlist student error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to shortlist student. Please try again.",
        });
    }
};

// Mark as Referred
exports.markAsReferred = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { applicationId } = req.params;

        // Find application
        const application = await Application.findById(applicationId)
            .populate('opportunity')
            .populate('student', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Check if the alumni is the owner of the opportunity
        if (application.opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this application",
            });
        }

        // Check if already referred
        if (application.status === "Referred") {
            return res.status(400).json({
                success: false,
                message: "Application is already marked as referred",
            });
        }

        // Update application status
        application.status = "Referred";
        application.referredAt = new Date();
        
        // If not already shortlisted, set shortlisted date as well
        if (!application.shortlistedAt) {
            application.shortlistedAt = new Date();
        }

        await application.save();

        return res.status(200).json({
            success: true,
            data: application,
            message: "Application marked as referred successfully",
        });

    } catch (error) {
        console.error("Mark as referred error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark application as referred. Please try again.",
        });
    }
};

// Reject Application
exports.rejectApplication = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const { applicationId } = req.params;

        // Find application
        const application = await Application.findById(applicationId)
            .populate('opportunity');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Check if the alumni is the owner of the opportunity
        if (application.opportunity.postedBy.toString() !== alumniId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this application",
            });
        }

        // Check if already referred
        if (application.status === "Referred") {
            return res.status(400).json({
                success: false,
                message: "Cannot reject an application that has been referred",
            });
        }

        // Update application status
        application.status = "Rejected";
        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application rejected successfully",
        });

    } catch (error) {
        console.error("Reject application error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject application. Please try again.",
        });
    }
};
