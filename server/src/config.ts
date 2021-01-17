export const config = {
  port: process.env.PORT || 9000,
  db: {
    host: process.env.DB_HOST || 'localhost:27017',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'secret',
  },
};
