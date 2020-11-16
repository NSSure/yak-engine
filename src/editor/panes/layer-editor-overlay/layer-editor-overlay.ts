import Application from "../../../application";
import HtmlOverlay from "../../html-overlay";
import { OverlayPosition } from "../../overlay-position";
import { HtmlOverlayDecorator } from '../../../decorators/html-overlay-decorator';
import Layer from "../../../graphics/layer";
import { Logger } from "../../../logging/logger";

@HtmlOverlayDecorator({
    name: 'layer-editor',
    templateUrl: './overlays/src/editor/panes/layer-editor-overlay/layer-editor-overlay-template.html',
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
            let layer = new Layer(value);
            Application.instance.graphics.canvas.layers.push(layer);

            (<HTMLInputElement>this.container.querySelector('input')).value = '';
        });

        (<HTMLInputElement>this.container.querySelector('input')).ondrop = (event: DragEvent) => {
            Logger.info('i was dropped into an input');
        }
    }

    currentLi: HTMLLIElement;

    sync() {
        if (this.ul) {
            Application.instance.graphics.canvas.layers.forEach((layer: Layer, layerIndex: number) => {
                if (!this.ul.querySelector(`li[id="${layer.id}"]`)) {
                    Logger.info(layer.id);

                    let li = <HTMLLIElement>this.liTemplate.cloneNode(true);
                    li.id = layer.id;

                    li.draggable = true;

                    li.ondragstart = (event: DragEvent) => {
                        event.dataTransfer.setData('text/plain', layerIndex.toString());
                        this.currentLi = li;
                    };

                    li.ondragenter = (event: DragEvent) => {
                        event.preventDefault();
                    }

                    li.ondragleave = (event: DragEvent) => {
                        event.preventDefault();
                        let target = (<HTMLLIElement>event.target);
                        target.style.border = 'none';
                    }

                    li.ondragover = (event: DragEvent) => {
                        event.preventDefault();

                        let target = (<HTMLLIElement>event.currentTarget);

                        if (this.currentLi.id !== target.id) {
                            Logger.info('I was just dragged on: ' + layer.id);

                            let top = target.getBoundingClientRect().top;
                            let half = target.getBoundingClientRect().top + (target.clientHeight / 2);
    
                            if (event.clientY > top && event.clientY < half) {
                                target.style.borderTop = '2px solid yellow';
                                target.style.borderBottom = 'none';
                            }
                            else if (event.clientY > top && event.clientY > half && event.clientY < (top + target.clientHeight)) {
                                target.style.borderBottom = '2px solid yellow';
                                target.style.borderTop = 'none';
                            }
                            else {
                                Logger.info('math is hard');
                            }
                        }
                    }

                    li.ondrop = (event: DragEvent) => {
                        event.preventDefault();

                        Logger.info('dropped');

                        let layerIndex = parseInt(event.dataTransfer.getData('text/plain'));

                        let targetLayerId = (<HTMLLIElement>event.target).id;
                        let targetLayerIndex = Application.instance.graphics.canvas.layers.findIndex(x => x.id === targetLayerId);

                        let sourceLayer = Application.instance.graphics.canvas.layers.splice(layerIndex, 1)[0];

                        Application.instance.graphics.canvas.layers.splice(targetLayerIndex, 0, sourceLayer);
                        
                        Logger.info('dropped onto: ' + (<HTMLLIElement>event.target).id);
                    }

                    if (layerIndex === 0) {
                        li.classList.add('active');
                    }

                    li.addEventListener('click', (event) => {
                        this.container.querySelectorAll('li').forEach((li) => {
                            li.classList.remove('active');
                        });

                        li.classList.add('active');

                        Application.instance.graphics.canvas.editorRenderer.currentLayer = layer;
                    })
    
                    li.querySelector('.layer-name').innerHTML = layer.name;
    
                    li.querySelector('.btn-toggle-layer').addEventListener('click', (event) => {
                        layer.enabled = !layer.enabled;

                        let icon = (<HTMLSpanElement>event.currentTarget).querySelector('i');

                        if (layer.enabled) {
                            icon.classList.remove('fa-eye-slash');
                            icon.classList.add('fa-eye');
                        }
                        else {
                            icon.classList.remove('fa-eye');
                            icon.classList.add('fa-eye-slash');
                        }
                    });

                    li.querySelector('.btn-lock-layer').addEventListener('click', (event) => {
                        layer.locked = !layer.locked;

                        let icon = (<HTMLSpanElement>event.currentTarget).querySelector('i');

                        if (layer.locked) {
                            icon.classList.remove('fa-unlock');
                            icon.classList.add('fa-lock');
                        }
                        else {
                            icon.classList.remove('fa-lock');
                            icon.classList.add('fa-unlock');
                        }
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