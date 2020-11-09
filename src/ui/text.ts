import UIBase from "./ui-base";

export default class Text extends UIBase {
    text: string = '';

    setText(text: string) {
        this.text = text;
    }
}