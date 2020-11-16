import Application from "./src/application";
import EngineStatsOverlay from "./src/editor/engine-stats-overlay";
import LayerEditorOverlay from "./src/editor/panes/layer-editor-overlay/layer-editor-overlay";
import SpriteEditorOverlay from "./src/editor/panes/sprite-editor-overlay/sprite-editor-overlay";
import ToolbarRibbonOverlay from "./src/editor/panes/toolbar-ribbon-overlay/toolbar-ribbon-overlay";
import FragmentsOverlay from "./src/editor/ui-fragments-overlay";

export default class Demo extends Application {
    constructor() {
        super();

        // Make any modifications to the game configuration before initialize is called.
        this.instance.configuration.htmlOverlays.push(new SpriteEditorOverlay());
        this.instance.configuration.htmlOverlays.push(new ToolbarRibbonOverlay());
        this.instance.configuration.htmlOverlays.push(new EngineStatsOverlay());
        this.instance.configuration.htmlOverlays.push(new LayerEditorOverlay());
        this.instance.configuration.htmlOverlays.push(new FragmentsOverlay());

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