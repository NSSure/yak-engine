import Application from "../application";
import HtmlOverlay from "./html-overlay";

const fieldSorter = (fields) => (a, b) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o=o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
}).reduce((p, n) => p ? p : n, 0);

export default class HtmlOverlayUtility {
    // TODO: Should this stay in here.
    public static countMap: any = {
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0
    };

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
            let t = Application.instance.configuration.htmlOverlays.sort(fieldSorter(['overlayPosition', 'order']));

            t.forEach((overlay: HtmlOverlay) => {
                HtmlOverlayUtility.countMap[overlay.overlayPosition]++;
                overlay.init();
            });
        }
    }
}