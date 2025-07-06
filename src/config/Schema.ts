import { ConfigSchema } from 'src/config/Types';

const schema: ConfigSchema = {
    NODE_ENV: {
        type: 'string',
        required: true,
    },
    LOG_LEVEL: {
        type: 'string',
        required: false,
        defaultValue: 'info',
    },
    LOG_DIRECTORY: {
        type: 'string',
        required: false,
        defaultValue: '/app/logs',
    },
    CORS_WHITELIST: {
        type: 'string',
        required: true,
    },
    DB_HOST: {
        type: 'string',
        required: true,
    },
    DB_PORT: {
        type: 'number',
        required: true,
    },
    DB_DATABASE: {
        type: 'string',
        required: true,
    },
    DB_SCHEMA: {
        type: 'string',
        required: true,
    },
    DB_USER: {
        type: 'string',
        required: true,
    },
    DB_PASSWORD: {
        type: 'string',
        required: true,
    },
    DB_SSL: {
        type: 'boolean',
        required: false,
        defaultValue: false,
    },
};

export default schema;
