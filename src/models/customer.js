const mongoose = require('mongoose')

// Definindo o schema do arquivo
const fileSchema = new mongoose.Schema({
  name: String,
  url: String,
});

// Definindo o modelo do arquivo
const File = mongoose.model("File", fileSchema);

module.exports = File