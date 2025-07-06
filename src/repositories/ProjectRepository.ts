import Database from 'src/components/Database';
import Project from 'src/entities/Project';
import { TProject } from 'src/models/Project';

export default class ProjectRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    public async findByNameAndToken(name: TProject['name'], token: TProject['token']): Promise<Project | null> {
        const result = await this.db.selectOne<TProject>('projects', '*', 'name = $1 && token = $2', [name, token]);

        if (!result) {
            return null;
        }

        return new Project(
            result.id,
            result.created_at,
            result.updated_at,
            result.name,
            result.version,
            result.code_coverage,
            result.token
        );
    }
}
