import 'reflect-metadata'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import { createConnection } from 'typeorm'
import router from './api'

const PORT = 3001

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/', router)

app.use((_, res) => {
  res.status(404).send('Unable to find the requested resource.')
})

createConnection().then(() => {
  app.listen(PORT, () => {
    console.clear()
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
})
