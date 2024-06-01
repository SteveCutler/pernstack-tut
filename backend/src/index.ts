import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from '../src/routes/auth.route.js'
import messageRoutes from '../src/routes/message.route.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json()) // for parsing application/json

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.listen(5000, () => {
    console.log('Server is running on port 5000')
})
