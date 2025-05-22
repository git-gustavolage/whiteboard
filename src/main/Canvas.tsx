import { useRef, useState } from "react";
import Vector from "../lib/types/Vector";
import Color from "../lib/core/Color";
import Canva from "../lib/main/Canva";

interface CanvasProps {
  shapes: Vector[];
  setShapes: (shapes: Vector[]) => void;
  currentColor: Color;
  filter?: string;
}

function Canvas({ shapes, setShapes, currentColor }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState(false);
  const cnv = new Canva();

  const start = (e: React.MouseEvent) => {
    const shape = cnv.draw(e.clientX, e.clientY, svgRef.current!, currentColor);
    setShapes([...shapes, shape]);
    setDrawing(true);
  };
  
  const move = (e: React.MouseEvent) => {
    if (!drawing) return;
    const vector = cnv.update(e.clientX, e.clientY, svgRef.current!, shapes[shapes.length - 1]);
    setShapes([...shapes.slice(0, -1), vector]);
  };

  console.log(shapes);
  

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