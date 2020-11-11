import Application from "../application";
import isCanvasBlank from "../helpers/is-canvas-empty";
import { Logger } from "../logging/logger";
import Time from "../time";
import HtmlOverlay from "./html-overlay";
import { OverlayPosition } from "./overlay-position";

export default class SpriteEditorOverlay extends HtmlOverlay {
    title: string = 'Sprite Editor';
    order: number = 0;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.TOP_LEFT;
    isMoveable: boolean = true;

    template: string = 
    `
        <input type="text" id="tileset-path" value="/images/tileset.png" />
        <button type="button" id="btn-load-tileset">Load tileset</button>
        <span class="error-msg" style="display: none;"></span>
        <div id="tileset-dimensions" style="display: none;">
            <input type="text" id="pixel-size-x" placeholder="Pixel size x" value="16" />
            <input type="text" id="pixel-size-y" placeholder="Pixel size y" value="16" />
            <input type="text" id="pixel-scaler" placeholder="Pixel scaler" value="2" />
            <button type="button" id="btn-slice">Slice</button>
            <ul id="sprite-list">
            </ul>
        </div>
    `;

    // This will be fired after the init function is fired.
    bootstrap() {
        this.container.classList.add('sprite-editor-overlay');

        let div = document.createElement('div');
        div.innerHTML = this.template;
        this.content?.appendChild(div);

        let btnLoadTileset = <HTMLButtonElement>document.querySelector('#btn-load-tileset');
        let btnSlice = <HTMLButtonElement>document.querySelector('#btn-slice');
        let tilesetPath = <HTMLInputElement>document.querySelector('#tileset-path');

        let tileset = new Image();

        if (btnLoadTileset) {
            btnLoadTileset.addEventListener('click', (event) => {
                Logger.debug('clicked');

                tileset.onload = () => {
                    (<HTMLDivElement>document.querySelector('#tileset-dimensions')).style.display = 'inherit';
                    btnSlice.click();
                }
        
                tileset.onerror = () => {
                    Logger.debug('errored');
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

                    for (let column = 0; column < spriteCountX; column++) {
                        for (let row = 0; row < spriteCountY; row++) {
                            let canvas = <HTMLCanvasElement>document.createElement('canvas');

                            canvas.width = pixelSizeX * pixelScaler;
                            canvas.height = pixelSizeY * pixelScaler;

                            canvas.getContext('2d')?.drawImage(tileset, pixelSizeX * column, pixelSizeY * row, pixelSizeX, pixelSizeY, 0, 0, 16 * pixelScaler, 16 * pixelScaler);

                            if (!isCanvasBlank(canvas)) {
                                if (row === 13 && column === 1) {
                                    Logger.data(canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
                                    Logger.debug(canvas.toDataURL());
                                }

                                let li = document.createElement('li');
                                let spriteImg = document.createElement('img');
                                li.setAttribute('data-sprite-row', row.toString());
                                li.setAttribute('data-sprite-column', column.toString());

                                spriteImg.addEventListener('click', (event) => {
                                    Logger.debug('sprite clicked');
                                })

                                spriteImg.src = canvas.toDataURL();
                                li.appendChild(spriteImg);
                                spriteList!.appendChild(li);
                            }
                            else {
                                Logger.debug('image sprite square');
                            }
                        }
                    }
                }
            })
        }
    }

    sync() {
        // do nothing.
    }
}