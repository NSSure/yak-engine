import Primitive from "../primitives/primitive";
import UIFragment from "../ui/ui-base";
import Sprite from "./sprite";

/**
 * Contains the fragments to be rendered to the canvas on each iteration
 * of the game loop.
 * 
 * @author NSSure
 * @since 11/9/2020
 */
export default class Fragments {
    uiFragments: Array<UIFragment> = new Array();
    primitiveFragments: Array<Primitive> = new Array();
    spriteFragments: Array<Sprite> = new Array();
}