import Application from "../application";
import UIBase from "../ui/ui-base";
import HtmlOverlay from "./html-overlay";
import { OverlayPosition } from "./overlay-position";

export default class UIFragmentsOverlay extends HtmlOverlay {
    title: string = 'UI Fragments';
    order: number = 1;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.TOP_RIGHT;
    isMoveable: boolean = true;

    ul: HTMLUListElement = document.createElement('ul');

    bootstrap(): void {
        this.content?.appendChild(this.ul);
    }

    sync(): void {
        Application.instance.graphics.canvas.fragments.uiFragments.forEach((uiFragment: UIBase) => {
            if (!this.ul.querySelector('li')) {
                let li = <HTMLLIElement>document.createElement('li');
                li.id = `ui-fragment-${uiFragment.id}`;
                li.innerText = `${uiFragment.constructor.name}: ${uiFragment.id}`;

                li.addEventListener('click', (event) => {
                    uiFragment.isEnabled = !uiFragment.isEnabled;
                })
    
                this.ul.appendChild(li);
            }
        });
    }
}