import Entity from "../entity";

export default class Layer extends Entity {
    name: string;
    order: number;
    enabled: boolean;
}