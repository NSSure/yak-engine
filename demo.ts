import Application from "./src/application";
import { Logger } from "./src/logging/logger";
import EngineStatsOverlay from "./src/overlays/engine-stats-overlay";
import UIFragmentsOverlay from "./src/overlays/ui-fragments-overlay";
import SpriteEditorOverlay from "./src/overlays/sprite-editor-overlay/sprite-editor-overlay";
import Button from "./src/ui/button";
import HoverState from "./src/ui/states/hover-state";
import LayerEditorOverlay from "./src/overlays/layer-editor-overlay/layer-editor-overlay";

export default class Demo extends Application {
    constructor() {
        super();

        // Make any modifications to the game configuration before initialize is called.
        this.instance.configuration.htmlOverlays.push(new SpriteEditorOverlay());
        this.instance.configuration.htmlOverlays.push(new LayerEditorOverlay());
        this.instance.configuration.htmlOverlays.push(new EngineStatsOverlay());
        this.instance.configuration.htmlOverlays.push(new UIFragmentsOverlay());
        
        // let button = new Button((this.instance.graphics.canvas.getCanvasWidth() / 2) - 100, this.instance.graphics.canvas.getCanvasHeight() / 2, 200, 50);

        // button.onHover = () => {
        //     Logger.debug(`Entity: ${button.id} is being hovered.`);
        // }
    
        // button.onClick = () => {
        //     Logger.debug(`Entity: ${button.id} was just clicked.`);
        // }
        
        // button.text = 'Start game';
        // button.backgroundColor = '#282828';
        // button.hoverState = new HoverState();
        // button.hoverState.backgroundColor = '#111111';

        // this.instance.graphics.canvas.fragments.uiFragments.push(button);

        // Initialize the application after your startup logic.
        this.initialize();
    }
}

let demo = new Demo();