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
    connection: process.env.DATABASE_URL || 'dark-sky',

    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    useNUllAsDefault:true
  }

};
