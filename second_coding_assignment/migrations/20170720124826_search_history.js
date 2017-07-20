
exports.up = function(knex, Promise) {
  return knex.schema.createTable('search_history', (table) => {
    table.increments()
    table.text('location').notNullable()
    table.integer('user_id').index().references('id').inTable('weather_user').onDelete('cascade').notNullable()
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('search_history');
};
