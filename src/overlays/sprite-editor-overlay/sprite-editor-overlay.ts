import Application from "../../application";
import isCanvasBlank from "../../helpers/is-canvas-empty";
import HtmlOverlay from "../html-overlay";
import { OverlayPosition } from "../overlay-position";
import { HtmlOverlayDecorator } from '../../decorators/html-overlay-decorator';
import Sprite from "../../graphics/sprite";

@HtmlOverlayDecorator({
    name: 'sprite-editor',
    templateUrl: './overlays/src/overlays/sprite-editor-overlay/sprite-editor-overlay-template.html',
})
export default class SpriteEditorOverlay extends HtmlOverlay {
    title: string = 'Sprite Editor';
    order: number = 0;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.TOP_LEFT;
    isMoveable: boolean = true;

    // This will be fired after the init function is fired.
    bootstrap() {
        let btnLoadTileset = <HTMLButtonElement>document.querySelector('#btn-load-tileset');
        let btnSlice = <HTMLButtonElement>document.querySelector('#btn-slice');
        let tilesetPath = <HTMLInputElement>document.querySelector('#tileset-path');

        let tileset = new Image();

        if (btnLoadTileset) {
            btnLoadTileset.addEventListener('click', (event) => {
                tileset.onload = () => {
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

                    for (let column = 0; column < spriteCountX; column++) {
                        for (let row = 0; row < spriteCountY; row++) {
                            let canvas = <HTMLCanvasElement>document.createElement('canvas');

                            canvas.width = pixelSizeX * pixelScaler;
                            canvas.height = pixelSizeY * pixelScaler;

                            canvas.getContext('2d')?.drawImage(tileset, pixelSizeX * column, pixelSizeY * row, pixelSizeX, pixelSizeY, 0, 0, 16 * pixelScaler, 16 * pixelScaler);

                            if (!isCanvasBlank(canvas)) {
                                let li = document.createElement('li');
                                let spriteImg = document.createElement('img');
                                li.setAttribute('data-sprite-row', row.toString());
                                li.setAttribute('data-sprite-column', column.toString());

                                spriteImg.addEventListener('click', (event) => {
                                    event.stopImmediatePropagation();
                                    event.preventDefault();

                                    let prev = this.content.querySelector('ul li img.pending-sprite');
                                    
                                    if (prev) {
                                        prev.classList.remove('pending-sprite');
                                    }

                                    spriteImg.classList.add('pending-sprite');

                                    let { spriteRow, spriteColumn } = (<HTMLLIElement>event.target).dataset;
                                    let sprite = new Sprite();
                                    sprite.imageData = canvas.toDataURL();
                                    Application.instance.stateManager.commit<any>('pending-sprite', sprite);

                                    // sprite.x = Application.instance.graphics.canvas.mousePosition.x;
                                    // sprite.y = Application.instance.graphics.canvas.mousePosition.y;
                                    // sprite.width = 16;
                                    // sprite.height = 16;
                                    // sprite.enabled = true;
                                    // sprite.order = 0;
                                    // sprite.layer = 0;
                                })

                                spriteImg.src = canvas.toDataURL();
                                li.appendChild(spriteImg);
                                spriteList!.appendChild(li);
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