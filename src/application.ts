import Game from './game';

export default class Application {
    static instance: Game;

    get instance(): Game { 
        return Application.instance;
    }

    public constructor() {
        // Create new game instance on the application.
        Application.instance = new Game();
    }

    initialize(): void {
        Application.instance.start();
    }
}