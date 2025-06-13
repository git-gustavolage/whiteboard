import { useEffect, useRef, useState } from "react";

interface TextureCreatorProps {
    onSave: (canvas: HTMLCanvasElement) => void;
    onCancel: () => void;
}

function TextureCreator({ onSave, onCancel }: TextureCreatorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState(false);
    const [last, setLast] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const ctx = canvasRef.current!.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = 'rgba(255,255,255,0)';
        ctx.fillRect(0, 0, 128, 128);
    }, []);

    const saveTexture = () => {
        const canvas = canvasRef.current!;
        onSave(canvas);
    };

    const handleDown = (e: React.PointerEvent) => {
        setDrawing(true);
        setLast({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const handleMove = (e: React.PointerEvent) => {
        if (!drawing) return;
        const ctx = canvasRef.current!.getContext('2d');
        if (!ctx) return;

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        setLast({ x, y });
    };

    const handleUp = () => setDrawing(false);

    //modal
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center" >

            <div className="bg-white p-4">
                <h3>Desenhe sua textura</h3>
                <canvas
                    ref={canvasRef}
                    width={128}
                    height={128}
                    style={{ border: '1px solid #333', cursor: 'crosshair' }}
                    onPointerDown={handleDown}
                    onPointerMove={handleMove}
                    onPointerUp={handleUp}
                    onPointerLeave={handleUp}
                />
                <div style={{ marginTop: '10px' }}>
                    <button onClick={saveTexture}>Salvar Textura</button>
                    <button onClick={onCancel} style={{ marginLeft: '10px' }}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

export default TextureCreator;
