import { Logger } from "../logging/logger";
import Point from "../primitives/Point";
import Transform from "../primitives/transform";

/**
 * Determines if the given x/y coordinate is contained with the given dimensions. Think
 * if a mouse is hovering over a button.
 * 
 * @author NSSure
 * @since 11/9/2020
 * 
 * @param point The point that needs to be checked against the given container dimensions.
 * @param containerOrigin The x and y coordinates of container.
 * @param containerWidth The width of the container.
 * @param containerHeight The height of the container.
 */
export default function isCoordinateContained(point: Point, containerTransform: Transform) {
    if (point.x >= containerTransform.x && (point.x <= (containerTransform.x + containerTransform.width))) {
        if (point.y >= containerTransform.y && (point.y <= (containerTransform.y + containerTransform.height))) {
            return true;
        }
    }

    return false;
}