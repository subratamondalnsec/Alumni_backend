const express = require("express")
const {dbconnect} =require("./config/database")
const cloudinary = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
require("dotenv").config();
const cors = require("cors");


// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

const allowedOrigins = ["*"]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

// Setting up routes
const studentAuthRoutes = require("./routes/StudentAuthRoutes");
const profileRoutes = require("./routes/StudentProfileRoutes");
const resumeRoutes = require("./routes/StudentResumeRoutes");
const alumniAuthRoutes = require("./routes/AlumniAuthRoutes");
const alumniProfileRoutes = require("./routes/AlumniProfileRoutes");
const opportunityRoutes = require("./routes/OpportunityRoutes");
const applicationRoutes = require("./routes/ApplicationRoutes");

// Health check endpoint
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Alumni Connect API is running successfully!",
        timestamp: new Date().toISOString()
    });
});

// Mount routes
app.use("/api/v1/student", studentAuthRoutes);
app.use("/api/v1/student", profileRoutes);
app.use("/api/v1/student", resumeRoutes);
app.use("/api/v1/alumni", alumniAuthRoutes);
app.use("/api/v1/alumni", alumniProfileRoutes);
app.use("/api/v1", opportunityRoutes);
app.use("/api/v1", applicationRoutes);



const InitlizeConnection = async()=>{

    try{
        await dbconnect();
        console.log("connected to MongoDB");
        cloudinary.cloudinaryConnect();
         console.log("connected to Cloudinary");
        app.listen(PORT, ()=>{
            console.log(`https://localhost:${PORT}`);
        })
    }
    catch(err){
        console.log("Error "+err);
    }
}

InitlizeConnection();
