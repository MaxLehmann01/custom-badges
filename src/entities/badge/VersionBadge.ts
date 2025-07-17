import AbstractBadge from 'src/entities/badge/AbstractBadge';

export default class VersionBadge extends AbstractBadge {
    constructor(version: string) {
        super();

        this.label = 'Version';
        this.value = version;
        this.color = '#007ec6';
    }
}
