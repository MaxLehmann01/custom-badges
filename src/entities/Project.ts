export default class Project {
    private id: number;
    private createdAt: Date;
    private updatedAt: Date;
    private name: string;
    private version: string;
    private codeCoverage: number;
    private token: string;

    constructor(
        id: number,
        createdAt: Date,
        updatedAt: Date,
        name: string,
        version: string,
        codeCoverage: number,
        token: string
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.name = name;
        this.version = version;
        this.codeCoverage = codeCoverage;
        this.token = token;
    }

    public getId(): number {
        return this.id;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public getName(): string {
        return this.name;
    }

    public getVersion(): string {
        return this.version;
    }

    public getCodeCoverage(): number {
        return this.codeCoverage;
    }

    public getToken(): string {
        return this.token;
    }
}
