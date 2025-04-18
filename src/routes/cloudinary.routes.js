
const express = require("express");
const router = express.Router();
const { upload, uploadToCloudinary } = require("./cloudinaryConfig");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const folder = req.body.folder; // Multer correctly extracts form fields
    if (!folder) {
      return res.status(400).json({ message: "Folder name is required" });
    }
    const result = await uploadToCloudinary(req.file.buffer, { folder });
    res.json({
      message: "File uploaded successfully",
      file: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file" });
  }
});

module.exports = router;