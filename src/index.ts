import Database from 'src/components/Database';
import Logger from 'src/components/Logger';
import Server from 'src/components/server/Server';
import Config from 'src/config/Config';
import ConfigSchema from 'src/config/Schema';
import BadgeController from 'src/controllers/BadgeController';
import IndexController from 'src/controllers/IndexController';
import ProjectController from 'src/controllers/ProjectController';
import ProjectRepository from 'src/repositories/ProjectRepository';

Config.load(ConfigSchema);

const logger = new Logger(Config.getLoggerConfig());
logger.info('Application started');

Server.setConfig(Config.getServerConfig());
const server = Server.getInstance(logger);

Database.setConfig(Config.getDatabaseConfig());
const database = Database.getInstance(logger);

const projectRepository = new ProjectRepository(database);

server.useRouter('/', new IndexController(logger).getRouter());
server.useRouter('/project', new ProjectController(logger, projectRepository).getRouter());
server.useRouter('/badge', new BadgeController(logger, projectRepository).getRouter());

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
