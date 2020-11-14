import { Logger } from "../logging/logger";

export default class StateManager {
    data: Map<string, any> = new Map<string, any>();

    constructor() {

    }

    commit<TType>(key: string, value: TType) {
        this.data.set(key, value);
    }

    get<TType>(key: string) {
        if (this.data.has(key)) {
            return <TType>this.data.get(key);
        }

        return null;
    }

    exists(key: string): boolean {
        return this.data.has(key);
    }

    delete(key: string): void {
        if (this.data.has(key)) {
            this.data.delete(key)
        }
    }
}