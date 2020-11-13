import Entity from "../entity";
import Transform from "../primitives/transform";

export default class Sprite extends Entity {
    transform: Transform = Transform.empty;
    layer: number; // Index of the layer.
    order: number;
    enabled: boolean;
    scale: number;
    imageData: any;
}