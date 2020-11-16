import Application from "../application";
import { HtmlOverlayDecorator } from "../decorators/html-overlay-decorator";
import Sprite from "../graphics/sprite";
import UIFragment from "../ui/ui-base";
import HtmlOverlay from "./html-overlay";
import { OverlayPosition } from "./overlay-position";

@HtmlOverlayDecorator({
    name: 'fragments',
    template: `<div><div class="sprite-fragments-count"></div><div class="ui-fragments-count"></div></div>`
})
export default class FragmentsOverlay extends HtmlOverlay {
    title: string = 'Fragments';
    order: number = 30;
    isEnabled: boolean = false;
    overlayPosition = OverlayPosition.TOP_RIGHT;
    isMoveable: boolean = true;

    spanSpriteCount: HTMLDivElement;
    spanUICount: HTMLDivElement;

    bootstrap(): void {
        this.spanSpriteCount = this.content!.querySelector('.sprite-fragments-count');
        this.spanUICount = this.content!.querySelector('.ui-fragments-count');
    }

    sync(): void {
        this.spanSpriteCount.innerText = `Total sprites: ${Application.instance.graphics.canvas.fragments.spriteFragments.length}`;
        this.spanUICount.innerText = `Total UI Fragments: ${Application.instance.graphics.canvas.fragments.uiFragments.length}`;
    }
}