import Entity from "../entity";
import HoverState from "./states/hover-state";
import Thickness from "./thickness";

interface UIBase {
    onHover?(): void;
    onEnter?(): void;
    onExit?(): void;
    onClick?(): void;
    onKeypress?(): void;
}

abstract class UIBase extends Entity {
    backgroundColor: string = 'transparent';
    padding: Thickness = new Thickness();
    margin: Thickness = new Thickness();

    isInteractive: boolean = false;
    isHovered: boolean = false;

    hoverState?: HoverState;

    constructor(x: number, y: number, width: number, height: number) {
        super();

        this.transform.x = x;
        this.transform.y = y;
        this.transform.width = width;
        this.transform.height = height;
    }
}

export default UIBase;