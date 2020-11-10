import UIFragment from "./ui-base";

export default class Text extends UIFragment {
    text: string = '';

    setText(text: string) {
        this.text = text;
    }
}