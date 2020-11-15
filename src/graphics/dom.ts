import { MouseQuadrant } from "../enums/MouseQuadrant";
import { Logger } from "../logging/logger";
import Point from "../primitives/Point";

export default class DOM {
    public mouseQuadrant: MouseQuadrant = MouseQuadrant.NONE;
    public mousePosition: Point = new Point(0, 0);

    /**
     * Default constructor. Bootstraps document events.
     */
    constructor() {
        this.bootstrapDocumentEvents();
    }

    /**
     * Configures events attached directly to the the document.
     * 
     * @author NSSure
     */
    bootstrapDocumentEvents(): void {
        document.addEventListener('mousemove', (event) => {
            Logger.info('i am still firing');
            // Track the current quadrant that the mouse is located at in relation to the document.
            this.mousePosition = new Point(event.clientX, event.clientY);
            this.determineMouseQuadrant(event.clientX, event.clientY);
        });
    }

    /**
     * Determines the current document quadrant that the mouse is in. The screen is split
     * into four sections start with 1 in the top left, 2 in the top right, 3 in the bottom
     * left, and 4 in the bottom right.
     * @param mouseX The x position of the mouse
     * @param mouseY The y position of the mouse
     * 
     * @author NSSure
     */
    determineMouseQuadrant(mouseX: number, mouseY: number): MouseQuadrant {
        // Determine mouse quadrant.
        let viewportCenterX = window.innerWidth / 2;
        let viewportCenterY = window.innerHeight / 2;

        if (mouseX < viewportCenterX && mouseY < viewportCenterY) {
            this.mouseQuadrant = MouseQuadrant.QUADRANT_ONE;
        }
        else if (mouseX > viewportCenterX && mouseY < viewportCenterY) {
            this.mouseQuadrant = MouseQuadrant.QUADRANT_TWO;
        }
        else if (mouseX < viewportCenterX && mouseY > viewportCenterY) {
            this.mouseQuadrant = MouseQuadrant.QUADRANT_THREE;
        }
        else {
            this.mouseQuadrant = MouseQuadrant.QUADRANT_FOUR;
        }

        return this.mouseQuadrant;
    }
}