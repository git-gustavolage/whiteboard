import { useCallback, useEffect, useRef } from "react";

function Canvas({ width, height, brush }) {
    const canvasRef = useRef();
    const drawing = useRef(false);
    const lastPoint = useRef({ x: 0, y: 0 });

    const drawLine = useCallback((x1, y1, x2, y2) => {
        const ctx = canvasRef.current.getContext('2d');
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.hypot(dx, dy);
        const steps = Math.ceil(dist / brush.spacing);

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = x1 + dx * t + (Math.random() - 0.5) * brush.scatter;
            const y = y1 + dy * t + (Math.random() - 0.5) * brush.scatter;
            const angle = (Math.random() - 0.5) * brush.rotationRange;
            const scale = brush.scaleRange[0] + Math.random() * (brush.scaleRange[1] - brush.scaleRange[0]);

            ctx.save();
            ctx.globalAlpha = brush.opacity;
            ctx.globalCompositeOperation = brush.blendMode;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale, scale);
            brush.applyEffects(ctx);
            ctx.drawImage(brush.texture, -brush.size / 2, -brush.size / 2, brush.size, brush.size);
            ctx.restore();
        }
    }, [brush]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.clearRect(0, 0, width, height);
    }, [width, height]);

    useEffect(() => {
        const canvas = canvasRef.current;
        function onPointerDown(e) {
            drawing.current = true;
            lastPoint.current = { x: e.offsetX, y: e.offsetY };
        }
        function onPointerMove(e) {
            if (!drawing.current) return;
            const x = e.offsetX;
            const y = e.offsetY;
            drawLine(lastPoint.current.x, lastPoint.current.y, x, y);
            lastPoint.current = { x, y };
        }
        function endDraw() {
            drawing.current = false;
        }
        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', endDraw);
        return () => {
            canvas.removeEventListener('pointerdown', onPointerDown);
            canvas.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', endDraw);
        };
    }, [drawLine]);

    return <canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid #ccc', cursor: 'crosshair' }} />;
}

export default Canvas;
