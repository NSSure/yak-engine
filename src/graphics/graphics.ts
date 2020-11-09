import Canvas from "./canvas";
import DOM from "./dom";

/**
 * Functionality for managing graphics. Contains functionality
 * related to both the canvas and document.
 * 
 * @author NSSure
 * @since 11/8/2020
 */
export default class Graphics {
    canvas: Canvas = new Canvas();
    dom: DOM = new DOM();
}