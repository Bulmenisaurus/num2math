declare var canvg: any;

let downloadBtn = <HTMLButtonElement>document.getElementById('download-img');

downloadBtn.addEventListener('click', downloadPNG);
// Initiate download of blob
function download(filename: string, blob: Blob) {
    //@ts-ignore
    if (window.navigator.msSaveOrOpenBlob) {
        //@ts-ignore
        window.navigator.msSaveBlob(blob, filename);
    } else {
        // Create and link and click on it to automatically download image
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        elem.click();
    }
}

function downloadPNG() {
    // Get the svg from the page
    var svg = document.querySelector('svg')!;

    // Get the current number
    var number = (<HTMLInputElement>document.getElementById('input')).value;

    // Increase the SVG's width and height to produce a bigger image
    let w = parseInt(svg.getAttribute('width')!) * 3;
    let h = parseInt(svg.getAttribute('height')!) * 3;
    ``;
    // Clone the svg before changing width and height so that it does not affect the svg on the page
    svg = <SVGSVGElement>svg.cloneNode(true);
    svg.setAttribute('width', `${w}ex`);
    svg.setAttribute('height', `${h}ex`);

    // Convert SVG to string data
    var data = new XMLSerializer().serializeToString(svg);

    var canvas = document.createElement('canvas');

    canvg(canvas, data, {
        renderCallback: function() {
            // Convert SVG data to PNG image
            canvas.toBlob(function(blob) {
                if (blob === null) {
                    throw new Error('Failed to serialize canvas to blob');
                }
                download(`complicated-equation-that-equals-${number}.png`, blob);
            });
        },
    });
}
