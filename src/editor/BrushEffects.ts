const BrushEffects = {
    offRegisterCMYK: (offsets: number[][]) => (ctx: CanvasRenderingContext2D) => {
        ctx.globalCompositeOperation = 'lighter';
        ['r', 'g', 'b'].forEach((ch, i) => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.save();
            const ox = (offsets[i][0] || 0);
            const oy = (offsets[i][1] || 0);
            ctx.translate(ox, oy);
            ctx.restore();
        });
    },
    halftone: (size: number) => (ctx: CanvasRenderingContext2D) => { },
    hatching: (angle: number, gap: number) => (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.rotate(angle);
        ctx.setLineDash([gap, gap]);
        ctx.stroke();
        ctx.restore();
    },
    benDay: (radius: number, interval: number) => (ctx: CanvasRenderingContext2D) => { },
    kirbyKrackle: (count: number, radius: number) => (ctx: CanvasRenderingContext2D) => {
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * radius * 2;
            const y = (Math.random() - 0.5) * radius * 2;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * radius / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

export default BrushEffects;
