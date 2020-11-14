import Application from "../application";
import Point from "../primitives/Point";

export default function currentViewportGridCoordinates(mousePosition: Point): Point {
    let gridCoordinates = new Point(0, 0);
    
    gridCoordinates.x = Math.floor(mousePosition.x / Application.instance.configuration.gridSquareSize);
    gridCoordinates.y = Math.floor(mousePosition.y / Application.instance.configuration.gridSquareSize);

    return gridCoordinates;
}