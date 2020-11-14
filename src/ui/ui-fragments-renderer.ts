import Application from "../application";
import { uiConstants } from "../constants";
import Canvas from "../graphics/canvas";
import isCoordinateContained from "../helpers/is-coordinate-contained";
import Point from "../primitives/Point";
import Button from "./button";
import UIFragment from "./ui-base";

export default class UIFragmentsRenderer {
    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    public run(): void {
        this.draw();
        this.interactives();
    }

    private draw(): void {
        this.canvas.fragments.uiFragments.forEach((uiFragment: UIFragment) => {
            if (uiFragment.isEnabled) {
                this.canvas.context.beginPath();

                if (uiFragment.isHovered && uiFragment.hoverState) {
                    this.canvas.context.fillStyle = <string>uiFragment.hoverState.backgroundColor;
                }
                else {
                    this.canvas.context.fillStyle = uiFragment.backgroundColor;
                }

                this.canvas.context.fillRect(uiFragment.transform.x, uiFragment.transform.y, uiFragment.transform.width, uiFragment.transform.height);
                this.canvas.context.closePath(); 

                switch(uiFragment.constructor.name) {
                    case uiConstants.entityName.button:
                        this.canvas.context.font = '16px Arial';
                        this.canvas.context.fillStyle = 'white';
                        this.canvas.context.textAlign = 'center';
                        this.canvas.context.textBaseline = 'middle';
                        let x = uiFragment.transform.x + (uiFragment.transform.width / 2);
                        let y = uiFragment.transform.y + (uiFragment.transform.height / 2);
                        this.canvas.context.fillText((<Button>uiFragment).text, x, y);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    private interactives(): void {
        this.canvas.fragments.uiFragments.forEach((uiFragment: UIFragment) => {
            // If the fragment is not interactive simply check the position check.
            if (uiFragment.isInteractive) {
                if (isCoordinateContained(this.canvas.mousePosition, uiFragment.transform)) {
                    uiFragment.isHovered = true;

                    if (uiFragment.onHover) {
                        uiFragment.onHover();
                    }
                }
                else if (uiFragment.isHovered) {
                    uiFragment.isHovered = false;
                }
            }
        });
    }

    public isHoveredFragmentClicked(point: Point): UIFragment {
        let uiFragment = <UIFragment>Application.instance.graphics.canvas.fragments.uiFragments.find((uiFragment) => uiFragment.isHovered);

        if (uiFragment && uiFragment.onClick) {
            uiFragment.onClick();
        }

        return uiFragment;
    }
}