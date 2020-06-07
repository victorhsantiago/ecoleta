import { Express } from 'express'

import ItemsRoutes from './middlewares/routes/ItemRoutes'
import PointsRoutes from './middlewares/routes/PointsRoutes'

const routes = (app: Express) => {
  app.use('/items', ItemsRoutes)
  app.use('/points', PointsRoutes)
}

export default routes
