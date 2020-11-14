import HtmlOverlay from "../html-overlay";
import { OverlayPosition } from "../overlay-position";
import { HtmlOverlayDecorator } from '../../decorators/html-overlay-decorator';
import Application from "../../application";

@HtmlOverlayDecorator({
    name: 'toolbar-ribbon',
    templateUrl: './overlays/src/overlays/toolbar-ribbon-overlay/toolbar-ribbon-overlay-template.html',
})
export default class ToolbarRibbonOverlay extends HtmlOverlay {
    title: string = 'Toolbar';
    order: number = 0;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.TOP_RIGHT;
    isMoveable: boolean = true;

    bootstrap() {
        let btnSelectionMode = document.querySelector('.btn-selection-mode');

        if (Application.instance.graphics.canvas.isSelectionMode) {
            btnSelectionMode.classList.add('active');
        }

        btnSelectionMode.addEventListener('click', (event) => {
            Application.instance.graphics.canvas.toggleSelectionMode(!Application.instance.graphics.canvas.isSelectionMode);

            if (Application.instance.graphics.canvas.isSelectionMode) {
                btnSelectionMode.classList.add('active');
            }
            else {
                btnSelectionMode.classList.remove('active');
            }
        });
    }

    sync() {

    }
}