import { NextFunction, Request, Response } from 'express';
import AbstractHttpController from 'src/services/http-server/AbstractController';
import Logger from 'src/services/logger/Logger';
import Config from 'src/services/config/Config';

export default class IndexHttpController extends AbstractHttpController {
    protected readonly prefix = '/';

    constructor(logger: Logger) {
        super(logger);

        this.useRoutes();
    }

    protected useRoutes(): void {
        this.router.get('/', this.indexRoute.bind(this));
    }

    private async indexRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({
                message: 'Welcome to the API',
                NODE_ENV: Config.get<string>('NODE_ENV'),
                TZ: Config.get<string>('TZ'),
            });
        } catch (e) {
            next(e);
        }
    }
}
