const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
    'getapet',
    'root',
    '1909',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)

try{
    sequelize.authenticate()
}catch(error){
    console.log('Erro ao tentar autenticar o banco de dados!')
    console.log(error)
}

module.exports = sequelize