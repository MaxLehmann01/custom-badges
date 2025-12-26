import Database from 'src/services/database/Database';

export default abstract class AbstractRepository {
    protected readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }
}
