// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_URL || 'dark-sky',
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,

    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },

  }

};
// this is a carry over from reddit-clone. it was set up a lil differently!
// connection: {
//     database: process.env.DATABASE_URL || 'reddit-clone',
//   }
