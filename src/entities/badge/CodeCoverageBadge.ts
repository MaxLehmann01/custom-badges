import AbstractBadge from 'src/entities/badge/AbstractBadge';

export default class CodeCoverageBadge extends AbstractBadge {
    constructor(coverage: number) {
        super();

        this.label = 'Code Coverage';
        this.value = `${coverage}%`;

        if (coverage < 60) {
            this.color = '#e05d44';
        }

        if (coverage >= 60 && coverage < 65) {
            this.color = '#c66a0e';
        }

        if (coverage >= 65 && coverage < 70) {
            this.color = '#c6980f';
        }

        if (coverage >= 70 && coverage < 75) {
            this.color = '#c6c60d';
        }

        if (coverage >= 75 && coverage < 80) {
            this.color = '#98c611';
        }

        if (coverage >= 80 && coverage < 85) {
            this.color = '#6ac611';
        }

        if (coverage >= 85) {
            this.color = '#4c1';
        }
    }
}
