
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('search_history').del()
    .then(function () {
      // Inserts seed entries
      return knex('search_history').insert([
        {location: 'San Francisco',user_id:knex('user').where('user_name','Marc Benioff').select('id')},
        {location: 'New York',user_id:knex('user').where('user_name','Eric Berridge ').select('id')},
        {location: 'Aspen',user_id:knex('user').where('user_name','Codey the Bear').select('id')},
      ]);
    });
};
