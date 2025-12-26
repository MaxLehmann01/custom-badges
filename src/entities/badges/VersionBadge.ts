import AbstractBadge from 'src/entities/badges/AbstractBadge';

export default class VersionBadge extends AbstractBadge {
    public constructor(value: string) {
        super();

        this.label = 'Version';
        this.color = '#007ec6';
        this.value = value.toString();
    }
}
