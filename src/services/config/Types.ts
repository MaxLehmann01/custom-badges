import { CorsOptions } from 'cors';

type TConfigField =
    | {
          type: 'string';
          required: boolean;
          defaultValue?: string;
      }
    | {
          type: 'number';
          required: boolean;
          defaultValue?: number;
      }
    | {
          type: 'boolean';
          required: boolean;
          defaultValue?: boolean;
      };

type TConfigSchema = {
    [key: string]: TConfigField;
};

type TLoggerConfig = {
    level: string;
    directory: string;
};

type TDatabaseConfig = {
    host: string;
    port: number;
    database: string;
    schema: string;
    user: string;
    password: string;
    ssl: boolean;
    migrationsDirectory: string;
};

type THttpServerConfig = {
    port: number;
    corsOptions: CorsOptions;
    viewsDirectory: string;
    publicDirectory: string;
};

export type { TConfigSchema, TLoggerConfig, TDatabaseConfig, THttpServerConfig };
