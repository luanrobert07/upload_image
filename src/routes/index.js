const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const File = require("../models/customer");
const { uploadFile, getFileUrl } = require("../services/upload");

const uploadRouter = express.Router();
const upload = multer();

const DEFAULT_FILE_NAME = "my-file.jpg";

let fileData = {};

uploadRouter.post("/upload", upload.any(), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);
    const { body, files } = req;

    for (let f = 0; f < files.length; f += 1) {
      fileData = await uploadFile(files[f], DEFAULT_FILE_NAME);
      const newFile = new File({
        name: fileData.name,
        url: getFileUrl(fileData.id),
      });
      await newFile.save();
    }

    console.log(body);
    res.status(200).send("Form Submitted");
  } catch (f) {
    res.send(f.message);
  }
});

module.exports = uploadRouter;
