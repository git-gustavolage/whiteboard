import Vector from "../types/Vector";

class History {

  constructor(
    public past: Vector[][],
    public present: VectorShape[],
    public future: VectorShape[][]
  ){}

}