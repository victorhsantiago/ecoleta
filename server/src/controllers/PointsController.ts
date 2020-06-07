import { Request, Response } from 'express'
import knex from '../database/connection'

class PointsController {
  async index(req: Request, res: Response) {
    const { city, state, items } = req.query

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()))

    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parsedItems)
      .where('city', String(city))
      .where('state', String(state))
      .distinct()
      .select('points.*')

    const serializedPoints = points.map((point) => ({
      ...point,
      image_url: `http://192.168.0.29:3333/uploads/images/${point.image}`,
    }))

    return res.json(serializedPoints)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const point = await knex('points').where('id', id).first()

    if (!point) return res.status(400).json({ message: 'Point not found.' })

    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id)
      .select('items.title', 'items.image')

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.29:3333/uploads/images/${point.image}`,
    }

    const serializedItems = items.map((item) => ({
      title: item.title,
      image_url: `http://localhost:3333/uploads/icons/${item.image}`,
    }))

    return res.json({ ...serializedPoint, items: serializedItems })
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      state,
      items,
    } = req.body

    const trx = await knex.transaction()

    const [id] = await trx('points').insert({
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      state,
    })

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => ({
        item_id,
        point_id: id,
      }))

    await trx('points_items').insert(pointItems)

    await trx.commit()

    return res.json({ success: true })
  }
}

export default PointsController
