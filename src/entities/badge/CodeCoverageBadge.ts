import AbstractBadge from 'src/entities/badge/AbstractBadge';

export default class CodeCoverageBadge extends AbstractBadge {
    constructor(coverage: number) {
        super();

        this.label = 'Code Coverage';
        this.value = `${coverage}%`;

        if (coverage <= 50) {
            this.color = '#e05d44';
        }

        if (coverage > 50 && coverage <= 80) {
            this.color = '#dab639';
        }

        if (coverage > 80) {
            this.color = '#4c1';
        }
    }
}
