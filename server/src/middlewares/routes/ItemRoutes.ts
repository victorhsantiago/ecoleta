import express from 'express'
import ItemsController from '../../controllers/ItemsController'

const routes = express.Router()

const itemsController = new ItemsController()

routes.get('/', itemsController.index)

export default routes
