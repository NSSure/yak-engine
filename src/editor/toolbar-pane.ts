import Application from "../application";
import { EditorMode } from "../enums/EditorMode";
import { Logger } from "../logging/logger";

export default class ToolbarPane {
    constructor() {
        let btnToolbarItems = <NodeListOf<HTMLButtonElement>>document.querySelectorAll('.btn-toolbar-item');

        Logger.data(btnToolbarItems);

        if (btnToolbarItems) {
            btnToolbarItems.forEach((btnToolbarItem: HTMLButtonElement) => {
                btnToolbarItem.addEventListener('click', (event) => {
                    let mode = <EditorMode>parseInt(btnToolbarItem.dataset.editorMode);
    
                    if (Application.instance.graphics.canvas.editorRenderer.editorMode === mode) {
                        btnToolbarItem.classList.remove('active');
                        Application.instance.graphics.canvas.editorRenderer.editorMode = EditorMode.NONE;
                    }
                    else {
                        Application.instance.graphics.canvas.editorRenderer.editorMode = mode;
    
                        btnToolbarItems.forEach((otherItem: HTMLButtonElement) => {
                            otherItem.classList.remove('active');
                        });
    
                        btnToolbarItem.classList.add('active');
                    }
                });
            });
        }

        let btnHighlightLayer = document.querySelector('.chk-highlight-current-layer');

        btnHighlightLayer.addEventListener('click', (event) => {
            let target = <HTMLInputElement>event.target;
            Application.instance.graphics.canvas.editorRenderer.highlightCurrentLayer = target.checked;
        });
    }
}