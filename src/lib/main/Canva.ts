import Color from "../core/Color";
import Vector from "../types/Vector";

class Canva {

  public static history: Vector[];

  constructor(
    // public svg?: SVGSVGElement,
  ) { }

  draw(x: number, y: number, svg: SVGSVGElement, color: Color): Vector {
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

  update(x: number, y: number, svg: SVGSVGElement, vector: Vector): Vector {
    const pt = svg!.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const local = pt.matrixTransform(svg!.getScreenCTM()!.inverse());
    vector.props.d += ` L${local.x},${local.y}`;
    return vector;
  }



}

export default Canva;