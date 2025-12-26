import Project, { TDBProject, TProject } from 'src/entities/Project';
import AbstractRepository from 'src/repositories/AbstractRepository';
import Security from 'src/Security';
import crypto from 'crypto';

export default class ProjectRepository extends AbstractRepository {
    public async findAll(): Promise<Project[]> {
        const projects = await this.database.select<TDBProject>('projects', '*', undefined, 'name ASC');

        return projects.map(
            (project) =>
                new Project({
                    id: project.id,
                    createdAt: project.created_at,
                    updatedAt: project.updated_at,
                    name: project.name,
                    key: Security.decryptAesGCM({
                        ct: project.key_ct,
                        iv: project.key_iv,
                        tag: project.key_tag,
                    }),
                    keyDigest: project.key_digest,
                })
        );
    }

    public async findById(id: TProject['id']): Promise<Project | null> {
        const project = await this.database.selectOne('projects', '*', 'id = $1', undefined, [id]);

        if (!project) {
            return null;
        }

        return new Project({
            id: project.id,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
            name: project.name,
            key: Security.decryptAesGCM({
                ct: project.key_ct,
                iv: project.key_iv,
                tag: project.key_tag,
            }),
            keyDigest: project.key_digest,
        });
    }
}
