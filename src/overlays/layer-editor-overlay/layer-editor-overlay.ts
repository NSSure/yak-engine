import Application from "../../application";
import isCanvasBlank from "../../helpers/is-canvas-empty";
import { Logger } from "../../logging/logger";
import Time from "../../time";
import HtmlOverlay from "../html-overlay";
import { OverlayPosition } from "../overlay-position";
import { HtmlOverlayConfig, HtmlOverlayDecorator } from '../../decorators/html-overlay-decorator';
import Sprite from "../../graphics/sprite";
import StateManager from "../../state/state-manager";

@HtmlOverlayDecorator({
    name: 'layer-editor',
    templateUrl: './overlays/src/overlays/layer-editor-overlay/layer-editor-overlay-template.html',
})
export default class LayerEditorOverlay extends HtmlOverlay {
    title: string = 'Layer Editor';
    order: number = 1;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.TOP_RIGHT;
    isMoveable: boolean = true;

    ul: HTMLUListElement;

    bootstrap() {
        this.ul = <HTMLUListElement>this.content.querySelector('ul');

        this.content.querySelector('button').addEventListener('click', (event) => {
            let value = (<HTMLInputElement>this.content.querySelector('input')).value;
            Application.instance.stateManager.commit(`layer-${value}`, value);

            let li = document.createElement('li');
            li.innerText = value;
            this.ul.appendChild(li);
        });
    }

    sync() {

    }
}