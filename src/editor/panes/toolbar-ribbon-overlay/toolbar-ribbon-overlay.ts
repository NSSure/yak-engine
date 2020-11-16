import HtmlOverlay from "../../html-overlay";
import { OverlayPosition } from "../../overlay-position";
import { HtmlOverlayDecorator } from '../../../decorators/html-overlay-decorator';
import Application from "../../../application";
import { EditorMode } from "../../../enums/EditorMode";

@HtmlOverlayDecorator({
    name: 'toolbar-ribbon',
    templateUrl: './overlays/src/editor/panes/toolbar-ribbon-overlay/toolbar-ribbon-overlay-template.html',
})
export default class ToolbarRibbonOverlay extends HtmlOverlay {
    title: string = 'Toolbar';
    order: number = 0;
    isEnabled: boolean = false;
    overlayPosition = OverlayPosition.TOP_RIGHT;
    isMoveable: boolean = true;

    btnToolbarItems: NodeListOf<HTMLButtonElement>;

    bootstrap() {
        this.btnToolbarItems = <NodeListOf<HTMLButtonElement>>this.container.querySelectorAll('.btn-toolbar-item');

        if (this.btnToolbarItems) {
            this.btnToolbarItems.forEach((btnToolbarItem: HTMLButtonElement) => {
                btnToolbarItem.addEventListener('click', (event) => {
                    let mode = <EditorMode>parseInt(btnToolbarItem.dataset.editorMode);
    
                    if (Application.instance.graphics.canvas.editorRenderer.editorMode === mode) {
                        btnToolbarItem.classList.remove('active');
                        Application.instance.graphics.canvas.editorRenderer.editorMode = EditorMode.NONE;
                    }
                    else {
                        Application.instance.graphics.canvas.editorRenderer.editorMode = mode;
    
                        this.btnToolbarItems.forEach((otherItem: HTMLButtonElement) => {
                            otherItem.classList.remove('active');
                        });
    
                        btnToolbarItem.classList.add('active');
                    }
                });
            });
        }

        let btnHighlightLayer = this.container.querySelector('.btn-highlight-current-layer');

        btnHighlightLayer.addEventListener('click', (event) => {
            Application.instance.graphics.canvas.editorRenderer.highlightCurrentLayer = !Application.instance.graphics.canvas.editorRenderer.highlightCurrentLayer;
        });
    }

    sync() {
        // Remove the active state from the toolbar item if it is not the active mode.
        if (this.btnToolbarItems) {
            this.btnToolbarItems.forEach((btnToolbarItem: HTMLButtonElement) => {
                let mode = <EditorMode>parseInt(btnToolbarItem.dataset.editorMode);
    
                if (Application.instance.graphics.canvas.editorRenderer.editorMode !== mode) {
                    btnToolbarItem.classList.remove('active');
                }
            });
        }
    }
}