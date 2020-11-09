export default class Thickness {
    left?: number = 0;
    top?: number = 0;
    right?: number = 0;
    bottom?: number = 0;

    constructor(left?: number, top?: number, right?: number, bottom?: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    
    set(left: number, top: number, right: number, bottom: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    setX(left: number, right: number) {
        this.left = left;
        this.right = right;
    }

    setY(top: number, bottom: number) {
        this.top = top;
        this.bottom = bottom;
    }

    setLeft(value: number): void {
        this.left = value;
    }

    setTop(value: number): void {
        this.top = value;
    }

    setRight(value: number): void {
        this.right = value;
    }

    setBottom(value: number): void {
        this.bottom = value;
    }
}