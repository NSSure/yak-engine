import Application from "../application";
import { HtmlOverlayDecorator } from "../decorators/html-overlay-decorator";
import Sprite from "../graphics/sprite";
import UIFragment from "../ui/ui-base";
import HtmlOverlay from "./html-overlay";
import { OverlayPosition } from "./overlay-position";

@HtmlOverlayDecorator({
    name: 'fragments',
    template: `<div><span class="sprite-fragments-count"></span><ul class="sprite-fragments"></ul><span class="ui-fragments-count"></span><ul class="canvas-fragments"></ul></div>`
})
export default class FragmentsOverlay extends HtmlOverlay {
    title: string = 'Fragments';
    order: number = 2;
    isEnabled: boolean = true;
    overlayPosition = OverlayPosition.TOP_RIGHT;
    isMoveable: boolean = true;

    spanSpriteCount: HTMLSpanElement;
    ulSpriteFragments: HTMLUListElement;

    spanUICount: HTMLSpanElement;
    ulCanvasFragments: HTMLUListElement;

    bootstrap(): void {
        this.spanSpriteCount = this.content!.querySelector('.sprite-fragments-count');
        this.ulSpriteFragments = this.content!.querySelector('ul.sprite-fragments');

        this.spanUICount = this.content!.querySelector('.ui-fragments-count');
        this.ulCanvasFragments = this.content!.querySelector('ul.canvas-fragments');
    }

    sync(): void {
        this.spanSpriteCount.innerText = `Total sprites: ${Application.instance.graphics.canvas.fragments.spriteFragments.length}`;

        Application.instance.graphics.canvas.fragments.spriteFragments.forEach((spriteFragment: Sprite) => {
            if (!this.ulSpriteFragments.querySelector(`li[data-sprite-id="${spriteFragment.id}"]`)) {
                let li = <HTMLLIElement>document.createElement('li');
                li.id = `sprite-fragment-${spriteFragment.id}`;
                li.innerText = `${spriteFragment.id}`;
                li.setAttribute('data-sprite-id', spriteFragment.id);

                li.addEventListener('click', (event) => {
                    spriteFragment.isEnabled = !spriteFragment.isEnabled;
                });
    
                this.ulSpriteFragments.appendChild(li);
            }
        });

        this.spanUICount.innerText = `Total UI Fragments: ${Application.instance.graphics.canvas.fragments.uiFragments.length}`;

        Application.instance.graphics.canvas.fragments.uiFragments.forEach((uiFragment: UIFragment) => {
            if (!this.ulCanvasFragments.querySelector('li')) {
                let li = <HTMLLIElement>document.createElement('li');
                li.id = `ui-fragment-${uiFragment.id}`;
                li.innerText = `${uiFragment.constructor.name}: ${uiFragment.id}`;

                li.addEventListener('click', (event) => {
                    uiFragment.isEnabled = !uiFragment.isEnabled;
                })
    
                this.ulCanvasFragments.appendChild(li);
            }
        });
    }
}