import Config from 'src/services/config/Config';
import configSchema from 'src/services/config/Schema';
import Logger from 'src/services/logger/Logger';
import Database from 'src/services/database/Database';

Config.load(configSchema);

const logger = new Logger(Config.getLoggerConfig());

Database.setConfig(Config.getDatabaseConfig());
const database = Database.getInstance(logger);

logger.info('Application started', {
    NODE_ENV: Config.get<string>('NODE_ENV'),
    TZ: Config.get<string>('TZ'),
});

database
    .start()
    .then(async () => {
        logger.info('Successfully connected to database');

        await database.migrate();
    })
    .catch((err) => {
        logger.error('Failed to connect to database', {
            err: err.message,
        });

        process.exit(1);
    });
