import AbstractBadge from 'src/entities/AbstractBadge';

export default class CustomBadge extends AbstractBadge {
    public constructor(label: string, color: string, value: string) {
        super();
        this.label = label;
        this.color = color;
        this.value = value;
    }
}
