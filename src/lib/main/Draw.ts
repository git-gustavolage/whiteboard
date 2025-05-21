import Vector from "../types/Vector";
import Color from "../core/Color";

function draw (x: number, y: number, svg: SVGSVGElement, color: Color): Vector {
  const pt = svg!.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const local = pt.matrixTransform(svg!.getScreenCTM()!.inverse());
  return {
    id: String(Date.now()),
    type: 'path',
    props: { d: `M${local.x},${local.y}` },
    fill: color.value
  } as Vector;
}

export default draw;