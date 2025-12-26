export type TDBProject = {
    id: string;
    created_at: Date;
    updated_at: Date;
    name: string;
    key_ct: Buffer;
    key_iv: Buffer;
    key_tag: Buffer;
    key_digest: Buffer;
};

export type TProject = {
    id: TDBProject['id'];
    createdAt: TDBProject['created_at'];
    updatedAt: TDBProject['updated_at'];
    name: TDBProject['name'];
    key: string;
    keyDigest: TDBProject['key_digest'];
};

export default class Project {
    private readonly id: TProject['id'];
    private readonly createdAt: TProject['createdAt'];
    private readonly updatedAt: TProject['updatedAt'];
    private readonly name: TProject['name'];
    private readonly key: TProject['key'];
    private readonly keyDigest: TProject['keyDigest'];

    constructor(project: TProject) {
        this.id = project.id;
        this.createdAt = project.createdAt;
        this.updatedAt = project.updatedAt;
        this.name = project.name;
        this.key = project.key;
        this.keyDigest = project.keyDigest;
    }

    public getId(): TProject['id'] {
        return this.id;
    }

    public getCreatedAt(): TProject['createdAt'] {
        return this.createdAt;
    }

    public getUpdatedAt(): TProject['updatedAt'] {
        return this.updatedAt;
    }

    public getName(): TProject['name'] {
        return this.name;
    }

    public getKey(): TProject['key'] {
        return this.key;
    }

    public getKeyDigest(): TProject['keyDigest'] {
        return this.keyDigest;
    }
}
