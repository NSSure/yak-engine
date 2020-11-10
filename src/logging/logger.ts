enum LogThreshold {
    NONE = 0,
    DEBUG = 1,
    INFO = 2,
    ERROR = 3,
    CRITICAL = 4
}

class Logger {
    static threshold: LogThreshold = LogThreshold.DEBUG;

    static debug(msg: string): void {
        if (this.threshold != LogThreshold.DEBUG) {
            return;
        }

        console.log(`[DEBUG]: ${msg}`);
    }

    static info(msg: string): void {
        if (this.threshold > LogThreshold.INFO) {
            return;
        }

        console.info(`[INFO]: ${msg}`);
    }

    static error(msg: string): void {
        if (this.threshold > LogThreshold.ERROR) {
            return;
        }

        console.error(`[ERROR]: ${msg}`);
    }

    static critical(msg: string): void {
        if (this.threshold > LogThreshold.CRITICAL) {
            return;
        }

        console.error(`[CRITICAL]: ${msg}`);
    }

    static data(data: any): void {
        if (this.threshold < LogThreshold.DEBUG) {
            return;
        }

        console.log(data);
    }
}

export { Logger };