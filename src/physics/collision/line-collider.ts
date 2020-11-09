import Point from "../../primitives/Point";
import Collider from "./collider";

export default class LineCollider extends Collider {
    startPoint: Point;
    endPoint: Point;

    constructor(startPoint: Point, endPoint: Point) {
        super();

        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    public onCollisionEnter(): void {

    }

    public onCollisionLeave(): void {
        
    }
}