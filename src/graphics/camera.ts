import Point from "../primitives/Point";
import Transform from "../primitives/transform";

export default class Camera {
    origin: Point = new Point(0, 0);
    viewport: Transform;
}