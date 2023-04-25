const stream = require("stream");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017");

// conexão com o banco de dados
const db = mongoose.connection;

// Uma vez conectado retorna isso
db.once("open", () => {
  console.log("Connected to database!");
});

// Se der ruim imprimi isso
db.on("error", console.error.bind(console, "connection error: "));

const uploadRouter = express.Router();
const upload = multer();

const KEYFILEPATH = path.join(__dirname, "credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Definindo o schema do arquivo
const fileSchema = new mongoose.Schema({
  name: String,
  url: String,
});

// Definindo o modelo do arquivo
const File = mongoose.model("File", fileSchema);

const uploadFile = async (fileObject, newName) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await google.drive({ version: "v3", auth }).files.create({
    media: {
      mimeType: fileObject.mimetype,
      body: bufferStream,
    },
    requestBody: {
      name: newName,
      parents: ["1I9eZW5ioEgxH0VT3oTalAc5XyVSxVTU0"],
    },
    fields: "id,name",
  });
  console.log(`Uploaded file ${data.name} ${data.id}`);
  return data;
};

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
        url: DRIVE_URL_PREFIX + fileData.id,
      });
      await newFile.save();
    }

    console.log(body);
    res.status(200).send("Form Submitted");
  } catch (f) {
    res.send(f.message);
  }
});

const DRIVE_URL_PREFIX = "https://drive.google.com/uc?export=view&id=";

const getFileUrl = () => {
  return DRIVE_URL_PREFIX + fileData.id; // url para a imagem
};

uploadRouter.get("/fileUrl", (req, res) => {
  res.status(200).send(getFileUrl());
});

module.exports = uploadRouter;
