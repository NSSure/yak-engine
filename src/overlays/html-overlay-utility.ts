import Application from "../application";
import HtmlOverlay from "./html-overlay";

export default class HtmlOverlayUtility {
    /**
     * Iterates through each overlay and calls the sync method for each enabled overlay.
     * The sync method allows for the overlays template to be synced with the current state of the application.
     * 
     * @author NSSure
     * @since 11/8/2020
     */
    static syncOverlays(): void {
        if (Application.instance.configuration.htmlOverlays) {
            Application.instance.configuration.htmlOverlays.forEach((overlay: HtmlOverlay) => {
                if (overlay.isEnabled) {
                    overlay.sync();
                }
            });
        }
    }

    /**
     * Takes the registered overlays calls the init function for each overlay.
     * If the overlay is enabled it will be added to the DOM and have its content synced
     * on each iteration of the game loop.
     * 
     * @author NSSure
     * @since 11/8/2020
     */
    static initOverlays(): void {
        if (Application.instance.configuration.htmlOverlays) {
            Application.instance.configuration.htmlOverlays.forEach((overlay: HtmlOverlay) => overlay.init());
        }
    }
}