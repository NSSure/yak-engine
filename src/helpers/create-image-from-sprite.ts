import Sprite from "../graphics/sprite";

export default function createImageFromSprite(sprite: Sprite): HTMLImageElement {
    if (!sprite.imageData) {
        throw "Cannot convert sprite to image without any image data.";
    }

    let image = new Image();
    image.src = sprite.imageData;
    return image;
}