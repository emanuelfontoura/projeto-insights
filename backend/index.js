const conn = require('./database/conn.js')
const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

// importação dos models
const User = require('./models/User.js')
const Insight = require('./models/Insight.js')
const UserOTPVerification = require('./models/UserOTPVerification.js')

// importação das rotas
const userRoutes = require('./routes/userRoutes.js')
const insightsRoutes = require('./routes/insightRoutes.js')

// configurando o CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' 
}))

// middleware para conversão da requisição entre objeto js e json
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

// implementação das rotas
// rotas de usuário (auth)
app.use('/user', userRoutes)
app.use('/insights', insightsRoutes)

// middleware para definir path de arquivos estáticos
app.use(express.static('public'))

// conexão e sincronização do banco de dados
conn.sync()
// conn.sync({force: true})
.then(() => {
    const port = 5000
    app.listen(port)
    console.log(`Servidor conectado na porta ${port}`)
})
.catch(error => {
    console.log('Erro ao tentar sincronizar o banco de dados!')
    console.log( error)
})