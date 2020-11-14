import Application from "../../application";
import HtmlOverlay from "../html-overlay";
import { OverlayPosition } from "../overlay-position";
import { HtmlOverlayDecorator } from '../../decorators/html-overlay-decorator';
import Layer from "../../graphics/layer";
import { Logger } from "../../logging/logger";

@HtmlOverlayDecorator({
    name: 'layer-editor',
    templateUrl: './overlays/src/overlays/layer-editor-overlay/layer-editor-overlay-template.html',
})
export default class LayerEditorOverlay extends HtmlOverlay {
    title: string = 'Layer Editor';
    order: number = 20;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.TOP_RIGHT;
    isMoveable: boolean = true;

    ul: HTMLUListElement;
    liTemplate: HTMLLIElement;

    bootstrap() {
        this.ul = <HTMLUListElement>this.content.querySelector('ul');
        this.liTemplate = <HTMLLIElement>this.content.querySelector('ul li.layer-template');

        this.content.querySelector('button').addEventListener('click', (event) => {
            let value = (<HTMLInputElement>this.content.querySelector('input')).value;
            Application.instance.stateManager.commit(`layer-${value}`, value);

            let li = document.createElement('li');
            li.innerText = value;
            this.ul.appendChild(li);

            let layer = new Layer(value);
            Application.instance.graphics.canvas.layers.push(layer);
        });
    }

    sync() {
        if (this.ul) {
            Application.instance.graphics.canvas.layers.forEach((layer: Layer, layerIndex: number) => {
                if (!this.ul.querySelector(`li[id="${layer.id}"]`)) {
                    let li = <HTMLLIElement>this.liTemplate.cloneNode(true);
                    li.id = layer.id;
    
                    li.querySelector('.layer-name').innerHTML = layer.name;
    
                    li.querySelector('.btn-toggle-layer').addEventListener('click', (event) => {
                        console.log('testtest');
                        
                        layer.enabled = !layer.enabled;
                    });
    
                    li.querySelector('.btn-remove-layer').addEventListener('click', (event) => {
                        Logger.info('remove layer');
                    });
    
                    li.style.display = 'flex';
                    li.style.justifyContent = 'space-between';
                    li.style.alignItems = 'center';
    
                    this.ul.appendChild(li);
                }
            });
        }
    }
}