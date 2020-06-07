import express from 'express'
import multer from 'multer'

import PointsController from '../../controllers/PointsController'

import multerConfig from '../../configs/multer'
import validatePoint from '../validators/point'

const routes = express.Router()
const upload = multer(multerConfig)

const pointsController = new PointsController()

routes.get('/', pointsController.index)
routes.get('/:id', pointsController.show)
routes.post('/', upload.single('image'), validatePoint, pointsController.create)

export default routes
