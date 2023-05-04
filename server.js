const express = require("express");
const db = require('./src/database');

const uploadRouter = require("./src/routes/index");

const app = express();

// conexão com o banco de dados
db.connect()

app.use(express.static('public'));
app.use("/", uploadRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
