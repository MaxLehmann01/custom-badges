export default abstract class AbstractBadge {
    private readonly charBaseWidth: number = 12;
    private readonly charDecreaseFactor: number = 0.6;
    private readonly textMinWidth: number = 7;

    protected color: string;
    protected label: string;
    protected value: string;

    constructor() {}

    public getSvg(): string {
        const labelLength = this.label.length;
        const valueLength = this.value.length;

        const additionalWidthPerLabelChar = this.calcWidthPerChar(labelLength);
        const additionalWidthPerValueChar = this.calcWidthPerChar(valueLength);

        const labelWidth = Math.round(labelLength * additionalWidthPerLabelChar);
        const valueWidth = Math.round(valueLength * additionalWidthPerValueChar);

        const totalWidth = labelWidth + valueWidth;
        const labelXPosition = Math.round(labelWidth / 2);
        const valueXPosition = labelWidth + Math.round(valueWidth / 2);

        const svgTemplate = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
          <defs>
            <linearGradient id="b" x2="0" y2="100%">
              <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
              <stop offset="1" stop-opacity=".1"/>
            </linearGradient>
          </defs>
          <mask id="a">
            <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
          </mask>
          <g mask="url(#a)">
              <path fill="#555" d="M0 0 h${labelWidth} v20 H0 z" />
              <path fill="${this.color}" d="M${labelWidth} 0 h${valueWidth} v20 H${labelWidth} z" />
              <text x="${labelXPosition}" y="50%" dy=".35em" fill="#010101" fill-opacity=".3" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" transform="translate(0, 1)">
                ${this.label}
              </text>
              <text x="${labelXPosition}" y="50%" dy=".35em" fill="#fff" font-family="Arial, sans-serif" font-size="11" text-anchor="middle">
                ${this.label}
              </text>
  
              <text x="${valueXPosition}" y="50%" dy=".35em" fill="#010101" fill-opacity=".3" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" transform="translate(0, 1)">
                ${this.value}
              </text>
              <text x="${valueXPosition}" y="50%" dy=".35em" fill="#fff" font-family="Arial, sans-serif" font-size="11" text-anchor="middle">
                ${this.value}
              </text>
            <path fill="url(#b)" d="M0 0 h${totalWidth} v20 H0 z"/>
          </g>
        </svg>
      `;

        const svg = svgTemplate.replace(/\s{2,}/g, ' ').replace(/(\r\n|\n|\r)/gm, '');
        return svg;
    }

    private calcWidthPerChar(length: number): number {
        return Math.max(this.charBaseWidth - this.charDecreaseFactor * Math.min(this.textMinWidth, length), 5);
    }
}
