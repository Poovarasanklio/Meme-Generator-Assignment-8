type InpElmt = HTMLInputElement;


// Selecting DOM elements
const imageInput = document.querySelector('#image-input') as InpElmt;
const topText = document.querySelector('#topText') as InpElmt;
const bottomText = document.querySelector('#bottomText') as InpElmt;
const canvasMeme = document.querySelector('#meme') as HTMLCanvasElement;
const fontFamilySelect = document.getElementById('font-family-select') as HTMLSelectElement;
const fontSizeRangeElement = document.getElementById('font-size-range') as InpElmt;
const fontColorInput = document.getElementById('font-color-input') as InpElmt;
const strokeCheckbox = document.getElementById('strokeCheckbox') as InpElmt;

let image: HTMLImageElement;

// Function to update meme from canvas element
function updateMeme():void {
  const topTxt: string = topText.value;
  const bottomTxt: string = bottomText.value;
  const fontFamily: string = fontFamilySelect.value;
  const fontSize: number = parseInt(fontSizeRangeElement.value);
  const fontColor = fontColorInput.value;

  const ctx = canvasMeme.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  const width = image.width;
  const height = image.height;
  canvasMeme.width = width;
  canvasMeme.height = height;

  ctx.clearRect(0, 0, width, height);

  // Draw image
  if (image) {
    ctx.drawImage(image, 0, 0);  //canvasMeme.width, canvasMeme.height
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
  const file = imageInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    image = new Image();
    image.src = reader.result as string;
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
function downloadImage(): void {
  if (image != null) {
    const dataUrl = canvasMeme.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'meme.png';
    link.click();
  } else {
    alert("Please upload image..")
  }
}

//  Function to share image to other application
async function shareImage (): Promise <void> {
  if (image != null) {
    if (!navigator.share) {
      alert("Web Share API not supported in this browser");
      return;
    }
    try {
      const dataUrl = canvasMeme.toDataURL('image/png');
      // Create a blob from the data URL
      const blob = await fetch(dataUrl).then(res => res.blob());
      // Create a file from the blob
      const file = new File([blob], 'meme.png', { type: 'image/png' });
      const shareData: ShareData = {
        files: [file],
        title: 'Meme',
        text: 'Check out this meme!',
      };

      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing:', error);
      // Handle error gracefully
    }
  } else {
    alert("Please upload image..")
  }
}
 
 