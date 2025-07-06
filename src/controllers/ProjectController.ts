import Logger from 'src/components/Logger';
import AbstractController from 'src/controllers/AbstractController';
import ProjectRepository from 'src/repositories/ProjectRepository';
import { Request, Response, NextFunction } from 'express';
import RouteError from 'src/components/server/RouteError';
import xmlparser from 'express-xml-bodyparser';

export default class ProjectController extends AbstractController {
    private projectRepository: ProjectRepository;

    constructor(logger: Logger, projectRepository: ProjectRepository) {
        super(logger);
        this.projectRepository = projectRepository;
    }

    protected useRoutes(): void {
        this.router.post(
            '/:project/code-coverage',
            this.authMiddleware.bind(this),
            xmlparser(),
            this.updateCodeCoverage.bind(this)
        );
    }

    private async authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projectName = req.params.project;

            if (!projectName) {
                throw new RouteError(400, 'Project name is required');
            }

            const { authorization } = req.headers;

            if (!authorization || typeof authorization !== 'string') {
                throw new RouteError(401, 'Authorization header is required');
            }

            const project = await this.projectRepository.findByName(projectName);
            if (!project) {
                throw new RouteError(404, `Project not found`);
            }

            const token = authorization.split('Bearer ')[1];
            if (project.getToken() !== token) {
                throw new RouteError(403, 'Invalid token');
            }

            req.project = project;
            next();
        } catch (err) {
            next(err);
        }
    }

    private async updateCodeCoverage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const coverage = req.body.coverage.$['line-rate'];
            if (coverage === undefined) {
                throw new RouteError(400, 'Line rate is required in the coverage report');
            }

            if (isNaN(parseFloat(coverage))) {
                throw new RouteError(400, 'Line rate must be a valid number');
            }

            const lineRate = parseFloat(coverage) * 100;
            if (lineRate < 0 || lineRate > 100) {
                throw new RouteError(400, 'Line rate must be between 0 and 100');
            }

            const isUpdated = await this.projectRepository.update({
                id: req.project.getId(),
                created_at: req.project.getCreatedAt(),
                updated_at: new Date(),
                name: req.project.getName(),
                version: req.project.getVersion(),
                code_coverage: lineRate,
                token: req.project.getToken(),
            });

            if (!isUpdated) {
                throw new RouteError(500, 'Failed to update project code coverage');
            }

            res.status(200).json({
                message: 'Code coverage updated successfully',
                data: null,
            });
        } catch (err) {
            next(err);
        }
    }
}
