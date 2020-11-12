import Game from './game';
import { Logger } from './logging/logger';

export default class Application {
    static instance: Game;

    get instance(): Game { 
        return Application.instance;
    }

    static contextMenuTemplate: string = 
    `
    <div class="engine-context-menu">
        <ul>
            <li>Move</li>
            <li>Duplicate</li>
            <li>Move up</li>
            <li>Move down</li>
            <li>Send to back</li>
            <li>Send to front</li>
            <li>Flip x</li>
            <li>Flip y</li>
            <li>Delete</li>
        </ul>
    </div>
    `;

    public constructor() {
        // Create new game instance on the application.
        Application.instance = new Game();
    }

    initialize(): void {
        Application.instance.start();
    }
}