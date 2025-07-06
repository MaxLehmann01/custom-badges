import { CorsOptions } from 'cors';

type ConfigField =
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

type ConfigSchema = {
    [key: string]: ConfigField;
};

type LoggerConfig = {
    level: string;
    directory: string;
};

type ServerConfig = {
    port: number;
    corsOptions: CorsOptions;
};

type DatabaseConfig = {
    host: string;
    port: number;
    database: string;
    schema: string;
    user: string;
    password: string;
    ssl: boolean;
};

export type { ConfigField, ConfigSchema, LoggerConfig, ServerConfig, DatabaseConfig };
