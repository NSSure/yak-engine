import Configuration from "./configuration";
import HtmlOverlayUtility from "./editor/html-overlay-utility";
import Camera from "./graphics/camera";
import Graphics from "./graphics/graphics";
import { Logger } from "./logging/logger";
import Transform from "./primitives/transform";
import StateManager from "./state/state-manager";
import Time from "./time";

export default class Game {
    configuration: Configuration = new Configuration();
    graphics: Graphics = new Graphics();
    stateManager: StateManager = new StateManager();
    isLoading: boolean = false;
    camera: Camera = new Camera();

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
        // fetch('./maps/sample-layers.json').then((response) => response.json()).then((map) => {
        //     // this.graphics.canvas.layers = map;
        //     // this.graphics.canvas.editorRenderer.currentLayer = this.graphics.canvas.layers[0];
        //     this.isLoading = false;
        // });

        // while(this.isLoading) {
        //     continue;
        // }

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                // move camera
                this.camera.viewport.x += 1 * 5 * Time.deltaTime;
                this.camera.viewport.y += 1 * 5 * Time.deltaTime;
                
                // clamp values
                // this.camera.viewport.x = Math.max(0, Math.min(this.camera.viewport.x, this.maxX));
                // this.camera.viewport.y = Math.max(0, Math.min(this.camera.viewport.y, this.maxY));
            }
        });

        this.camera.viewport = new Transform(
            0,
            0,
            this.graphics.canvas.getCanvasWidth(),
            this.graphics.canvas.getCanvasHeight()
        )

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