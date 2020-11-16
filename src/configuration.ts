import HtmlOverlay from "./editor/html-overlay";

/**
 * Contains configuration options for the game instance.
 * 
 * @author NSSure
 * @since 11/8/2020
 */
export default class Configuration {
    /**
     * The title of the web page.
     */
    title: string = 'Yak Engine Application';

    /**
     * The overlays to be registered if they are enabled when the overlays are initialized.
     */
    htmlOverlays: Array<HtmlOverlay> = new Array();

    /**
     * The background fill that immediately fill the canvas area after the clearCanvas method to called in the draw method.
     */
    canvasFill: string = '#09161D'

    /**
     * The color of the grid lines displayed in the editor layer.
     */
    editorGridFill: string = '#686868';

    /**
     * The thickness of the individual editor grid lines.
     */
    editorGridThickness: number = 0.5;

    /**
     * Loads a default tilset into the sprite editor. For development purposes.
     */
    defaultTilesetPath: string = '/images/[Base]BaseChip_pipo.png';

    /**
     * Default size of the squares of the canvas.
     */
    gridSquareSize: number = 32;

    /**
     * When in selection mode this is the fill color of the selected area.
     */
    selectionTransformFill: string = 'rgba(252,248,227, 0.7)';

    /**
     * Global alpha of 0.5;
     */
    highlightFill: string = '#007ACC';
}