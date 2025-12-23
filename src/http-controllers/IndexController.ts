import { NextFunction, Request, Response } from 'express';
import AbstractHttpController from 'src/services/http-server/AbstractController';
import Logger from 'src/services/logger/Logger';
import Config from 'src/services/config/Config';
import CustomBadge from 'src/entities/CustomBadge';

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
            const nodeEnvBadge = new CustomBadge('NODE_ENV', '#0000ff', Config.get<string>('NODE_ENV'));
            const tzBadge = new CustomBadge('TZ', '#ff9900', Config.get<string>('TZ'));

            res.status(200).render('Index', {
                NODE_ENV: nodeEnvBadge.getSvg(),
                TZ: tzBadge.getSvg(),
            });
        } catch (e) {
            next(e);
        }
    }
}
