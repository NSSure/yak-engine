import Application from "../application";
import Transform from "../primitives/transform";

export default function fillTransparentRect(context: CanvasRenderingContext2D, transform: Transform, color?: string) {
    if (color) {
        context.fillStyle = color;
    }
    else {
        context.fillStyle = Application.instance.configuration.highlightFill;
    }
    
    context.globalAlpha = 0.50;

    context.fillRect(
        transform.x, 
        transform.y, 
        Application.instance.configuration.gridSquareSize, 
        Application.instance.configuration.gridSquareSize
    );

    context.globalAlpha = 1;
}