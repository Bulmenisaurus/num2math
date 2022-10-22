/**
 * Converts the MathJax SVG (TODO: this code produces the error if the MathJax is html) to a png,
 * by serializing the svg into a data url and drawing to the canvas, where it can than be serialized
 * into a png.
 */

let downloadBtn = <HTMLButtonElement>document.getElementById('download-img');

// Initiate download of blob
const download = (filename: string, blob: Blob) => {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    elem.click();
};

const downloadPNG = () => {
    // Get the svg from the page
    var svg = document.querySelector('svg')!;

    // Get the current number
    var number = (<HTMLInputElement>document.getElementById('input')).value;

    // Increase the SVG's width and height to produce a bigger image
    let w = parseInt(svg.getAttribute('width')!);
    let h = parseInt(svg.getAttribute('height')!);

    // Convert SVG to string data
    const data = new XMLSerializer().serializeToString(svg);

    const svgDataUrl = `data:image/svg+xml;base64,${btoa(data)}`;

    const canvas = document.createElement('canvas');
    // upscale height to at least 800px
    let scaleFactor = Math.max(2, 800 / h);
    canvas.width = w * scaleFactor;
    canvas.height = h * scaleFactor;

    console.log({ w: canvas.width, h: canvas.height });
    const ctx = canvas.getContext('2d')!;

    const svgDataImage = new Image();
    svgDataImage.onload = () => {
        ctx.drawImage(svgDataImage, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
            if (blob === null) {
                throw new Error('Failed to serialize canvas to blob');
            }
            download(`complicated-expression-that-equals-${number}`, blob);
        });
    };

    svgDataImage.src = svgDataUrl;
};

const main = () => {
    downloadBtn.addEventListener('click', downloadPNG);
};
export { main };
