interface BrushOption {
    texture: any;
    spacing: number;
    size: number;
    rotationRange: number;
    scaleRange: number[];
    scatter: number;
    opacity: number;
    blendMode: string;
    effects: any[];
}

class Brush {
    texture;
    spacing = 4;
    size = 16;
    rotationRange = 0;
    scaleRange = [1, 1];
    scatter = 1;
    opacity = 1;
    blendMode = 'source-over';
    effects;

    constructor(options: BrushOption) {
        this.texture = options.texture;
        this.spacing = options.spacing;
        this.size = options.size;
        this.rotationRange = options.rotationRange;
        this.scaleRange = options.scaleRange;
        this.scatter = options.scatter;
        this.opacity = options.opacity;
        this.blendMode = options.blendMode ;
        this.effects = options.effects || [];
    }

    applyEffects(ctx: CanvasRenderingContext2D) {
        this.effects.forEach(fn => fn(ctx));
    }
}

export default Brush;
