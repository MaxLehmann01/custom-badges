import Config from 'src/config/Config';
import ConfigSchema from 'src/config/Schema';
import Logger from 'src/components/Logger';
import Server from 'src/components/server/Server';
import IndexController from 'src/controllers/IndexController';
import BadgeController from 'src/controllers/BadgeController';
import ProjectRepository from 'src/repositories/ProjectRepository';
import BadgeRepository from 'src/repositories/BadgeRepository';
import Database from 'src/components/Database';

Config.load(ConfigSchema);

const logger = new Logger(Config.getLoggerConfig());
logger.info('Application started');

Server.setConfig(Config.getServerConfig());
const server = Server.getInstance(logger);

Database.setConfig(Config.getDatabaseConfig());
const database = Database.getInstance(logger);

const projectRepository = new ProjectRepository(database);
const badgeRepository = new BadgeRepository();

server.useRouter('/', new IndexController(logger).getRouter());
server.useRouter('/badge', new BadgeController(logger, projectRepository, badgeRepository).getRouter());

server
    .start()
    .then(() => {
        logger.info('Server started successfully');
    })
    .catch((error) => {
        logger.error('Failed to start server:', error);
        process.exit(1);
    });

database
    .start()
    .then(() => {
        logger.info('Database connection established successfully');
    })
    .catch((error) => {
        logger.error('Failed to connect to database:', error);
        process.exit(1);
    });
