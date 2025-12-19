const cloudinary = require("cloudinary").v2

exports.uploadPdfToCloudinary = async (
  file,
  folder,
  file_type,
  height,
  quality
) => {
  const options = {
    folder,
    resource_type: file_type, 
    use_filename: true,       
    unique_filename: false,   
    format: "pdf",            
  }

  if (height) options.height = height
  if (quality) options.quality = quality

  console.log("OPTIONS", options)

  return await cloudinary.uploader.upload(file.tempFilePath, options)
}
