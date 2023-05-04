// Importação dos módulos necessários
const stream = require("stream");
const { google } = require("googleapis");
const path = require("path");

// Caminho do arquivo de credenciais para autenticação com o Google Drive
const KEYFILEPATH = path.join(__dirname, "credentials.json");

// Escopos de acesso autorizados para a aplicação
const SCOPES = ["https://www.googleapis.com/auth/drive"];

// Cria uma instância de autenticação do Google com as credenciais e escopos especificados
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Função assíncrona para realizar upload de um arquivo para o Google Drive
const uploadFile = async (fileObject, newName) => {
  // Cria um stream de buffer para o conteúdo do arquivo a ser enviado
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  
  // Cria uma nova entrada de arquivo no Google Drive com o conteúdo do stream criado acima
  const { data } = await google.drive({ version: "v3", auth }).files.create({
    media: {
      mimeType: fileObject.mimetype, // Define o tipo MIME do arquivo a ser enviado
      body: bufferStream, // Define o conteúdo do arquivo a ser enviado
    },
    requestBody: {
      name: newName, // Define o novo nome do arquivo a ser enviado
      parents: ["1I9eZW5ioEgxH0VT3oTalAc5XyVSxVTU0"], // Define a pasta de destino do arquivo a ser enviado
    },
    fields: "id,name", // Define os campos que devem ser retornados como resposta ao upload
  });
  
  // Exibe uma mensagem com o nome e ID do arquivo enviado
  console.log(`Uploaded file ${data.name} ${data.id}`);
  
  // Retorna os dados do arquivo enviado
  return data;
};

// Prefixo do link de visualização de um arquivo do Google Drive
const DRIVE_URL_PREFIX = "https://drive.google.com/uc?export=view&id=";

// Função para gerar o link de visualização de um arquivo no Google Drive
const getFileUrl = (fileId) => {
  return DRIVE_URL_PREFIX + fileId;
};

// Exporta as funções de upload e geração de link de visualização como um módulo
module.exports = { uploadFile, getFileUrl };
