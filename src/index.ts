import Config from 'src/services/config/Config';
import configSchema from 'src/services/config/Schema';
import Logger from 'src/services/logger/Logger';
import Database from 'src/services/database/Database';
import HttpServer from 'src/services/http-server/HttpServer';
import IndexHttpController from 'src/http-controllers/IndexController';

Config.load(configSchema);

const logger = new Logger(Config.getLoggerConfig());

Database.setConfig(Config.getDatabaseConfig());
const database = Database.getInstance(logger);

HttpServer.setConfig(Config.getHttpServerConfig());
const httpServer = HttpServer.getInstance(logger);

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

httpServer.registerController(new IndexHttpController(logger));
httpServer
    .start()
    .then(() => {
        logger.info('Successfully started HTTP server');
    })
    .catch((err) => {
        logger.error('Failed to start HTTP server', {
            err: err.message,
        });

        process.exit(1);
    });
