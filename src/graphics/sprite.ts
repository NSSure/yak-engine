import Entity from "../entity";
import Point from "../primitives/Point";
import Transform from "../primitives/transform";

export default class Sprite extends Entity {
    transform: Transform = Transform.empty;
    enabled: boolean;
    tileset?: number; // If tileset transform is the coordinats in the tileset.
    tilesetTransform: Transform = Transform.empty;
}