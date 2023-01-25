import * as dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import cors from 'cors'
import express from 'express'
import connectDB from './config/db'

const staticSite = path.join(__dirname, '../build')
const PORT = process.env.PORT || 5000
const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(staticSite))

app.get('*', (req, res) => res.sendFile(staticSite))

connectDB()
app.listen(PORT, () => console.info(`API Listening on port ${PORT}`))
