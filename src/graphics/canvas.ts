import { uiConstants } from "../constants";
import currentViewportGridSquare from "../helpers/current-viewport-grid-square";
import isCoordinateContained from "../helpers/is-coordinate-contained";
import { Logger } from "../logging/logger";
import Point from "../primitives/Point";
import Button from "../ui/button";
import UIFragment from "../ui/ui-base";
import UIFragmentsRenderer from "../ui/ui-fragments-renderer";
import Fragments from "./fragments";
import SpriteRenderer from "./sprite-renderer";

export default class Canvas {
    /**
     * The canvas located within the default index.html document.
     */
    public engineCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#engine-canvas');

    /**
     * The 2D rendering context for the default canvas.
     */
    public context: CanvasRenderingContext2D = <CanvasRenderingContext2D>this.engineCanvas.getContext('2d');

    /**
     * The renderer that handle drawing the UI fragments to the given canvas context.
     */
    public uiFragmentsRender: UIFragmentsRenderer = new UIFragmentsRenderer(this);

    public spriteRenderer: SpriteRenderer = new SpriteRenderer(this);

    /**
     * The current position of the mouse in relation to the canvas. NOT the document.
     */
    public mousePosition: Point = new Point(0, 0);

    public fragments: Fragments = new Fragments();

    /**
     * Default constructor. Queries the canvas together with the canvas context
     * and bootstraps the canvas events.
     */
    constructor() {
        // Ensure we resize the canvas here.
        this.resizeCanvas();

        this.engineCanvas.addEventListener('keydown', (event: KeyboardEvent) => {
            console.log(event);
        });

        this.engineCanvas.addEventListener('click', (event) => this.onCanvasClick(event));
        this.engineCanvas.addEventListener('mousemove', (event) => this.onCanvasHover(event));
        this.engineCanvas.addEventListener('mouseenter', (event) => this.onCanvasEnter(event));
        this.engineCanvas.addEventListener('mouseleave', (event) => this.onCanvasLeave(event));

        document.addEventListener('mouseup', (event) => 
        {
            console.log(event.target);
            Logger.debug('canvas mouse up');
        });
    }

    /**
     * The main draw method called from within the gameLoop function located in the Game.ts class.
     * This handles resizing the canvas and rendering primitives, sprites, and shapes to the canvas.
     * 
     * @author NSSure
     * @since 11/8/2020
     */
    draw() {
        this.clearCanvas();

        // Demo code to backfill the canvas with a solid color.
        this.context.fillStyle = '#484848';
        this.context.fillRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());

        this.uiFragmentsRender.run();
        // this.spriteRenderer.run();

        this.resizeCanvas();
    }

    /**
     * Clears the canvas for the next draw call.
     * 
     * @author NSSure
     * @since 11/8/2020
     */
    clearCanvas(): void {
        this.context.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
    }

    /**
     * Resizes the canvas canvas to fit the dimensions of the viewport.
     * 
     * @author NSSure
     * @since 11/8/2020
     */
    resizeCanvas(): void {
        if (this.getCanvasWidth() !== window.innerWidth || this.getCanvasHeight() !== window.innerHeight) {
            this.setCanvasWidth(window.innerWidth);
            this.setCanvasHeight(window.innerHeight);
        }
    }

    drawText(): void {
        this.context.font = '30px Arial';
        this.context.fillStyle = 'red';
        this.context.textAlign = 'center';
        this.context.fillText('Hello world', 100, 100);
    }

    getCanvasHeight(): number {
        return this.engineCanvas.height;
    }

    getCanvasWidth(): number {
        return this.engineCanvas.width;
    }

    setCanvasHeight(height: number): void {
        this.engineCanvas.height = height;
    }

    setCanvasWidth(width: number): void {
        this.engineCanvas.width = width;
    }

    onCanvasClick(event: MouseEvent): void {
        this.uiFragmentsRender.isHoveredFragmentClicked(this.mousePosition);

        // TODO: Move this to a better place.

    }

    onCanvasHover(event: MouseEvent): void {
        this.mousePosition = new Point(event.clientX, event.clientY);

        let gridPosition = currentViewportGridSquare(this.mousePosition); 
        this.context.fillStyle = 'red';
        Logger.data(gridPosition.x * 16);
        Logger.data(gridPosition.y * 16);
        this.context.fillRect(gridPosition.x * 16, gridPosition.y * 16, 16, 16);

        // Determines fragment hovers.
        // this.context.fillRect(this.mousePosition.)
    }

    onCanvasEnter(event: MouseEvent): void {

    }

    onCanvasLeave(event: MouseEvent): void {

    }
}