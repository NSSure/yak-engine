import { Logger } from "../logging/logger";
import Canvas from "./canvas";

export default class SpriteRenderer {
    canvas: Canvas;
    tileset = new Image();

    spriteWidth: number = 16;
    spriteHeight: number = 16;

    constructor(canvas: Canvas) {
        this.canvas = canvas;

        this.tileset.onload = () => {
            let xCount = this.tileset.width / this.spriteWidth;
            let yCount = this.tileset.height / this.spriteHeight;
        }

        this.tileset.onerror = () => {
            Logger.error('Failed to load tileset.');
        }

        this.tileset.src = '/images/tileset.png';
    }

    run(): void {
        this.drawGrid();
    }

    drawGrid(): void {
        let spriteCountX = this.canvas.getCanvasWidth() / this.spriteWidth;
        let spriteCountY = this.canvas.getCanvasHeight() / this.spriteHeight;

        for (let column = 0; column < spriteCountX; column++) {
            let spriteX = this.spriteWidth * column;
            for (let row = 0; row < spriteCountY; row++) {
                let spriteY = this.spriteHeight * row;
                this.canvas.context.drawImage(this.tileset, 32, 176, 16, 16, spriteX, spriteY, 16, 16);
            }
        }
    }

    onTilesetLoaded(event: Event): void {
        console.log(event);
    }
}