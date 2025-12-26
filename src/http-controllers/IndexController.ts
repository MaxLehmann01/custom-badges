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
        this.router.get('/', this.homeRoute.bind(this));
        this.router.get('/:projectId', this.projectRoute.bind(this));
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
