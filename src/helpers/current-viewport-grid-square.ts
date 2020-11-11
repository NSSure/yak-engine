import { Logger } from "../logging/logger";
import Point from "../primitives/Point";

export default function currentViewportGridSquare(mousePosition: Point): Point {
    let gridPosition = new Point(0, 0);
    Logger.data(mousePosition);
    gridPosition.x = Math.ceil(mousePosition.x / 16) / 16;
    gridPosition.y = Math.ceil(mousePosition.y / 16) / 16;
    Logger.data(gridPosition);
    return gridPosition;
}