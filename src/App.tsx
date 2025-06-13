import { useState, useEffect } from 'react';
import Brush from './editor/Brush';
import BrushEffects from './editor/BrushEffects';
import TextureCreator from './editor/textures/TextureCreator';
import Toolbar from './view/Toolbar';
import Canvas from './canvas/Canvas';

export default function App() {
    const [brushes, setBrushes] = useState<Brush[]>([]);
    const [selectedBrush, setSelectedBrush] = useState(0);
    const [mode, setMode] = useState('draw'); // 'draw' or 'create'
    const [size, setSize] = useState({ width: window.innerWidth - 140, height: window.innerHeight - 20 });

    //simula a criacao de uma textura simples, sabendo que ela é criada a partir de um canvas
    const createTexture = (points: number[][]) => {
        return new Promise<HTMLCanvasElement>((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            //utiliza os pontos para fazer uma figura
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();

            resolve(canvas);
        })
    };

    useEffect(() => {
        async function initBrushes() {
            const textures = {
                winskles: await createTexture([[0, 0], [128, 0], [128, 128], [0, 128]]),
                // _004: await loadImage('/textures/004.png'),
            };

            const brushes = [
                new Brush({
                    texture: textures.winskles,
                    spacing: 2,
                    size: 5,
                    rotationRange: Math.PI * 0.1,
                    scaleRange: [0.8, 1.2],
                    scatter: 19,
                    opacity: 0.9,
                    blendMode: 'multiply',
                    effects: [BrushEffects.halftone(2), BrushEffects.kirbyKrackle(10, 20), BrushEffects.benDay(3, 6), BrushEffects.hatching(Math.PI / 4, 10)]
                }),
                new Brush({
                    texture: textures.winskles,
                    spacing: 12,
                    size: 10,
                    rotationRange: Math.PI,
                    scaleRange: [0.5, 1],
                    scatter: 4,
                    opacity: 0.6,
                    blendMode: 'overlay',
                    effects: [BrushEffects.benDay(3, 6)]
                }),
                new Brush({
                    texture: textures.winskles,
                    spacing: 6,
                    size: 10,
                    rotationRange: Math.PI * 2,
                    scaleRange: [1, 1.5],
                    scatter: 1,
                    opacity: 1,
                    blendMode: 'source-over',
                    effects: [BrushEffects.offRegisterCMYK([[4, 4], [0, 0], [0, 0]])]
                })
            ]

            setBrushes(brushes);
        }
        initBrushes();
    }, []);

    useEffect(() => {
        function onResize() {
            setSize({ width: window.innerWidth - 140, height: window.innerHeight - 20 });
        }
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    if (brushes.length === 0) {
        return <div>Loading brushes...</div>;
    }

    const handleSaveTexture = (canvas: HTMLCanvasElement) => {
        const dataUrl = canvas.toDataURL();
        const storage = JSON.parse(localStorage.getItem('customBrushTextures') || '[]');
        storage.push(dataUrl);
        localStorage.setItem('customBrushTextures', JSON.stringify(storage));
        const img = new Image(); img.src = dataUrl;
        setBrushes(prev => [...prev, new Brush({ texture: img })]);
        setMode('draw');
    };

    if (mode === 'create') {
        return <TextureCreator onSave={handleSaveTexture} onCancel={() => setMode('draw')} />;
    }

    if (brushes.length === 0) {
        return <div>Loading brushes...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }} className='bg-black'>
            <Toolbar
                brushes={brushes}
                selectedIndex={selectedBrush}
                onSelect={i => { setSelectedBrush(i); setMode('draw'); }}
                onCreate={() => setMode('create')}
            />
            <Canvas width={size.width} height={size.height} brush={brushes[selectedBrush]} />
        </div>
    );
}