import { Logger } from "../logging/logger";
import UIBase from "./ui-base";

export default class Button extends UIBase {
    isInteractive: boolean = true;

    text: string = '';

    onHover(): void {
        Logger.debug(`Entity: ${this.id} is being hovered.`);
    }
}