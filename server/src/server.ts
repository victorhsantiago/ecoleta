import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes'
import { errors } from 'celebrate'

const app = express()

app.use(cors())
app.use(express.json())

routes(app)

app.use(
  '/uploads/icons',
  express.static(path.resolve(__dirname, '..', 'uploads', 'icons'))
)
app.use(
  '/uploads/images',
  express.static(path.resolve(__dirname, '..', 'uploads', 'images'))
)

app.use(errors())

app.listen(3333)
