import Application from "../application";
import createImageFromSprite from "../helpers/create-image-from-sprite";
import currentViewportGridCoordinates from "../helpers/current-viewport-grid-square";
import isCoordinateContained from "../helpers/is-coordinate-contained";
import isTransformEmpty from "../helpers/is-transform-empty";
import { Logger } from "../logging/logger";
import Point from "../primitives/Point";
import Transform from "../primitives/transform";
import UIFragmentsRenderer from "../ui/ui-fragments-renderer";
import Fragments from "./fragments";
import Sprite from "./sprite";
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

    public lastMousePosition: Point = new Point(0, 0);

    public fragments: Fragments = new Fragments();

    public isContextMenuOpen: boolean = false;

    public isMouseDown: boolean = false;

    public currentContextMenu: HTMLDivElement;

    public selectionTransform: Transform = new Transform(0, 0, 0, 0);

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

        this.engineCanvas.addEventListener('mousedown', (event) => this.onCanvasMouseDown(event));
        this.engineCanvas.addEventListener('mouseup', (event) => this.onCanvasMouseUp(event));
        this.engineCanvas.addEventListener('mousemove', (event) => this.onCanvasMouseMove(event));
        this.engineCanvas.addEventListener('mouseenter', (event) => this.onCanvasEnter(event));
        this.engineCanvas.addEventListener('mouseleave', (event) => this.onCanvasLeave(event));

        fetch('./maps/sample-sprite-map.json').then((response) => response.json()).then((map) => {
            this.fragments.spriteFragments = this.fragments.spriteFragments.concat(map);
        });

        // TODO: Move this it should not be here.
        this.engineCanvas.oncontextmenu = (event) => {
            event.preventDefault();

            this.fragments.spriteFragments.some((sprite: Sprite) => {
                if (isCoordinateContained(this.mousePosition, sprite.transform)) {
                    event.preventDefault();

                    if (this.isContextMenuOpen) {
                        return;
                    }

                    Application.instance.stateManager.delete('pending-sprite');

                    this.isContextMenuOpen = true;

                    this.currentContextMenu = document.createElement('div');

                    this.currentContextMenu.classList.add('engine-context-menu');
                    this.currentContextMenu.style.position = 'absolute';
                    this.currentContextMenu.style.top = `${sprite.transform.y + 16}px`;
                    this.currentContextMenu.style.left = `${sprite.transform.x + 16}px`;

                    this.currentContextMenu.innerHTML = Application.contextMenuTemplate;

                    document.body.appendChild(this.currentContextMenu);
                }
            });
        }
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
        this.context.fillStyle = '#181818';
        this.context.fillRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());

        this.uiFragmentsRender.run();
        this.spriteRenderer.run();

        if (!isTransformEmpty(this.selectionTransform)) {
            this.context.fillStyle = 'rgba(252,248,227, 0.7)';
            this.context.fillRect(this.selectionTransform.x, this.selectionTransform.y, this.selectionTransform.width, this.selectionTransform.height);
        }

        if (this.gridCoordinates) {
            let sprite = Application.instance.stateManager.get<Sprite>('pending-sprite');

            if (sprite) {
                let pendingSpriteImage = createImageFromSprite(sprite);
                this.context.drawImage(pendingSpriteImage, this.gridCoordinates.x * 16, this.gridCoordinates.y * 16);
            }
        }

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

    onCanvasMouseDown(event: MouseEvent): void {
        this.isMouseDown = true;

        this.uiFragmentsRender.isHoveredFragmentClicked(this.mousePosition);

        if (this.isContextMenuOpen) {
            this.isContextMenuOpen = false;
            document.body.removeChild(this.currentContextMenu);
        }

        this.spriteRenderer.processPendingSprite();
    }

    onCanvasMouseUp(event: MouseEvent): void {
        if (!isTransformEmpty(this.selectionTransform)) {
            let spriteTemplate = Application.instance.stateManager.get<Sprite>('pending-sprite');

            if (spriteTemplate) {
                let rows = this.selectionTransform.height / 16;
                let columns = this.selectionTransform.width / 16;

                Logger.data(`rows: ${rows} // columns: ${columns}`);

                let test = [];

                for (let row = 0; row < rows; row++) {
                    for (let column = 0; column < columns; column++) {
                        let spriteInstance = new Sprite();

                        spriteInstance.imageData = spriteTemplate.imageData;
                        spriteInstance.transform.x = (column * 16) + this.selectionTransform.x;
                        spriteInstance.transform.y = (row * 16) + this.selectionTransform.y;
                        spriteInstance.transform.width = 16;
                        spriteInstance.transform.height = 16;

                        Logger.data(spriteInstance);

                        test.push(spriteInstance);
                        this.fragments.spriteFragments.push(spriteInstance);
                        
                    }
                }
                Logger.data(this.fragments.spriteFragments);
                Logger.data(test);
            }
        }

        this.isMouseDown = false;
        this.selectionTransform = Transform.empty;
    }

    gridCoordinates: Point;

    onCanvasMouseMove(event: MouseEvent): void {
        this.mousePosition = new Point(event.clientX, event.clientY);

        this.gridCoordinates = currentViewportGridCoordinates(this.mousePosition);

        if (this.isMouseDown) {
            if (isTransformEmpty(this.selectionTransform)) {
                this.selectionTransform = new Transform(this.gridCoordinates.x * 16, this.gridCoordinates.y * 16, 0, 0);
            }
            else {
                this.selectionTransform.width = ((this.gridCoordinates.x * 16) - this.selectionTransform.x) + 16;
                this.selectionTransform.height = ((this.gridCoordinates.y * 16) - this.selectionTransform.y) + 16;
            }
        }
    }

    onCanvasEnter(event: MouseEvent): void {

    }

    onCanvasLeave(event: MouseEvent): void {

    }
}