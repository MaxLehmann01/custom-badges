type TProjectBadgeType = 'coverage' | 'version';

export type TDBProjectBadge = {
    id: string;
    created_at: Date;
    updated_at: Date;
    project_id: string;
    type: TProjectBadgeType;
    value: string;
    is_public: boolean;
};

export type TProjectBadge = {
    id: TDBProjectBadge['id'];
    createdAt: TDBProjectBadge['created_at'];
    updatedAt: TDBProjectBadge['updated_at'];
    projectId: TDBProjectBadge['project_id'];
    type: TDBProjectBadge['type'];
    value: TDBProjectBadge['value'];
    isPublic: TDBProjectBadge['is_public'];
};

export default class ProjectBadge {
    private readonly id: TProjectBadge['id'];
    private readonly createdAt: TProjectBadge['createdAt'];
    private readonly updatedAt: TProjectBadge['updatedAt'];
    private readonly projectId: TProjectBadge['projectId'];
    private readonly type: TProjectBadge['type'];
    private readonly value: TProjectBadge['value'];
    private readonly isPublic: TProjectBadge['isPublic'];

    constructor(projectBadge: TProjectBadge) {
        this.id = projectBadge.id;
        this.createdAt = projectBadge.createdAt;
        this.updatedAt = projectBadge.updatedAt;
        this.projectId = projectBadge.projectId;
        this.type = projectBadge.type;
        this.value = projectBadge.value;
        this.isPublic = projectBadge.isPublic;
    }

    public getId(): TProjectBadge['id'] {
        return this.id;
    }

    public getCreatedAt(): TProjectBadge['createdAt'] {
        return this.createdAt;
    }

    public getUpdatedAt(): TProjectBadge['updatedAt'] {
        return this.updatedAt;
    }

    public getProjectId(): TProjectBadge['projectId'] {
        return this.projectId;
    }

    public getType(): TProjectBadge['type'] {
        return this.type;
    }

    public getValue(): TProjectBadge['value'] {
        return this.value;
    }

    public getIsPublic(): TProjectBadge['isPublic'] {
        return this.isPublic;
    }
}
