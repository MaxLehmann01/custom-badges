import { TConfigSchema } from 'src/services/config/Types';

export default {
    NODE_ENV: {
        type: 'string',
        required: true,
    },
    TZ: {
        type: 'string',
        required: true,
    },
    LOG_LEVEL: {
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
    DB_NAME: {
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
    },
    CORS_WHITELIST: {
        type: 'string',
        required: true,
    },
} as TConfigSchema;
