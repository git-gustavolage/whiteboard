import { useRef, useState } from "react";
import Vector from "../lib/types/Vector";
import draw from "../lib/main/Draw";


interface CanvasProps {
  shapes: Vector[];
  setShapes: React.Dispatch<React.SetStateAction<Vector[]>>;
  currentColor: string;
  filter: string;
}

function Canvas({ shapes, setShapes, currentColor, filter }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState(false);

  const start = (e: React.MouseEvent) => {
    const shape = draw(e.clientX, e.clientY, svgRef.current!, currentColor);
    setShapes([...shapes, shape]);
    setDrawing(true);
  };

  // const draw = (x: number, y: number, svg: SVGSVGElement): Vector => {
  //   const pt = svg!.createSVGPoint();
  //   pt.x = x;
  //   pt.y = y;
  //   const local = pt.matrixTransform(svg!.getScreenCTM()!.inverse());
  //   return { id: String(Date.now()), type: 'path', props: { d: `M${local.x},${local.y}` }, fill: currentColor } as Vector;
  // }

  const move = (e: React.MouseEvent) => {
    if (!drawing) return;
    const pt = svgRef.current!.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const local = pt.matrixTransform(svgRef.current!.getScreenCTM()!.inverse());
    const last = shapes[shapes.length - 1];
    last.props.d += ` L${local.x},${local.y}`;
    setShapes([...shapes.slice(0, -1), last]);
  };

  const end = () => setDrawing(false);

  return (
    <svg ref={svgRef} className="flex-1 h-full" style={{ filter }} onMouseDown={start} onMouseMove={move} onMouseUp={end}>
      {shapes.map(s => <path key={s.id} d={s.props.d} stroke={s.fill} fill="none" strokeWidth={2} />)}
    </svg>
  );
}

export default Canvas;