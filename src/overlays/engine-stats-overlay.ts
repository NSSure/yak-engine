import Application from "../application";
import { Logger } from "../logging/logger";
import Time from "../time";
import HtmlOverlay from "./html-overlay";
import { OverlayPosition } from "./overlay-position";

export default class EngineStatsOverlay extends HtmlOverlay {
    title: string = 'Engine Statistics';
    order: number = 0;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.BOTTOM_LEFT;
    isMoveable: boolean = true;

    dataAttributes: Array<any> = [
        { key: 'data-fps', value: Time.deltaTime }
    ];

    template: string = 
    `
        <span class="canvas-dimensions">Canvas dimensions: <span data-canvas-dimensions>{width} x {height}</span></span><br>
        <span class="mouse-position">Mouse position: <span data-mouse-position>{mouseX} x {mouseY}</span></span><br>
        <span class="fps">FPS: <span data-fps>{fps}</span></span><br>
    `;

    // This will be fired after the init function is fired.
    bootstrap() {
        let div = document.createElement('div');
        div.innerHTML = this.template;
        this.content?.appendChild(div);
    }

    sync() {
        let canvasDimensions = <HTMLSpanElement>document.querySelector('span[data-canvas-dimensions]');
        canvasDimensions.innerText = `${Application.instance.graphics.canvas.getCanvasWidth()} x ${Application.instance.graphics.canvas.getCanvasHeight()}`;

        let mousePosition = <HTMLSpanElement>document.querySelector('span[data-mouse-position]');
        mousePosition.innerText = `${Application.instance.graphics.canvas.mousePosition?.x} x ${Application.instance.graphics.canvas.mousePosition?.y}`;

        let fps = <HTMLSpanElement>document.querySelector('span[data-fps]');

        if (isNaN(parseInt(fps.innerText))) {
            fps.innerText = Time.fps.toFixed(2);
        }
        else {
            // console.log(Math.abs(parseFloat(fps.innerText) - Time.fps));

            if (Math.abs(parseFloat(fps.innerText) - Time.fps) > 1) {
                fps.innerText = Time.fps.toFixed(2);
            }
        }
    }
}