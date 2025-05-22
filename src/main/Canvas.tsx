import { useRef, useState } from "react";
import Vector from "../lib/types/Vector";
import draw from "../lib/main/Draw";
import Color from "../lib/core/Color";

interface CanvasProps {
  shapes: Vector[];
  setShapes: (shapes: Vector[]) => void;
  currentColor: Color;
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
    <svg ref={svgRef} className="flex-1 h-full" style={{ filter: "artBrush" }} onMouseDown={start} onMouseMove={move} onMouseUp={end}>
      {shapes.map(s => (
        <path
          key={s.id}
          d={s.props.d}
          stroke={s.fill}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          strokeOpacity={1}
          strokeLinejoin="round"
        />)
      )}
    </svg>
  );
}

export default Canvas;