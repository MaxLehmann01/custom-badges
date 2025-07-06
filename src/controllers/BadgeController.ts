import Logger from 'src/components/Logger';
import AbstractController from 'src/controllers/AbstractController';
import { NextFunction, Request, Response } from 'express';
import RouteError from 'src/components/server/RouteError';
import axios from 'axios';
import ProjectRepository from 'src/repositories/ProjectRepository';
import BadgeRepository from 'src/repositories/BadgeRepository';
import HealthcheckBadge from 'src/entities/badge/HealthcheckBadge';
import Project from 'src/entities/Project';
import CodeCoverageBadge from 'src/entities/badge/CodeCoverageBadge';

export default class BadgeController extends AbstractController {
    private projectRepository: ProjectRepository;
    private badgeRepository: BadgeRepository;

    constructor(logger: Logger, projectRepository: ProjectRepository, badgeRepository: BadgeRepository) {
        super(logger);
        this.projectRepository = projectRepository;
        this.badgeRepository = badgeRepository;
    }

    protected useRoutes(): void {
        this.router.get('/healthcheck', this.healthcheck.bind(this));
        this.router.get('/:project/code-coverage', this.projectMiddleware.bind(this), this.codeCoverage.bind(this));
    }

    private async projectMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projectName = req.params.project;

            if (!projectName) {
                throw new RouteError(400, 'Project name is required');
            }

            const project = await this.projectRepository.findByName(projectName);
            if (!project) {
                throw new RouteError(404, `Project not found`);
            }

            req.project = project;
            next();
        } catch (err) {
            next(err);
        }
    }

    private async healthcheck(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            try {
                const { url } = req.query;

                if (!url) {
                    throw new RouteError(400, 'Missing required query parameter: url');
                }

                const response = await axios({ method: 'GET', url: String(url) });
                if (response.status !== 200) {
                    throw new RouteError(500, `Healthcheck failed with status code: ${response.status}`);
                }

                const healthcheckBadge = new HealthcheckBadge('success');
                res.status(200).send(healthcheckBadge.getSvg());
            } catch (_) {
                const healthcheckBadge = new HealthcheckBadge('error');
                res.status(200).send(healthcheckBadge.getSvg());
            }
        } catch (err) {
            next(err);
        }
    }

    private async codeCoverage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const project = req.project as Project;
            const coverage = project.getCodeCoverage();

            const badge = new CodeCoverageBadge(coverage);
            const svg = badge.getSvg();

            res.status(200).send(svg);
        } catch (err) {
            next(err);
        }
    }
}
