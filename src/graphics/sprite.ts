import Entity from "../entity";
import Transform from "../primitives/transform";

export default class Sprite extends Entity {
    transform: Transform = new Transform(0, 0, 0, 0);
    layer: number;
    order: number;
    enabled: boolean;
    scale: number;
    imageData: any;
}