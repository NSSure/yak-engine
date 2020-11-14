import Application from "../../application";
import fillTransform from "../../helpers/fill-transform";
import { Logger } from "../../logging/logger";
import Transform from "../../primitives/transform";
import Canvas from "../canvas";
import Layer from "../layer";
import Sprite from "../sprite";

export default class EditorRenderer {
    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;

        this.canvas.engineCanvas.addEventListener('mousedown', (event) => {
            if (Application.instance.stateManager.exists('pending-sprite')) {
                let sprite = Object.assign({}, Application.instance.stateManager.get<Sprite>('pending-sprite'));

                sprite.transform = new Transform(
                    this.canvas.gridCoordinates.x * Application.instance.configuration.gridSquareSize,
                    this.canvas.gridCoordinates.y * Application.instance.configuration.gridSquareSize,
                    Application.instance.configuration.gridSquareSize,
                    Application.instance.configuration.gridSquareSize
                );

                this.canvas.layers[0].sprites.push(sprite);

                Logger.data(this.canvas.layers);
            }
        });

        this.canvas.engineCanvas.addEventListener('mouseup', (event) => {
            if (event.button === 0 && this.canvas.isSelectionMode && Application.instance.stateManager.exists('pending-sprite')) {
                let rows = this.canvas.selectionTransform.height / Application.instance.configuration.gridSquareSize;
                let columns = this.canvas.selectionTransform.width / Application.instance.configuration.gridSquareSize;

                for (let row = 0; row < rows; row++) {
                    for (let column = 0; column < columns; column++) {
                        // let spriteInstance = new Sprite();

                        // spriteInstance.transform.x = (column * Application.instance.configuration.gridSquareSize) + this.canvas.selectionTransform.x;
                        // spriteInstance.transform.y = (row * Application.instance.configuration.gridSquareSize) + this.canvas.selectionTransform.y;
                        // spriteInstance.transform.width = Application.instance.configuration.gridSquareSize;
                        // spriteInstance.transform.height = Application.instance.configuration.gridSquareSize;
                        // spriteInstance.tilesetTransform = spriteTemplate.tilesetTransform;

                        let sprite = Object.assign({}, Application.instance.stateManager.get<Sprite>('pending-sprite'));

                        sprite.transform = new Transform(
                            (column * Application.instance.configuration.gridSquareSize) + this.canvas.selectionTransform.x,
                            (row * Application.instance.configuration.gridSquareSize) + this.canvas.selectionTransform.y,
                            Application.instance.configuration.gridSquareSize,
                            Application.instance.configuration.gridSquareSize
                        );
        
                        this.canvas.layers[0].sprites.push(sprite);
                    }
                }
            }
        })
    }

    run(): void {
        this.drawGridLines();
        this.drawSelectionTransform();
        this.drawSpritePreview();
    }

    drawGridLines(): void {
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

    drawSelectionTransform(): void {
        if (this.canvas.isSelectionMode) {
            fillTransform(this.canvas.context, this.canvas.selectionTransform);
        }
    }

    floodSelectionTransform(): void {

    }

    drawSpritePreview(): void {
        let pendingSpite = Application.instance.stateManager.get<Sprite>('pending-sprite');

        if (pendingSpite) {
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