import { NextFunction, Request, RequestHandler, Response } from 'express';
import { TProject } from 'src/entities/Project';
import ProjectRepository from 'src/repositories/ProjectRepository';
import AbstractHttpController from 'src/services/http-server/AbstractController';
import RouteError from 'src/services/http-server/RouteError';
import Logger from 'src/services/logger/Logger';
import Config from 'src/services/config/Config';
import CustomBadge from 'src/entities/CustomBadge';
import { validate as uuidValidate } from 'uuid';

export default class IndexHttpController extends AbstractHttpController {
    protected readonly prefix = '/';

    private readonly projectRepository: ProjectRepository;

    constructor(logger: Logger, projectRepository: ProjectRepository) {
        super(logger);

        this.projectRepository = projectRepository;

        this.useRoutes();
    }

    protected useRoutes(): void {
        this.router.get('/', this.basicAuthMiddleware(), this.homeRoute.bind(this));
        this.router.get('/:projectId', this.basicAuthMiddleware(), this.projectRoute.bind(this));
        this.router.post('/', this.basicAuthMiddleware(), this.createProjectRoute.bind(this));
        this.router.delete('/:projectId', this.basicAuthMiddleware(), this.deleteProjectRoute.bind(this));
    }

    private async homeRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projects = await this.getProjectsForNavigation();

            res.status(200).render('Index', {
                view: 'pages/Home',
                projects,
            });
        } catch (e) {
            next(e);
        }
    }

    private async projectRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projectId = req.params.projectId;

            if (!uuidValidate(projectId)) {
                throw new RouteError(400, 'Invalid project ID.');
            }

            const project = await this.projectRepository.findById(projectId);
            if (!project) {
                throw new RouteError(404, 'Project not found.');
            }

            const projects = await this.getProjectsForNavigation();

            res.status(200).render('Index', {
                view: 'pages/Project',
                projects,
                project: {
                    id: project.getId(),
                    createdAt: project.getCreatedAt(),
                    updatedAt: project.getUpdatedAt(),
                    name: project.getName(),
                    key: project.getKey(),
                },
            });
        } catch (e) {
            next(e);
        }
    }

    private async createProjectRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name } = req.body;

            if (!name || typeof name !== 'string') {
                throw new RouteError(400, 'The field "name" is required and must be a string.');
                return;
            }

            const insertedProject = await this.projectRepository.create({
                name,
            });

            if (!insertedProject) {
                throw new RouteError(500, 'Failed to create project.');
                return;
            }

            res.status(201).json({
                message: 'Successfully created project.',
                data: {
                    id: insertedProject.getId(),
                    name: insertedProject.getName(),
                },
            });
        } catch (e) {
            next(e);
        }
    }

    private async deleteProjectRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projectId = req.params.projectId;

            if (!uuidValidate(projectId)) {
                throw new RouteError(400, 'Invalid project ID.');
            }

            const project = await this.projectRepository.findById(projectId);
            if (!project) {
                throw new RouteError(404, 'Project not found.');
            }

            if (!(await this.projectRepository.delete(projectId))) {
                throw new RouteError(500, 'Failed to delete project.');
            }

            res.status(200).json({
                message: 'Successfully deleted project.',
            });
        } catch (e) {
            next(e);
        }
    }
    private basicAuthMiddleware(): RequestHandler {
        const realm = 'projects';
        const basicAuthConfig = Config.getBasicAuthConfig();

        return (req: Request, res: Response, next: NextFunction) => {
            const auth = req.header('authorization') || '';
            const [scheme, encoded] = auth.split(' ');

            if (scheme !== 'Basic' || !encoded) {
                res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`);
                return res.status(401).send('Authentication required.');
            }

            const decoded = Buffer.from(encoded, 'base64').toString('utf8');
            const sepIndex = decoded.indexOf(':');
            const user = sepIndex >= 0 ? decoded.slice(0, sepIndex) : '';
            const pass = sepIndex >= 0 ? decoded.slice(sepIndex + 1) : '';

            if (user !== basicAuthConfig.username || pass !== basicAuthConfig.password) {
                res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`);
                return res.status(401).send('Invalid credentials.');
            }

            next();
        };
    }

    private async getProjectsForNavigation(): Promise<
        Omit<TProject, 'createdAt' | 'updatedAt' | 'key' | 'keyDigest'>[]
    > {
        const projects = await this.projectRepository.findAll();

        return projects.map((project) => ({
            id: project.getId(),
            name: project.getName(),
        }));
    }
}
