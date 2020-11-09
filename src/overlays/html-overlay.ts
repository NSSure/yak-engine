import Application from "../application";
import { MouseQuadrant } from "../enums/MouseQuadrant";
import { OverlayPosition } from "./overlay-position";

export default abstract class HtmlOverlay {
    public container: HTMLDivElement = <HTMLDivElement>document.createElement('div');
    public header: HTMLDivElement = <HTMLDivElement>document.createElement('div');
    public content: HTMLDivElement = <HTMLDivElement>document.createElement('div');

    public isInSnapZone: boolean = false;

    abstract title: string = '';
    abstract order: number = 0;
    abstract isEnabled: boolean = false;
    abstract isMoveable: boolean = false;
    abstract overlayPosition: OverlayPosition;

    public abstract bootstrap(): void;
    public abstract sync(): void;

    constructor() {

    }

    public init(): void {
        if (!this.isEnabled) {
            return;
        }

        this.container.classList.add('overlay-container');
        this.container.style.position = 'absolute';

        this.header.classList.add('overlay-header');
        let title = document.createElement('span');
        title.innerText = this.title;
        this.header.appendChild(title);

        this.content.classList.add('overlay-content');

        this.processOverlayPosition();

        if (this.isMoveable) {
            let dragHandle = document.createElement('button');
            dragHandle.classList.add('header-action');
            dragHandle.classList.add('gear');
            dragHandle.classList.add('drag-handle');

            dragHandle.addEventListener('mousedown', (event) => {
                event.preventDefault();

                let posX1: number;
                let posY1: number;
                let posX2: number;
                let posY2: number;

                posX2 = event.clientX;
                posY2 = event.clientY;

                document.onmouseup = (event) => {
                    document.onmouseup = null;
                    document.onmousemove = null;

                    document.body.classList.remove('display-snap-targets');

                    if (this.isInSnapZone) {
                        this.overlayPosition = OverlayPosition.BOTTOM_LEFT;

                        switch(Application.instance.graphics.dom.mouseQuadrant) {
                            case MouseQuadrant.QUADRANT_ONE:
                                this.overlayPosition = OverlayPosition.TOP_LEFT;
                                break;
                            case MouseQuadrant.QUADRANT_TWO:
                                this.overlayPosition = OverlayPosition.TOP_RIGHT;
                                break;
                            case MouseQuadrant.QUADRANT_THREE:
                                this.overlayPosition = OverlayPosition.BOTTOM_LEFT;
                                break;
                            case MouseQuadrant.QUADRANT_FOUR:
                                this.overlayPosition = OverlayPosition.BOTTOM_RIGHT;
                                break;
                        }

                        this.processOverlayPosition();
                    }
                }

                document.onmousemove = (event) => {
                    document.body.classList.add('display-snap-targets');

                    posX1 = posX2 - event.clientX;
                    posY1 = posY2 - event.clientY;

                    posX2 = event.clientX;
                    posY2 = event.clientY;

                    if (this.container) {
                        this.container.style.top = (this.container.offsetTop - posY1) + "px";
                        this.container.style.left = (this.container.offsetLeft - posX1) + "px";
                    }

                    document.querySelectorAll('.snap-target').forEach((snapTarget) => {
                        let t = <HTMLDivElement>snapTarget;

                        if (posX2 > t.offsetLeft && (posX2 < (t.offsetLeft + t.clientWidth))) {
                            if (posY2 > t.offsetTop && (posY2 < t.offsetTop + t.clientHeight)) {
                                this.isInSnapZone = true;
                            }
                        }
                    });
                }
            });

            this.header.appendChild(dragHandle);
        }

        this.container.appendChild(this.header);
        this.container.appendChild(this.content);

        document.body.appendChild(this.container);

        this.bootstrap();
    }

    private processOverlayPosition(): void {
        // TODO: Clean this up this can be streamlined.
        switch (this.overlayPosition) {
            case OverlayPosition.TOP_LEFT:
                this.container.style.top = '30px';
                this.container.style.left = '30px';
                this.container.style.bottom = '';
                break;
            case OverlayPosition.TOP_CENTER:
                this.container.style.top = '30px';
                this.container.style.left = '50%';
                this.container.style.transform = 'translateX(-50%)';
                this.container.style.bottom = '';
                break;
            case OverlayPosition.TOP_RIGHT:
                this.container.style.top = '30px';
                this.container.style.right = '30px';
                this.container.style.bottom = '';
                this.container.style.left = '';
                break;
            case OverlayPosition.CENTER_LEFT:
                this.container.style.top = '50%';
                this.container.style.transform = 'translateY(-50%)';
                break;
            case OverlayPosition.CENTER:
                this.container.style.top = '50%';
                this.container.style.left = '50%'
                this.container.style.transform = 'translate(-50%, -50%)';
                break;
            case OverlayPosition.CENTER_RIGHT:
                this.container.style.top = '50%';
                this.container.style.right = '30px';
                this.container.style.transform = 'translateY(-50%)';
                break;
            case OverlayPosition.BOTTOM_LEFT:
                this.container.style.bottom = '30px';
                this.container.style.left = '30px';
                this.container.style.top = '';
                break;
            case OverlayPosition.BOTTOM_CENTER:
                this.container.style.bottom = '30px';
                this.container.style.left = '50%';
                this.container.style.transform = 'translateX(-50%)';
                this.container.style.top = '';
                break;
            case OverlayPosition.BOTTOM_RIGHT:
                this.container.style.bottom = '30px';
                this.container.style.right = '30px';
                this.container.style.top = '';
                this.container.style.left = '';
                break;
        }
    }
}