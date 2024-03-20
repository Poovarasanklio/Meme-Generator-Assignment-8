"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Selecting DOM elements
const imageInput = document.querySelector('#image-input');
const topText = document.querySelector('#topText');
const bottomText = document.querySelector('#bottomText');
const canvasMeme = document.querySelector('#meme');
const fontFamilySelect = document.getElementById('font-family-select');
const fontSizeRangeElement = document.getElementById('font-size-range');
const fontColorInput = document.getElementById('font-color-input');
const strokeCheckbox = document.getElementById('strokeCheckbox');
let image;
// Function to update meme from canvas element
function updateMeme() {
    const topTxt = topText.value;
    const bottomTxt = bottomText.value;
    const fontFamily = fontFamilySelect.value;
    const fontSize = parseInt(fontSizeRangeElement.value);
    const fontColor = fontColorInput.value;
    const ctx = canvasMeme.getContext('2d');
    if (!ctx)
        return;
    // Clear canvas
    const width = image.width;
    const height = image.height;
    canvasMeme.width = width;
    canvasMeme.height = height;
    ctx.clearRect(0, 0, width, height);
    // Draw image
    if (image) {
        ctx.drawImage(image, 0, 0); //canvasMeme.width, canvasMeme.height
    }
    // Set text styles
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = strokeCheckbox.checked ? 'black' : 'transparent';
    ctx.lineWidth = Math.floor(fontSize / 15);
    ctx.fillStyle = fontColor;
    // Draw top text
    ctx.strokeText(topTxt, canvasMeme.width / 2, 12);
    ctx.fillText(topTxt, canvasMeme.width / 2, 12);
    // Draw bottom text
    ctx.strokeText(bottomTxt, canvasMeme.width / 2, canvasMeme.height - fontSize - 12);
    ctx.fillText(bottomTxt, canvasMeme.width / 2, canvasMeme.height - fontSize - 12);
}
// Event listeners for getting image as input
imageInput.addEventListener('change', () => {
    var _a;
    const file = (_a = imageInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = () => {
        image = new Image();
        image.src = reader.result;
        image.onload = () => {
            updateMeme();
        };
    };
    reader.readAsDataURL(file);
});
// Event listeners for getting as text,value from input element
topText.addEventListener('input', updateMeme);
bottomText.addEventListener('input', updateMeme);
fontFamilySelect.addEventListener('change', updateMeme);
fontSizeRangeElement.addEventListener('input', updateMeme);
fontColorInput.addEventListener('input', updateMeme);
strokeCheckbox.addEventListener('change', updateMeme);
// Function to download image
function downloadImage() {
    if (image != null) {
        const dataUrl = canvasMeme.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'meme.png';
        link.click();
    }
    else {
        alert("Please upload image..");
    }
}
//  Function to share image to other application
function shareImage() {
    return __awaiter(this, void 0, void 0, function* () {
        if (image != null) {
            if (!navigator.share) {
                alert("Web Share API not supported in this browser");
                return;
            }
            try {
                const dataUrl = canvasMeme.toDataURL('image/png');
                // Create a blob from the data URL
                const blob = yield fetch(dataUrl).then(res => res.blob());
                // Create a file from the blob
                const file = new File([blob], 'meme.png', { type: 'image/png' });
                const shareData = {
                    files: [file],
                    title: 'Meme',
                    text: 'Check out this meme!',
                };
                yield navigator.share(shareData);
            }
            catch (error) {
                console.error('Error sharing:', error);
                // Handle error gracefully
            }
        }
        else {
            alert("Please upload image..");
        }
    });
}
