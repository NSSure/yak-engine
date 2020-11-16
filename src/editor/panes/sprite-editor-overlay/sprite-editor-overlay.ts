import Application from "../../../application";
import isCanvasBlank from "../../../helpers/is-canvas-empty";
import HtmlOverlay from "../../html-overlay";
import { OverlayPosition } from "../../overlay-position";
import { HtmlOverlayDecorator } from '../../../decorators/html-overlay-decorator';
import Sprite from "../../../graphics/sprite";
import Transform from "../../../primitives/transform";
import { Logger } from "../../../logging/logger";
import Tileset from "../../../graphics/tileset";

@HtmlOverlayDecorator({
    name: 'sprite-editor',
    templateUrl: './overlays/src/editor/panes/sprite-editor-overlay/sprite-editor-overlay-template.html',
})
export default class SpriteEditorOverlay extends HtmlOverlay {
    title: string = 'Sprite Editor';
    order: number = 0;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.TOP_LEFT;
    isMoveable: boolean = true;

    spriteLoader: HTMLDivElement;

    // This will be fired after the init function is fired.
    bootstrap() {
        this.spriteLoader = <HTMLDivElement>this.container.querySelector('.sprite-loader');

        let btnLoadTileset = <HTMLButtonElement>document.querySelector('#btn-load-tileset');
        let btnSlice = <HTMLButtonElement>document.querySelector('#btn-slice');
        let tilesetPath = <HTMLInputElement>document.querySelector('#tileset-path');

        let tileset = new Image();

        if (btnLoadTileset) {
            btnLoadTileset.addEventListener('click', (event) => {
                this.spriteLoader.style.display = 'inherit';

                tileset.onload = () => {
                    let newTileset = new Tileset();
                    newTileset.image = tileset;
                    Application.instance.graphics.canvas.tilesets.push(newTileset);

                    (<HTMLDivElement>document.querySelector('#tileset-dimensions')).style.display = 'inherit';
                    btnSlice.click();
                }
        
                tileset.onerror = () => {
                    let errorMsg = <HTMLSpanElement>this.content.querySelector('.error-msg');
                    errorMsg.style.display = 'inherit';
                    errorMsg.textContent = 'Failed to load tileset';
                }
        
                tileset.src = tilesetPath.value;
            });

            btnLoadTileset.click();
        }

        if (btnSlice) {
            btnSlice.addEventListener('click', (event) => {
                let pixelSizeX: any = (<HTMLInputElement>document.querySelector('#pixel-size-x')).value;
                let pixelSizeY: any = (<HTMLInputElement>document.querySelector('#pixel-size-y')).value;
                let pixelScaler: any = (<HTMLInputElement>document.querySelector('#pixel-scaler')).value;

                let spriteList = <HTMLUListElement>document.querySelector('#sprite-list');
                spriteList!.innerHTML = '';
                spriteList.style.gridTemplateColumns = `repeat(auto-fit, minmax(${pixelSizeX * pixelScaler}px, 1fr)`

                if (pixelSizeX && pixelSizeY) {
                    let spriteCountX = tileset.width / pixelSizeX;
                    let spriteCountY = tileset.height / pixelSizeY;

                    for (let row = 0; row < spriteCountY; row++) {
                        for (let column = 0; column < spriteCountX; column++) {
                            let canvas = <HTMLCanvasElement>document.createElement('canvas');

                            canvas.width = pixelSizeX * pixelScaler;
                            canvas.height = pixelSizeY * pixelScaler;

                            canvas.getContext('2d')?.drawImage(tileset, pixelSizeX * column, pixelSizeY * row, pixelSizeX, pixelSizeY, 0, 0, 32 * pixelScaler, 32 * pixelScaler);

                            if (!isCanvasBlank(canvas)) {
                                let li = document.createElement('li');

                                li.setAttribute('data-sprite-row', row.toString());
                                li.setAttribute('data-sprite-column', column.toString());

                                let spriteImg = document.createElement('img');

                                spriteImg.addEventListener('click', (event) => {
                                    event.stopImmediatePropagation();
                                    event.preventDefault();

                                    let prev = this.content.querySelector('ul li img.pending-sprite');
                                    
                                    if (prev) {
                                        prev.classList.remove('pending-sprite');
                                    }

                                    spriteImg.classList.add('pending-sprite');

                                    // Start pend sprite.
                                    let sprite = new Sprite();

                                    let tilesetColumns = tileset.width / pixelSizeX;
                                    let tilesetRows = tileset.height / pixelSizeY;

                                    Logger.data(`row: ${tilesetRows} // column: ${tilesetColumns}`);
                                    Logger.data(column * Application.instance.configuration.gridSquareSize);
                                    Logger.data(row * Application.instance.configuration.gridSquareSize);

                                    sprite.tilesetTransform = new Transform(
                                        column * Application.instance.configuration.gridSquareSize,
                                        row * Application.instance.configuration.gridSquareSize, 
                                        Application.instance.configuration.gridSquareSize,
                                        Application.instance.configuration.gridSquareSize
                                    );

                                    sprite.tileset = 0;

                                    Application.instance.stateManager.commit<Sprite>('pending-sprite', sprite);
                                })

                                spriteImg.src = canvas.toDataURL();
                                li.appendChild(spriteImg);
                                spriteList!.appendChild(li);
                            }
                        }
                    }
                }

                this.spriteLoader.style.display = 'none';
            })
        }
    }

    sync() {
        // do nothing.
    }
}