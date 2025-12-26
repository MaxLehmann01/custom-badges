import Project, { TDBProject, TProject } from 'src/entities/Project';
import ProjectBadge, { TDBProjectBadge, TProjectBadge } from 'src/entities/ProjectBadge';
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

    public async create(
        project: Omit<TProject, 'id' | 'createdAt' | 'updatedAt' | 'key' | 'keyDigest'>
    ): Promise<Project | null> {
        const key = crypto.randomBytes(32).toString('hex');
        const encryptedKey = Security.encryptAesGCM(key);
        const keyDigest = Security.createDigest(key);

        const insertedId = await this.database.insert<TProject['id']>(
            'projects',
            {
                created_at: new Date(),
                updated_at: new Date(),
                name: project.name,
                key_ct: encryptedKey.ct,
                key_iv: encryptedKey.iv,
                key_tag: encryptedKey.tag,
                key_digest: keyDigest,
            },
            'id'
        );

        if (!insertedId) {
            return null;
        }

        return this.findById(insertedId);
    }

    public async delete(projectId: TProject['id']): Promise<boolean> {
        const deleteResult = await this.database.delete('projects', 'id = $1', [projectId]);

        if (deleteResult === null) {
            return false;
        }

        return deleteResult > 0;
    }

    public async findProjectBadgeByTypeAndProjectId(
        projectId: TProjectBadge['projectId'],
        type: TProjectBadge['type']
    ): Promise<ProjectBadge | null> {
        const projectBadge = await this.database.selectOne<TDBProjectBadge>(
            'project_badges',
            '*',
            'project_id = $1 AND type = $2',
            undefined,
            [projectId, type]
        );

        if (!projectBadge) {
            return null;
        }

        return new ProjectBadge({
            id: projectBadge.id,
            createdAt: projectBadge.created_at,
            updatedAt: projectBadge.updated_at,
            projectId: projectBadge.project_id,
            type: projectBadge.type,
            value: projectBadge.value,
            isPublic: projectBadge.is_public,
        });
    }
}
