import HtmlOverlay from "./overlays/html-overlay";

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
}