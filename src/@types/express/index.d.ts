declare namespace Express {
    export interface Request {
        project: import('src/entities/Project').default;
    }
}
