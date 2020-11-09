import { uiConstants } from "../constants";
import isCoordinateContained from "../helpers/is-coordinate-contained";
import { Logger } from "../logging/logger";
import Point from "../primitives/Point";
import Button from "../ui/button";
import UIBase from "../ui/ui-base";
import Fragments from "./fragments";

export default class Canvas {
    /**
     * The canvas located within the default index.html document.
     */
    public engineCanvas: HTMLCanvasElement;

    /**
     * The 2D rendering context for the default canvas.
     */
    public context: CanvasRenderingContext2D;

    /**
     * The current position of the mouse in relation to the canvas. NOT the document.
     */
    public mousePosition: any = new Point(0, 0);

    public fragments: Fragments = new Fragments();

    /**
     * Default constructor. Queries the canvas together with the canvas context
     * and bootstraps the canvas events.
     */
    constructor() {
        this.engineCanvas = <HTMLCanvasElement>document.querySelector('#engine-canvas');
        this.context = <CanvasRenderingContext2D>this.engineCanvas.getContext('2d');

        // Ensure we resize the canvas here.
        this.resizeCanvas();

        this.bootstrapCanvasEvents();
    }

    /**
     * Configures events attached directly to the the canvas.
     * 
     * @author NSSure
     * @since 11/8/2020
     */
    bootstrapCanvasEvents(): void {
        this.engineCanvas.addEventListener('keydown', (event: KeyboardEvent) => {
            console.log(event);
        });

        this.engineCanvas.addEventListener('click', (event) => this.onCanvasClick(event));
        this.engineCanvas.addEventListener('mousemove', (event) => this.onCanvasHover(event));
        this.engineCanvas.addEventListener('mouseenter', (event) => this.onCanvasEnter(event));
        this.engineCanvas.addEventListener('mouseleave', (event) => this.onCanvasLeave(event));
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

        this.drawUIFragments();
        this.iterateFragments();

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

    iterateFragments(): void {
        this.fragments.uiFragments.forEach((uiFragment: UIBase) => {
            // If the fragment is not interactive simply check the position check.
            if (uiFragment.isInteractive) {
                if (isCoordinateContained(this.mousePosition, uiFragment.transform)) {
                    uiFragment.isHovered = true;
                    
                    if (uiFragment.onHover) {
                        uiFragment?.onHover();
                    }
                }
                else if (uiFragment.isHovered) {
                    uiFragment.isHovered = false;
                }
            }
        });
    }

    drawText(): void {
        this.context.font = '30px Arial';
        this.context.fillStyle = 'red';
        this.context.textAlign = 'center';
        this.context.fillText('Hello world', 100, 100);
    }

    drawUIFragments(): void {
        this.fragments.uiFragments.forEach((uiFragment: UIBase) => {
            if (uiFragment.isEnabled) {
                this.context.beginPath();

                if (uiFragment.isHovered && uiFragment.hoverState) {
                    this.context.fillStyle = <string>uiFragment.hoverState.backgroundColor;
                }
                else {
                    this.context.fillStyle = uiFragment.backgroundColor;
                }

                this.context.fillRect(uiFragment.transform.x, uiFragment.transform.y, uiFragment.transform.width, uiFragment.transform.height);
                this.context.closePath(); 

                switch(uiFragment.constructor.name) {
                    case uiConstants.entityName.button:
                        this.context.font = '16px Arial';
                        this.context.fillStyle = 'white';
                        this.context.textAlign = 'center';
                        this.context.textBaseline = 'middle';
                        let x = uiFragment.transform.x + (uiFragment.transform.width / 2);
                        let y = uiFragment.transform.y + (uiFragment.transform.height / 2);
                        this.context.fillText((<Button>uiFragment).text, x, y);
                        break;
                    default:
                        break;
                }
            }
        });
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

    }

    onCanvasHover(event: MouseEvent): void {
        this.mousePosition = { x: event.clientX, y: event.clientY };

        // Determines fragment hovers.

    }

    onCanvasEnter(event: MouseEvent): void {

    }

    onCanvasLeave(event: MouseEvent): void {

    }
}