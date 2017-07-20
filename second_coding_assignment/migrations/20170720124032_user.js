
exports.up = function(knex, Promise) {
  return knex.schema.createTable('weather_user', (table) => {
    table.increments();
    table.text('user_name');
    table.text('email');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('weather_user');
};
