import Knex from 'knex'

export const up = (knex: Knex) =>
  knex.schema.createTable('points_items', (table) => {
    table.increments('id').primary()
    table.integer('point_id').notNullable().references('id').inTable('points')
    table.integer('item_id').notNullable().references('id').inTable('items')
  })

export const down = (knex: Knex) => knex.schema.dropTable('points_items')
