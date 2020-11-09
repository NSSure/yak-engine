import Collider from "./collision/collider";

export default class Physics {
    public static GRAVITATIONAL_CONSTANT: number = 9.8;
    public static colliders: Array<Collider> = new Array();
}