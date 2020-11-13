export default class Transform {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Returns a new empty transform object. Meaning the x, y, width, and height
     * values are all zero.
     * 
     * @author NSSure
     * @since 11/12/2020
     */
    static get empty(): Transform {
        return new Transform(0, 0, 0, 0);
    }
}