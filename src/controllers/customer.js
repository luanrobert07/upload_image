const CustomersModel = require('../models/customer')
const { getFileUrl } = require('../google-drive')

const listTitle = 'Listagem de usuários'

async function list(req, res) {
    // Busca os clientes cadastrados no banco de dados
    const users = await CustomersModel.find()

    // Adiciona a URL do arquivo de cada usuário na lista
    for (const user of users) {
        user.url = getFileUrl(user.fileId)
    }
  
    // Renderiza a página de listagem com o título e a lista de clientes buscados
    res.render('list', {
      title: listTitle,
      users,
    })
}

module.exports ={
    list,
}
