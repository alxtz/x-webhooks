module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      database: "xendit_webhook",
      user: "root",
      password: "root",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds`,
    },
  },
};
