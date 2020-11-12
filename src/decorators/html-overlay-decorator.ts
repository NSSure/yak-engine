class HtmlOverlayConfig {
    name: string;
    templateUrl?: string;
    template?: string;
}

function HtmlOverlayDecorator(htmlOverlayConfig: HtmlOverlayConfig) {
    return function (constructor: Function) {
        constructor.prototype.name = htmlOverlayConfig.name;
        constructor.prototype.templateUrl = htmlOverlayConfig.templateUrl;
        constructor.prototype.template = htmlOverlayConfig.template;
    }
}

export { HtmlOverlayConfig, HtmlOverlayDecorator };