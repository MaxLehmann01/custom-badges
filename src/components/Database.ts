import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import Logger from 'src/components/Logger';
import { DatabaseConfig } from 'src/config/Types';

export default class Database {
    private static instance: Database;
    private static config: DatabaseConfig;

    private pool: Pool;
    private schema: string;
    private logger: Logger;

    private constructor(logger: Logger) {
        this.logger = logger;
    }

    public static setConfig(config: DatabaseConfig): void {
        Database.config = config;
    }

    public static getInstance(logger: Logger): Database {
        if (!Database.instance) {
            Database.instance = new Database(logger);
        }
        return Database.instance;
    }

    public async start(): Promise<void> {
        if (!Database.config) {
            throw new Error('Postgres configuration not set. Call Postgres.setConfig() first.');
        }

        const { host, port, database, schema, user, password, ssl } = Database.config;

        this.schema = schema;

        this.pool = new Pool({
            host,
            port,
            database,
            user,
            password,
            ssl,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.pool.on('connect', () => {
            this.logger.info(`Connected to Postgres at ${user}@${host}:${port}/${database}`);
        });

        this.pool.on('error', (err) => {
            this.logger.error(`Postgres Pool Error: ${err}`);
        });

        try {
            const connection = await this.getConnection();
            await connection.query('SELECT NOW()');
            connection.release();
        } catch (e) {
            this.logger.error(`Failed to connect to Postgres: ${e}`);
            throw e;
        }
    }

    public async getConnection(): Promise<PoolClient> {
        if (!this.pool) {
            throw new Error('Postgres Pool not initialized');
        }

        try {
            const connection = await this.pool.connect();
            await connection.query(`SET search_path TO ${this.schema}, "$user"`);
            return connection;
        } catch (e) {
            this.logger.error(`Error acquiring Postgres connection: ${e}`);
            throw e;
        }
    }

    public async stop(): Promise<void> {
        if (this.pool) {
            try {
                await this.pool.end();
                this.logger.info('Postgres pool closed');
            } catch (e) {
                this.logger.error(`Error closing Postgres pool: ${e}`);
            }
        }
    }

    public async query<T extends QueryResultRow>(
        query: string,
        params: Array<string | number | boolean | Date | null> = []
    ): Promise<QueryResult<T>> {
        const connection = await this.getConnection();

        try {
            const result = await connection.query<T>(query, params);
            return result;
        } catch (err) {
            this.logger.error(`Error executing query: ${err}`);
            throw err;
        } finally {
            connection.release();
        }
    }

    public async select<T extends QueryResultRow>(
        table: string,
        columns: string[],
        where?: string,
        params: Array<string | number | boolean | Date | null> = []
    ): Promise<T[]> {
        const query = `SELECT ${columns.map((column) => `"${column}"`).join(', ')} FROM "${table}" ${
            where ? `WHERE ${where}` : ''
        }`;

        const result = await this.query<T>(query, params);
        return result.rows;
    }

    public async selectOne<T extends QueryResultRow>(
        table: string,
        columns: string[] | '*',
        where: string,
        params: Array<string | number | boolean | Date | null> = []
    ): Promise<T | null> {
        const query = `SELECT ${
            Array.isArray(columns) ? columns.map((column) => `"${column}"`).join(', ') : '*'
        } FROM "${table}" ${where ? `WHERE ${where}` : ''} LIMIT 1`;

        const result = await this.query<T>(query, params);

        return result.rows[0] || null;
    }

    public async insert(
        table: string,
        data: Record<string, string | number | boolean | Date | null>,
        returning: string | null = null
    ): Promise<unknown | null> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(',');
        const returningClause = returning ? ` RETURNING ${returning}` : '';

        const query = `INSERT INTO "${table}" (${keys
            .map((key) => `"${key}"`)
            .join(', ')}) VALUES (${placeholders})${returningClause}`;

        const result = await this.query(query, values);

        if (returning) {
            return result.rows[0][returning];
        }

        return null;
    }

    public async update(
        table: string,
        data: Record<string, string | number | boolean | Date | null>,
        where: string,
        params: Array<string | number | boolean | Date | null> = []
    ): Promise<number | null> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map((key, idx) => `"${key}" = $${idx + 1}`).join(', ');

        const whereOffset = values.length;
        const whereClause = where.replace(/\$(\d+)/g, (_, idx) => `$${parseInt(idx) + whereOffset}`);

        const query = `UPDATE "${table}" SET ${setClause} WHERE ${whereClause}`;

        const result = await this.query(query, [...values, ...params]);
        return result.rowCount;
    }

    public async delete(
        table: string,
        where: string,
        params: Array<string | number | boolean | Date | null> = []
    ): Promise<number | null> {
        const query = `DELETE FROM ${table} WHERE ${where}`;

        const result = await this.query(query, params);
        return result.rowCount;
    }
}
