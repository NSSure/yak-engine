export default class Time {
    public static lastTimestamp: number = performance.now();
    public static deltaTime: number;
    public static fps: number;

    public static calculateDeltaTime(time: number): void {
        let diff = time - this.lastTimestamp;

        Time.deltaTime = (diff / 1000);

        this.fps = 1 / Time.deltaTime;
        this.lastTimestamp = time;
    }
}