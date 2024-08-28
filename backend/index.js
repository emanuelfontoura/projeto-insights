const conn = require('./db/conn.js')
const express = require('express')
const app = express()
require('dotenv').config()

// variáveis do .env
const SECRET = process.env.JWT_SECRET

// importação das rotas
const authRoutes = require('./routes/authRoutes.js')

// implementação das rotas
app.use('', authRoutes)

// middleware para conversão da requisição entre objeto js e json
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

// middleware para definir path de arquivos estáticos
app.use(express.static('public'))

// conexão e sincronização do banco de dados
conn.sync()
.then(() => {
    const port = 3000
    app.listen(port)
    console.log(`Servidor conectado na porta ${port}`)
})
.catch(error => {
    console.log('Erro ao tentar sincronizar o banco de dados!')
    console.log( error)
})