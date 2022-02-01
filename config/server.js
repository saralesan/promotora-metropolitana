module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  //url: 'localhost',
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '34e9ddee4824d94ce6cd6b8cbb26ea54'),
    },
  },
});
