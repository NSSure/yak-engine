import Application from "../application";
import { EditorMode } from "../enums/EditorMode";
import areTransformsEqual from "../helpers/are-transforms-equal";
import currentViewportGridCoordinates from "../helpers/current-viewport-grid-square";
import isCoordinateContained from "../helpers/is-coordinate-contained";
import isTransformEmpty from "../helpers/is-transform-empty";
import { Logger } from "../logging/logger";
import Point from "../primitives/Point";
import Transform from "../primitives/transform";
import UIFragmentsRenderer from "../ui/ui-fragments-renderer";
import Fragments from "./fragments";
import Layer from "./layer";
import EditorRenderer from "./renderers/editor-renderer";
import Sprite from "./sprite";
import SpriteRenderer from "./sprite-renderer";
import Tileset from "./tileset";

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
     * 
     */
    public tilesets: Array<Tileset> = new Array();

    /**
     * 
     */
    public layers: Array<Layer> = new Array();

    /**
     * The renderer that handle drawing the UI fragments to the given canvas context.
     */
    public uiFragmentsRender: UIFragmentsRenderer = new UIFragmentsRenderer(this);

    /**
     * 
     */
    public spriteRenderer: SpriteRenderer = new SpriteRenderer(this);

    /**
     * 
     */
    public editorRenderer: EditorRenderer = new EditorRenderer(this);

    /**
     * 
     */
    public fragments: Fragments = new Fragments();

    /**
     * The current position of the mouse in relation to the canvas. NOT the document.
     */
    public mousePosition: Point = new Point(0, 0);

    /**
     * The last position of the mouse within the canvas. 
     */
    public lastMousePosition: Point = new Point(0, 0);

    /**
     * The last grid position of the mouse within the canvas.
     */
    public gridCoordinates: Point;

    /**
     * Flag to determine if the mouse is down (specifcally left mouse clicks).
     */
    public isMouseDown: boolean = false;

    /**
     * Flag to determine if the canvas has selection mode enabled.
     */
    public isSelectionMode: boolean = false;

    /**
     * The transform of the current selection. If selection mode is off this
     * will be an empty transform.
     */
    public selectionTransform: Transform = new Transform(0, 0, 0, 0);

    /**
     * Default constructor. Queries the canvas together with the canvas context
     * and bootstraps the canvas events.
     */
    constructor() {
        this.layers.push(new Layer("Default"));
        this.editorRenderer.currentLayer = this.layers[0];

        // Ensure we resize the canvas here.
        this.resizeCanvas();

        this.engineCanvas.addEventListener('mousedown', (event) => this.onCanvasMouseDown(event));
        this.engineCanvas.addEventListener('mouseup', (event) => this.onCanvasMouseUp(event));
        this.engineCanvas.addEventListener('mousemove', (event) => this.onCanvasMouseMove(event));
        this.engineCanvas.addEventListener('mouseenter', (event) => this.onCanvasEnter(event));
        this.engineCanvas.addEventListener('mouseleave', (event) => this.onCanvasLeave(event));

        // TODO: Move this it should not be here.
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
        this.context.fillStyle = Application.instance.configuration.canvasFill;
        this.context.fillRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());

        this.spriteRenderer.run();
        this.uiFragmentsRender.run();
        this.editorRenderer.run();

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
            // this.setCanvasWidth(window.innerWidth);
            // this.setCanvasHeight(window.innerHeight);
        }
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

    toggleSelectionMode(state: boolean): void {
        this.isSelectionMode = state;
        this.selectionTransform = Transform.empty;
    }

    onCanvasMouseDown(event: MouseEvent): void {
        if (event.button === 0) {
            this.isMouseDown = true;
            this.uiFragmentsRender.isHoveredFragmentClicked(this.mousePosition);
        }
    }

    onCanvasMouseUp(event: MouseEvent): void {
        if (!isTransformEmpty(this.selectionTransform)) {
            let spriteTemplate = Application.instance.stateManager.get<any>('pending-sprite-image')

            // If there is a pending sprite auto fill the selection.
            if (spriteTemplate) {
                let rows = this.selectionTransform.height / Application.instance.configuration.gridSquareSize;
                let columns = this.selectionTransform.width / Application.instance.configuration.gridSquareSize;

                for (let row = 0; row < rows; row++) {
                    for (let column = 0; column < columns; column++) {
                        let spriteInstance = new Sprite();

                        spriteInstance.transform.x = (column * Application.instance.configuration.gridSquareSize) + this.selectionTransform.x;
                        spriteInstance.transform.y = (row * Application.instance.configuration.gridSquareSize) + this.selectionTransform.y;
                        spriteInstance.transform.width = Application.instance.configuration.gridSquareSize;
                        spriteInstance.transform.height = Application.instance.configuration.gridSquareSize;
                        // spriteInstance.tilesetTransform = spriteTemplate.tilesetTransform;

                        this.fragments.spriteFragments.push(spriteInstance);
                    }
                }

                Logger.data(this.fragments.spriteFragments);
            }
            else {
                Logger.info('we hit on mouse up with a non empty transform');
                Logger.data(this.selectionTransform);

                if (this.isSelectionMode) {
                    // this.openContextMenu(new Point(this.mousePosition.x, this.mousePosition.y));
                }
            }
        }

        this.isMouseDown = false;
    }

    onCanvasMouseMove(event: MouseEvent): void {
        this.mousePosition = new Point(event.offsetX, event.offsetY);
        // this.pageMousePosition = new Point(event.clientX, event.clientY);

        this.gridCoordinates = currentViewportGridCoordinates(this.mousePosition);

        if ((this.editorRenderer.editorMode == EditorMode.SELECTION || this.editorRenderer.editorMode == EditorMode.SHAPE_FILL) && EditorMode.SHAPE_FILL && this.isMouseDown) {
            if (isTransformEmpty(this.selectionTransform)) {
                this.selectionTransform = new Transform(this.gridCoordinates.x * Application.instance.configuration.gridSquareSize, this.gridCoordinates.y * Application.instance.configuration.gridSquareSize, 0, 0);
            }
            else {
                this.selectionTransform.width = ((this.gridCoordinates.x * Application.instance.configuration.gridSquareSize) - this.selectionTransform.x) + Application.instance.configuration.gridSquareSize;
                this.selectionTransform.height = ((this.gridCoordinates.y * Application.instance.configuration.gridSquareSize) - this.selectionTransform.y) + Application.instance.configuration.gridSquareSize;
            }
        }
    }

    onCanvasEnter(event: MouseEvent): void {

    }

    onCanvasLeave(event: MouseEvent): void {

    }
}