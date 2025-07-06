import AbstractBadge from 'src/entities/badge/AbstractBadge';

export default class HealthcheckBadge extends AbstractBadge {
    constructor(severity: 'success' | 'error') {
        super();

        if (severity !== 'success' && severity !== 'error') {
            throw new Error('Invalid severity level. Use "success" or "error".');
        }

        if (severity === 'success') {
            this.color = '#4c1';
            this.value = 'healthy';
        }

        if (severity === 'error') {
            this.color = '#e05d44';
            this.value = 'unhealthy';
        }

        this.label = 'Healthcheck';
    }
}
