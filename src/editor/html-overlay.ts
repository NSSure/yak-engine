import Application from "../application";
import Entity from "../entity";
import { MouseQuadrant } from "../enums/MouseQuadrant";
import { Logger } from "../logging/logger";
import HtmlOverlayUtility from "./html-overlay-utility";
import { OverlayPosition } from "./overlay-position";

export default abstract class HtmlOverlay extends Entity {
    public container: HTMLDivElement = <HTMLDivElement>document.createElement('div');
    public header: HTMLDivElement = <HTMLDivElement>document.createElement('div');
    public content: HTMLDivElement = <HTMLDivElement>document.createElement('div');

    public isInSnapZone: boolean = false;
    public isInitialized: boolean = false;

    public template: string;

    abstract title: string = '';
    abstract order: number = 0;
    abstract isEnabled: boolean = false;
    abstract isMoveable: boolean = false;
    abstract overlayPosition: OverlayPosition;

    public static topLeftContainer: HTMLDivElement = document.querySelector('.top-left-container');
    public static topRightContainer: HTMLDivElement = document.querySelector('.top-right-container');
    public static bottomLeftContainer: HTMLDivElement = document.querySelector('.bottom-left-container');
    public static bottomRightContainer: HTMLDivElement = document.querySelector('.bottom-right-container');

    public abstract bootstrap(): void;
    public abstract sync(): void;

    constructor() {
        super();
        Logger.data(HtmlOverlay.topRightContainer);
    }

    public init(): void {
        if (!this.isEnabled) {
            return;
        }

        if (this.constructor.prototype.templateUrl) {
            fetch(this.constructor.prototype.templateUrl).then(response => response.text()).then(templateMarkup => {
                this.template = templateMarkup;
                this._init();
            }).catch((error) => {
                Logger.error(error);
            });
        }
        else if (this.constructor.prototype.template) {
            this.template = this.constructor.prototype.template;
            this._init();
        }
        else {
            throw "You must provide either a literal template or a template url.";
        }
    }

    private _init(): void {
        this.container.classList.add('overlay-container');
        this.container.id = this.id;
        this.container.setAttribute('data-order', this.order.toString());

        this.header.classList.add('overlay-header');
        let title = document.createElement('span');
        title.innerText = this.title;
        this.header.appendChild(title);

        this.container.classList.add(this.constructor.prototype.name);
        this.content.classList.add('overlay-content');
        this.content.innerHTML = this.template;

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

        this.processOverlayPosition();
        this.bootstrap();

        this.isInitialized = true;
    }

    private processOverlayPosition(): void {
        // TODO: Clean this up this can be streamlined.
        switch (this.overlayPosition) {
            case OverlayPosition.TOP_LEFT:
                HtmlOverlay.topLeftContainer.appendChild(this.container);
                break;
            case OverlayPosition.TOP_CENTER:
                
                break;
            case OverlayPosition.TOP_RIGHT:
                if (HtmlOverlay.topRightContainer.children.length !== 0) {
                    HtmlOverlay.topRightContainer.childNodes.forEach((child: HTMLDivElement) => {
                        if (this.order < parseInt(child.dataset.order)) {
                            HtmlOverlay.topRightContainer.insertBefore(this.container, child);
                        }
                        else {
                            HtmlOverlay.topRightContainer.appendChild(this.container);
                        }
                    });
                }
                else {
                    HtmlOverlay.topRightContainer.appendChild(this.container);
                }

                break;
            case OverlayPosition.CENTER_LEFT:
                
                break;
            case OverlayPosition.CENTER:
                
                break;
            case OverlayPosition.CENTER_RIGHT:
                
                break;
            case OverlayPosition.BOTTOM_LEFT:
                HtmlOverlay.bottomLeftContainer.appendChild(this.container);
                break;
            case OverlayPosition.BOTTOM_CENTER:
                
                break;
            case OverlayPosition.BOTTOM_RIGHT:
                HtmlOverlay.bottomRightContainer.appendChild(this.container);
                break;
        }
    }
}