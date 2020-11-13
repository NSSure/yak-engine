import Point from "../primitives/Point";

export default function currentViewportGridCoordinates(mousePosition: Point): Point {
    let gridCoordinates = new Point(0, 0);
    gridCoordinates.x = Math.floor(mousePosition.x / 16);
    gridCoordinates.y = Math.floor(mousePosition.y / 16);
    return gridCoordinates;
}