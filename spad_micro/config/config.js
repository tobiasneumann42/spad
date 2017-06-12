//  config.js
//
//  Simple application configuration. Extend as needed.
module.exports = {
    certFile: '/app/sslcert/spad_micro.cer',
    privKeyFile: '/app/sslcert/spad_micro.key',
    port: process.env.PORT || 8443,
  db: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    database: 'spad',
    user: 'spad_service',
    password: '123',
    port: 3306
  }
};
