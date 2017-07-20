
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {user_name: 'Marc Benioff', email:'thebigcheese@salesforce.com'},
        {user_name: 'Eric Berridge',email:'thebigenchilada@bluewolf.com'},
        {user_name: 'Codey the Bear',email:'kindofastar@trailhead.com'},
      ]);
    });
};
