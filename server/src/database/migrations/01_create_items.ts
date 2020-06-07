import Knex from 'knex'

export const up = (knex: Knex) =>
  knex.schema.createTable('items', (table) => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('title').notNullable()
  })

export const down = (knex: Knex) => knex.schema.dropTable('items')
