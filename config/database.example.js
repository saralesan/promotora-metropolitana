module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'example_database'),
        username: env('DATABASE_USERNAME', 'example_username'),
        password: env('DATABASE_PASSWORD', 'example_password'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
