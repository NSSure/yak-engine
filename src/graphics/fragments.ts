import Primitive from "../primitives/primitive";
import UIBase from "../ui/ui-base";

/**
 * Contains the fragments to be rendered to the canvas on each iteration
 * of the game loop.
 * 
 * @author NSSure
 * @since 11/9/2020
 */
export default class Fragments {
    uiFragments: Array<UIBase> = new Array();
    primitiveFragments: Array<Primitive> = new Array();
}