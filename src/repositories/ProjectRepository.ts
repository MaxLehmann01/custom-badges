import Database from 'src/components/Database';
import Project from 'src/entities/Project';
import { TProject } from 'src/models/Project';

export default class ProjectRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    public async findByName(name: TProject['name']): Promise<Project | null> {
        const result = await this.db.selectOne<TProject>('projects', '*', 'name = $1', [name]);

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

    public async update(project: TProject): Promise<boolean> {
        const result = await this.db.update(
            'projects',
            {
                name: project.name,
                version: project.version,
                code_coverage: project.code_coverage,
            },
            'id = $1',
            [project.id]
        );

        return result !== null && result > 0;
    }
}
