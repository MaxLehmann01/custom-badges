import {
    TBasicAuthConfig,
    TConfigSchema,
    TDatabaseConfig,
    THttpServerConfig,
    TLoggerConfig,
} from 'src/services/config/Types';
import { CorsOptions } from 'cors';
import path from 'path';

export default class Config {
    private static values: Record<string, string | number | boolean | undefined> = {};

    public static load(schema: TConfigSchema): void {
        this.values = {};

        for (const key of Object.keys(schema)) {
            const definition = schema[key];
            const rawValue = process.env[key];

            if (rawValue === undefined) {
                if (definition.required) {
                    throw new Error(`missing required environment variable: ${key}`);
                }

                Config.values[key] = definition.defaultValue;
                continue;
            }

            switch (definition.type) {
                case 'string': {
                    Config.values[key] = rawValue;
                    break;
                }
                case 'number': {
                    const numberValue = Number(rawValue);
                    if (isNaN(numberValue)) {
                        throw new Error(`invalid value for environment variable: ${key} - expected: number`);
                    }

                    Config.values[key] = numberValue;
                    break;
                }
                case 'boolean': {
                    const lowerRawValue = rawValue.toLowerCase();

                    if (lowerRawValue !== 'true' && lowerRawValue !== 'false') {
                        throw new Error(`invalid value for environment variable: ${key} - expected: boolean`);
                    }

                    Config.values[key] = lowerRawValue === 'true';
                    break;
                }
                default: {
                    throw new Error(`Unknown type for environment variable: ${key}`);
                }
            }
        }
    }

    public static get<T extends string | number | boolean>(key: string): T {
        const value = Config.values[key];

        if (value === undefined) {
            throw new Error(`missing requested environment variable: ${key}`);
        }

        return value as T;
    }

    public static getLoggerConfig(): TLoggerConfig {
        return {
            level: Config.get<string>('LOG_LEVEL'),
            directory: '/app/logs',
        };
    }

    public static getDatabaseConfig(): TDatabaseConfig {
        return {
            host: Config.get<string>('DB_HOST'),
            port: Config.get<number>('DB_PORT'),
            database: Config.get<string>('DB_NAME'),
            schema: 'public',
            user: Config.get<string>('DB_USER'),
            password: Config.get<string>('DB_PASSWORD'),
            ssl: Config.get<boolean>('DB_SSL'),
            migrationsDirectory: '/app/migrations',
        };
    }

    public static getHttpServerConfig(): THttpServerConfig {
        return {
            port: 80,
            corsOptions: Config.getCorsOptions(),
            viewsDirectory: path.join(__dirname, '../../views'),
            publicDirectory: path.join(process.cwd(), 'public'),
        };
    }

    public static getBasicAuthConfig(): TBasicAuthConfig {
        return {
            username: Config.get<string>('BASIC_AUTH_USERNAME'),
            password: Config.get<string>('BASIC_AUTH_PASSWORD'),
        };
    }

    private static getCorsOptions(): CorsOptions {
        const whitelist = Config.get<string>('CORS_WHITELIST').split(',');

        return {
            credentials: true,
            origin: (origin, callback) => {
                if (!origin || whitelist.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'), false);
                }
            },
        };
    }
}
