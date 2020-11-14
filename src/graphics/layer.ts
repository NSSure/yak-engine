import Entity from "../entity";
import Sprite from "./sprite";

export default class Layer extends Entity {
    name: string;
    enabled: boolean = true;
    sprites: Array<Sprite> = new Array();

    constructor(name: string) {
        super();
        this.name = name;
    }
}