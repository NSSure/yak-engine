import Entity from "../entity";
import Sprite from "./sprite";

export default class Layer extends Entity {
    name: string;
    enabled: boolean = true;
    locked: boolean = false;
    sprites: Array<Sprite> = new Array();

    constructor(name: string) {
        super();
        this.name = name;
    }
}