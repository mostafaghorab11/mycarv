var dbConfig = {
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: '**/*.entity.js',
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: '**/*.entity.ts',
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: '**/*.entity.js',
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    throw new Error('Invalid NODE_ENV');
}

module.exports = dbConfig;
