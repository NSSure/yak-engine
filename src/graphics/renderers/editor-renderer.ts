import Application from "../../application";
import { EditorMode } from "../../enums/EditorMode";
import areTransformsEqual from "../../helpers/are-transforms-equal";
import fillTransform from "../../helpers/fill-transform";
import fillTransparentRect from "../../helpers/fill-transparent-rect";
import isCoordinateContained from "../../helpers/is-coordinate-contained";
import { Logger } from "../../logging/logger";
import Point from "../../primitives/Point";
import Transform from "../../primitives/transform";
import Canvas from "../canvas";
import Layer from "../layer";
import Sprite from "../sprite";

export default class EditorRenderer {
    canvas: Canvas;

    /**
     * The current mode for the sprite editor.
     */
    public editorMode: EditorMode = EditorMode.NONE;

    /**
    * Flag to determine if the canvas context menu is open.
    */
    public isContextMenuOpen: boolean = false;

    /**
    * The context menu DOM element.
    */
    public currentContextMenu: HTMLDivElement;
    
    public currentLayer: Layer;

    public highlightCurrentLayer: boolean = false;

    public selectedSprites: Array<Sprite> = new Array();
    
    public hoveredSprite: Sprite;

    constructor(canvas: Canvas) {
        this.canvas = canvas;

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key.toLowerCase() == 'escape') {
                this.editorMode = EditorMode.NONE;
            }
        });

        this.canvas.engineCanvas.addEventListener('focusout', (event) => {
            if (this.isContextMenuOpen) {
                this.isContextMenuOpen = false;
                document.body.removeChild(this.currentContextMenu);
            }
        })

        this.canvas.engineCanvas.oncontextmenu = this.onCanvasContextMenu;

        this.canvas.engineCanvas.addEventListener('mousedown', (event) => this.onCanvasMouseDown(event));
        this.canvas.engineCanvas.addEventListener('mouseup', (event) => this.onCanvasMouseUp(event));
    }

    run(): void {
        this.drawGridLines();
        this.drawSelectionTransform();
        this.drawSpritePreview();

        // TODO: Move this.
        if (!this.currentLayer.locked) {
            if (this.editorMode === EditorMode.ERASER && this.canvas.isMouseDown) {
                let spriteIndex = this.currentLayer.sprites.findIndex(sprite => isCoordinateContained(this.canvas.mousePosition, sprite.transform));
    
                if (spriteIndex !== -1) {
                    this.currentLayer.sprites.splice(spriteIndex, 1);
                }
            }
    
            // TODO: This is just test code.
            if (this.editorMode === EditorMode.SELECT_SAME_TILE) {
                let sprite = this.currentLayer.sprites.find(sprite => isCoordinateContained(this.canvas.mousePosition, sprite.transform));
    
                if (!sprite) {
                    this.selectedSprites = new Array();
                    this.hoveredSprite = null;
                }
                else {
                    if (!this.hoveredSprite || !areTransformsEqual(sprite.tilesetTransform, this.hoveredSprite.tilesetTransform)) {
                        this.hoveredSprite = sprite;
                        this.selectedSprites = this.currentLayer.sprites.filter((sprite) => areTransformsEqual(this.hoveredSprite.tilesetTransform, sprite.tilesetTransform));
                    }
                }
            }
        }

        this.highlightSelectedSprites();
    }

    /**
     * 
     */
    highlightSelectedSprites(): void {
        if (this.selectedSprites && this.selectedSprites.length > 0) {
            this.selectedSprites.forEach((selectedSprite: Sprite) => fillTransparentRect(this.canvas.context, selectedSprite.transform));
        }
    }

    /**
     * 
     * @param transformCoordinates 
     */
    openContextMenu(transformCoordinates: Point): void {
        if (this.isContextMenuOpen) {
            document.body.removeChild(this.currentContextMenu);
        }

        Application.instance.stateManager.delete('pending-sprite-image');

        this.isContextMenuOpen = true;

        this.currentContextMenu = document.createElement('div');

        this.currentContextMenu.classList.add('engine-context-menu');
        this.currentContextMenu.style.position = 'absolute';
        this.currentContextMenu.style.top = `${transformCoordinates.y + Application.instance.configuration.gridSquareSize}px`;
        this.currentContextMenu.style.left = `${transformCoordinates.x + Application.instance.configuration.gridSquareSize}px`;

        this.currentContextMenu.innerHTML = Application.contextMenuTemplate;

        document.body.appendChild(this.currentContextMenu);
    }

    /**
     * 
     */
    drawGridLines(): void {
        this.canvas.context.globalAlpha = 1;

        let spriteCountX = this.canvas.getCanvasWidth() / Application.instance.configuration.gridSquareSize;
        let spriteCountY = this.canvas.getCanvasHeight() / Application.instance.configuration.gridSquareSize;

        for (let column = 0; column < spriteCountX; column++) {
            this.canvas.context.beginPath(); 
            this.canvas.context.lineWidth = Application.instance.configuration.editorGridThickness;
            this.canvas.context.strokeStyle = Application.instance.configuration.editorGridFill;
            this.canvas.context.moveTo(column * Application.instance.configuration.gridSquareSize, 0);
            this.canvas.context.lineTo(column * Application.instance.configuration.gridSquareSize, this.canvas.getCanvasHeight());
            this.canvas.context.stroke();
            this.canvas.context.closePath();
        }

        for (let row = 0; row < spriteCountY; row++) {
            this.canvas.context.beginPath(); 
            this.canvas.context.lineWidth = Application.instance.configuration.editorGridThickness;
            this.canvas.context.strokeStyle = Application.instance.configuration.editorGridFill;
            this.canvas.context.moveTo(0, row * Application.instance.configuration.gridSquareSize);
            this.canvas.context.lineTo(this.canvas.getCanvasWidth(), row * Application.instance.configuration.gridSquareSize);
            this.canvas.context.stroke();
            this.canvas.context.closePath();
        }
    }

    /**
     * 
     */
    drawSelectionTransform(): void {
        if (this.editorMode === EditorMode.SELECTION || this.editorMode === EditorMode.SHAPE_FILL) {
            fillTransform(this.canvas.context, this.canvas.selectionTransform);
        }
    }

    /**
     * Rename this is draw hover preview. This will render an image instead of from a tileset.
     */
    drawSpritePreview(): void {
        if (this.editorMode == EditorMode.STAMP) {
        let pendingSpite = Application.instance.stateManager.get<Sprite>('pending-sprite');

            if (pendingSpite) {
                Logger.data(pendingSpite);

                this.canvas.context.drawImage(
                    this.canvas.tilesets[0].image,
                     pendingSpite.transform.x * Application.instance.configuration.gridSquareSize, 
                     pendingSpite.transform.y * Application.instance.configuration.gridSquareSize,
                     Application.instance.configuration.gridSquareSize, 
                     Application.instance.configuration.gridSquareSize,
                     this.canvas.gridCoordinates.x * Application.instance.configuration.gridSquareSize,
                     this.canvas.gridCoordinates.y * Application.instance.configuration.gridSquareSize,
                     Application.instance.configuration.gridSquareSize,
                     Application.instance.configuration.gridSquareSize,
                );
            }
        }
    }

    /**
     * 
     * @param event 
     */
    onCanvasContextMenu(event: MouseEvent): void {
        event.preventDefault();

        // Can't open context menu when in selection mode. The menu is opened after the selection is made.
        if (this.editorMode === EditorMode.SELECTION) {
            return;
        }

        this.canvas.fragments.spriteFragments.some((sprite: Sprite) => {
            if (isCoordinateContained(this.canvas.mousePosition, sprite.transform)) {
                event.preventDefault();
                this.openContextMenu(new Point(sprite.transform.x, sprite.transform.y));
            }
        });
    }

    onCanvasMouseDown(event: MouseEvent): void {
        if (this.isContextMenuOpen) {
            this.isContextMenuOpen = false;
            document.body.removeChild(this.currentContextMenu);
        }

        // On left click if selection mode empty selection transform.
        if (event.button === 0) {
            if (this.editorMode === EditorMode.SELECTION || this.editorMode === EditorMode.SHAPE_FILL) {
                Logger.info('clear selection');
                this.canvas.selectionTransform = Transform.empty;
            }
        }

        if (Application.instance.stateManager.exists('pending-sprite') && this.editorMode == EditorMode.STAMP && !this.currentLayer.locked) {
            let sprite = Object.assign({}, Application.instance.stateManager.get<Sprite>('pending-sprite'));

            sprite.transform = new Transform(
                this.canvas.gridCoordinates.x * Application.instance.configuration.gridSquareSize,
                this.canvas.gridCoordinates.y * Application.instance.configuration.gridSquareSize,
                Application.instance.configuration.gridSquareSize,
                Application.instance.configuration.gridSquareSize
            );

            this.currentLayer.sprites.push(sprite);

            Logger.data(this.canvas.layers);
        }
    }

    onCanvasMouseUp(event: MouseEvent): void {
        // On right click.
        if (event.button === 2) {
            this.openContextMenu(this.canvas.mousePosition);
        }

        // Apply shape fill.
        if (this.editorMode == EditorMode.SHAPE_FILL && event.button === 0 && Application.instance.stateManager.exists('pending-sprite') && !this.currentLayer.locked) {
            let rows = this.canvas.selectionTransform.height / Application.instance.configuration.gridSquareSize;
            let columns = this.canvas.selectionTransform.width / Application.instance.configuration.gridSquareSize;

            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    let sprite = Object.assign({}, Application.instance.stateManager.get<Sprite>('pending-sprite'));

                    sprite.transform = new Transform(
                        (column * Application.instance.configuration.gridSquareSize) + this.canvas.selectionTransform.x,
                        (row * Application.instance.configuration.gridSquareSize) + this.canvas.selectionTransform.y,
                        Application.instance.configuration.gridSquareSize,
                        Application.instance.configuration.gridSquareSize
                    );
    
                    this.currentLayer.sprites.push(sprite);
                }
            }

            this.canvas.selectionTransform = Transform.empty;
        }
    }
}