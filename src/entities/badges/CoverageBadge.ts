import AbstractBadge from 'src/entities/badges/AbstractBadge';

export default class CoverageBadge extends AbstractBadge {
    public constructor(value: number) {
        super();

        this.label = 'Coverage';
        this.color = this.getColorForValue(value);
        this.value = `${value.toFixed().toString()}%`;
    }

    private getColorForValue(value: number): string {
        if (value < 60) {
            return '#e05d44';
        } else if (value >= 60 && value < 65) {
            return '#c66a0e';
        } else if (value >= 65 && value < 70) {
            return '#c6980f';
        } else if (value >= 70 && value < 75) {
            return '#c6c60d';
        } else if (value >= 75 && value < 80) {
            return '#98c611';
        } else if (value >= 80 && value < 85) {
            return '#6ac611';
        } else {
            return '#4c1';
        }
    }
}
