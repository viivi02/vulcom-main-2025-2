import dotenv from 'dotenv'
dotenv.config() // Carrega as variáveis de ambiente do arquivo .env

import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

const app = express()

import cors from 'cors'

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true
}))

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

// Rate limiter: limita a quantidade de requisições que cada usuário/IP
// pode efetuar dentro de um determinado intervalo de tempo
import { rateLimit } from 'express-rate-limit'

/*
Vulnerabilidade : API6:2023 - Acesso irrestrito a fluxo de negócios sensíveis. Aqui a quantidade de requisições por usuários é resolvida
e problemas como verificação se a placa existe tambem nao existe o que pode ser uma grande brecha dentro da regra
de negocio, dentro de CarForm é mostrada a usuario uma lista de clientes evitando o cadastro de clientes invalidos. nas partes principais
a vulnerabilidade é evitada mais ainda assim com algumas brechas.
*/


const limiter = rateLimit({
 windowMs: 60 * 1000,    // Intervalo: 1 minuto
 limit: 20               // Máximo de 20 requisições
})


app.use(limiter)

/*********** ROTAS DA API **************/

// Middleware de verificação do token de autorização
import auth from './middleware/auth.js'
app.use(auth)

import carsRouter from './routes/cars.js'
app.use('/cars', carsRouter)

import customersRouter from './routes/customers.js'
app.use('/customers', customersRouter)

import usersRouter from './routes/users.js'
app.use('/users', usersRouter)

export default app
