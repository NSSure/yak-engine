import Application from "../application";
import currentViewportGridCoordinates from "../helpers/current-viewport-grid-square";
import { Logger } from "../logging/logger";
import Transform from "../primitives/transform";
import Canvas from "./canvas";
import Layer from "./layer";
import Sprite from "./sprite";

export default class SpriteRenderer {
    canvas: Canvas;
    tileset = new Image();

    constructor(canvas: Canvas) {
        this.canvas = canvas;

        this.tileset.onload = () => {

        }

        this.tileset.onerror = () => {
            Logger.error('Failed to load tilset from sprite renderer.');
        }

        this.tileset.src = './images/[Base]BaseChip_pipo.png';

        this.canvas.engineCanvas.addEventListener('mousedown', (event) => {

        });
    }

    run(): void {
        this.drawLayers();
    }

    drawLayers(): void {
        this.canvas.layers.forEach((layer: Layer) => {
            if (this.canvas.editorRenderer.highlightCurrentLayer) {
                if (layer.id === this.canvas.editorRenderer.currentLayer.id) {
                    this.canvas.context.globalAlpha = 1;
                }
                else {
                    this.canvas.context.globalAlpha = 0.20;
                }
            }
            else {
                this.canvas.context.globalAlpha = 1;
            }

            if (layer.enabled) {
                layer.sprites.forEach((sprite: Sprite) => {
                    // TODO: Handle camera viewport.
                    this.canvas.context.drawImage(
                        this.tileset, 
                        sprite.tilesetTransform.x,
                        sprite.tilesetTransform.y, 
                        Application.instance.configuration.gridSquareSize, 
                        Application.instance.configuration.gridSquareSize, 
                        sprite.transform.x, 
                        sprite.transform.y, 
                        Application.instance.configuration.gridSquareSize, 
                        Application.instance.configuration.gridSquareSize
                    ); 
                });
            }
        });
    }

    drawSpritePreview(): void {
        if (this.canvas.gridCoordinates) {
            let spriteImageData = Application.instance.stateManager.get<any>('pending-sprite-image');

            if (spriteImageData) {
                let spriteImage = new Image();
                spriteImage.src = spriteImageData.imageData;
                this.canvas.context.drawImage(spriteImage, Application.instance.configuration.gridSquareSize, Application.instance.configuration.gridSquareSize);
            }
        }
    }

    onTilesetLoaded(event: Event): void {
        console.log(event);
    }
}