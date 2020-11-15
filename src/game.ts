import Configuration from "./configuration";
import Graphics from "./graphics/graphics";
import HtmlOverlayUtility from "./overlays/html-overlay-utility";
import StateManager from "./state/state-manager";
import Time from "./time";

export default class Game {
    configuration: Configuration = new Configuration();
    graphics: Graphics = new Graphics();
    stateManager: StateManager = new StateManager();
    isLoading: boolean = false;

    /**
     * Actually begins the game instance. Processes the configuration.
     * 
     * @author NSSure
     * @since 11/8/2020
     */
    start(): void {
        // Call necessary utility functions for startup.
        HtmlOverlayUtility.initOverlays();

        // Get tilesets.
        fetch('./maps/sample-layers.json').then((response) => response.json()).then((map) => {
            this.graphics.canvas.layers = map;
            this.graphics.canvas.editorRenderer.currentLayer = this.graphics.canvas.layers[0];
            this.isLoading = false;
        });

        while(this.isLoading) {
            continue;
        }

        // Initialize the first iteration of the gameloop.
        window.requestAnimationFrame((time: number) => this.gameLoop(time));
    }

    /**
     * The main game loop all the rendering logic will be called from within this function.
     * 
     * @param time The time between the animation frames.
     * 
     * @author NSSure
     * @since 11/8/2020
     */
    gameLoop(time: number) {
        Time.calculateDeltaTime(time);
        
        // Syncs development overlays with the current state of the application.
        HtmlOverlayUtility.syncOverlays();
        
        this.graphics.canvas.draw();

        // Request a new animation frame for the game loop.
        window.requestAnimationFrame((time: number) => this.gameLoop(time));
    }
}