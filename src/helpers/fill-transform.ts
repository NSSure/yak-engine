import Application from "../application";
import Transform from "../primitives/transform";
import isTransformEmpty from "./is-transform-empty";

export default function fillTransform(context: CanvasRenderingContext2D, transform: Transform): void {
    if (!isTransformEmpty(transform)) {
        context.fillStyle = Application.instance.configuration.selectionTransformFill;
        context.fillRect(transform.x, transform.y, transform.width, transform.height);
    }
}