import Application from "../application";
import currentViewportGridSquare from "../helpers/current-viewport-grid-square";
import { Logger } from "../logging/logger";
import Canvas from "./canvas";
import Sprite from "./sprite";

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
        this.drawLevelPreview();
        this.drawGrid();
    }

    drawGrid(): void {
        let spriteCountX = this.canvas.getCanvasWidth() / this.spriteWidth;
        let spriteCountY = this.canvas.getCanvasHeight() / this.spriteHeight;

        for (let column = 0; column < spriteCountX; column++) {
            this.canvas.context.beginPath(); 
            this.canvas.context.lineWidth = 0.5;
            this.canvas.context.strokeStyle = '#686868';
            this.canvas.context.moveTo(column * 16, 0);
            this.canvas.context.lineTo(column * 16, this.canvas.getCanvasHeight());
            this.canvas.context.stroke();
            this.canvas.context.closePath();
        }

        for (let row = 0; row < spriteCountY; row++) {
            // let spriteY = this.spriteHeight * row;
            // this.canvas.context.strokeRect(this.tileset, 32, 176, 16, 16, spriteX, spriteY, 16, 16);
            
            this.canvas.context.beginPath(); 
            this.canvas.context.lineWidth = 0.5;
            this.canvas.context.strokeStyle = '#686868';
            this.canvas.context.moveTo(0, row * 16);
            this.canvas.context.lineTo(this.canvas.getCanvasWidth(), row * 16);
            this.canvas.context.stroke();
            this.canvas.context.closePath();
        }
    }

    drawLevelPreview(): void {
        this.canvas.fragments.spriteFragments.forEach((sprite: Sprite) => {
            let image = new Image();
            image.src = sprite.imageData;
            this.canvas.context.drawImage(image, sprite.transform.x, sprite.transform.y); 
        });
    }

    processPendingSprite(): void {
        let spriteTemplate = Application.instance.stateManager.get<Sprite>('pending-sprite');

        if (spriteTemplate) {
            let spriteInstance = new Sprite();
            spriteInstance.imageData = spriteTemplate.imageData;
    
            let gridCoordinates = currentViewportGridSquare(this.canvas.mousePosition);
    
            spriteInstance.transform.x = gridCoordinates.x * 16;
            spriteInstance.transform.y = gridCoordinates.y * 16;
            spriteInstance.transform.width = 16;
            spriteInstance.transform.height = 16;
    
            this.canvas.fragments.spriteFragments.push(spriteInstance);
        }
    }

    onTilesetLoaded(event: Event): void {
        console.log(event);
    }
}