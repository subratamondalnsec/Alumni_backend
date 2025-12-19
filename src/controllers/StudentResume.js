const Student = require("../models/StudentModel");
const { uploadPdfToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;

// Helper function to calculate profile completeness
function calculateProfileCompleteness(student) {
    let score = 0;
    const fields = [
        { field: student.firstName, weight: 8 },
        { field: student.lastName, weight: 8 },
        { field: student.email, weight: 8 },
        { field: student.image, weight: 4 },
        { field: student.college, weight: 12 },
        { field: student.branch, weight: 10 },
        { field: student.graduationYear, weight: 10 },
        { field: student.skills && student.skills.length > 0, weight: 10 },
        { field: student.projects && student.projects.length > 0, weight: 10 },
        { field: student.certifications && student.certifications.length > 0, weight: 5 },
        { field: student.preferredRoles && student.preferredRoles.length > 0, weight: 5 },
        { field: student.resume && student.resume.url, weight: 10 },
    ];

    fields.forEach(({ field, weight }) => {
        if (field) score += weight;
    });

    return score;
}

// Upload Resume
exports.uploadResume = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Check if file is present
        if (!req.files || !req.files.resume) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required",
            });
        }

        const resumeFile = req.files.resume;

        // // Validate file type (PDF only)
        // const supportedTypes = ["pdf"];
        // const fileType = resumeFile.name.split(".").pop().toLowerCase();

        // if (!supportedTypes.includes(fileType)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Only PDF files are supported",
        //     });
        // }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (resumeFile.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "File size should not exceed 5MB",
            });
        }

        // Find student
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Check if student already has a resume
        if (student.resume && student.resume.url) {
            return res.status(400).json({
                success: false,
                message: "Resume already exists. Use update endpoint to replace it.",
            });
        }

        // Upload to Cloudinary
        const uploadedResume = await uploadPdfToCloudinary(
            resumeFile,
            "job-portal-resumes",
            "raw"
        );

        // Update student with resume details
        student.resume = {
            url: uploadedResume.secure_url,
            public_id: uploadedResume.public_id,
            uploadedAt: new Date(),
        };

        // Calculate and update profile completeness
        student.profileCompleteness = calculateProfileCompleteness(student);

        await student.save();

        return res.status(200).json({
            success: true,
            data: {
                resume: student.resume,
                profileCompleteness: student.profileCompleteness,
            },
            message: "Resume uploaded successfully",
        });

    } catch (error) {
        console.error("Resume upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload resume. Please try again.",
        });
    }
};

// Replace/Update Resume
exports.updateResume = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Check if file is present
        if (!req.files || !req.files.resume) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required",
            });
        }

        const resumeFile = req.files.resume;

        // // Validate file type (PDF only)
        // const supportedTypes = ["pdf"];
        // const fileType = resumeFile.name.split(".").pop().toLowerCase();

        // if (!supportedTypes.includes(fileType)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Only PDF files are supported",
        //     });
        // }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (resumeFile.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "File size should not exceed 5MB",
            });
        }

        // Find student
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Delete old resume from Cloudinary if exists
        if (student.resume && student.resume.public_id) {
            try {
                await cloudinary.uploader.destroy(student.resume.public_id);
            } catch (deleteError) {
                console.error("Error deleting old resume:", deleteError);
                // Continue even if deletion fails
            }
        }

        // Upload new resume to Cloudinary
        const uploadedResume = await uploadPdfToCloudinary(
            resumeFile,
            "job-portal-resumes",
            "raw"
        );

        // Update student with new resume details
        student.resume = {
            url: uploadedResume.secure_url,
            public_id: uploadedResume.public_id,
            uploadedAt: new Date(),
        };

        // Calculate and update profile completeness
        student.profileCompleteness = calculateProfileCompleteness(student);

        await student.save();

        return res.status(200).json({
            success: true,
            data: {
                resume: student.resume,
                profileCompleteness: student.profileCompleteness,
            },
            message: "Resume updated successfully",
        });

    } catch (error) {
        console.error("Resume update error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update resume. Please try again.",
        });
    }
};

// Get Resume Details
exports.getResume = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Find student
        const student = await Student.findById(studentId).select("resume");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        if (!student.resume || !student.resume.url) {
            return res.status(404).json({
                success: false,
                message: "No resume found",
            });
        }

        return res.status(200).json({
            success: true,
            data: student.resume,
            message: "Resume details fetched successfully",
        });

    } catch (error) {
        console.error("Get resume error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch resume. Please try again.",
        });
    }
};

// Delete Resume
exports.deleteResume = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Find student
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        if (!student.resume || !student.resume.url) {
            return res.status(404).json({
                success: false,
                message: "No resume found to delete",
            });
        }

        // Delete resume from Cloudinary
        if (student.resume.public_id) {
            try {
                await cloudinary.uploader.destroy(student.resume.public_id);
            } catch (deleteError) {
                console.error("Error deleting resume from Cloudinary:", deleteError);
            }
        }

        // Remove resume from student document
        student.resume = undefined;

        // Recalculate profile completeness
        student.profileCompleteness = calculateProfileCompleteness(student);

        await student.save();

        return res.status(200).json({
            success: true,
            data: {
                profileCompleteness: student.profileCompleteness,
            },
            message: "Resume deleted successfully",
        });

    } catch (error) {
        console.error("Delete resume error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete resume. Please try again.",
        });
    }
};
