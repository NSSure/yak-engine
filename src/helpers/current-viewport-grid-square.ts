import Point from "../primitives/Point";

export default function currentViewportGridSquare(mousePosition: Point): Point {
    let gridPosition = new Point(0, 0);
    gridPosition.x = Math.floor(mousePosition.x / 16);
    gridPosition.y = Math.floor(mousePosition.y / 16);
    return gridPosition;
}