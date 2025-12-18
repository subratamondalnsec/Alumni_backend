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
const authRoutes = require("./routes/StudentAuthRoutes");

// Health check endpoint
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Alumni Connect API is running successfully!",
        timestamp: new Date().toISOString()
    });
});

// Mount routes
app.use("/api/v1/auth", authRoutes);



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
