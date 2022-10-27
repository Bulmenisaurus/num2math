declare var MathJax: any;

import * as representations from './representations';
import { ConvertOptions, operation } from './utils';
import { decompose, conditionalDecomposition } from './decompositions';
import * as download_png from './download-png';

const convert = (number: number, options: ConvertOptions) => {
    // Validating input
    if (isNaN(number) || number < 0) {
        return;
    }

    /* Need to add another slash to latex strings to prevent slash escape */

    // List of functions that generate LaTeX math expressions
    // Functions are chosen randomly
    let possible_options: operation[] = [];

    if (options.eulersIdentity) {
        possible_options.push(representations.eulersIdentity);
    }
    if (options.exponentialLimits) {
        possible_options.push(n => representations.limitNaturalLog(n, options.numberTheory));
        possible_options.push(n => representations.limitExponential(n, options.numberTheory));
    }
    if (options.polynomialLimits) {
        possible_options.push(representations.limDiffTwoSquares);
        possible_options.push(representations.limitPolynomial);
    }

    if (options.geometricSeries) {
        possible_options.push(n =>
            representations.infiniteGeometricSeries(n, options.numberTheory)
        );
    }

    // decorate each operation with a function that checks if the input is of a certain form, and if it is it overrides the decorated function's usual result with it's own.
    possible_options = possible_options.map(f => {
        return conditionalDecomposition(f, options);
    });

    let input = decompose(number, possible_options, options);

    //  Disable the display and render buttons until MathJax is done
    var display = <HTMLInputElement>document.getElementById('display');
    var button = <HTMLButtonElement>document.getElementById('render');
    button.disabled = display.disabled = true;
    let downloadBtn = <HTMLButtonElement>document.getElementById('download-img');

    //  Clear the old output

    let output = document.getElementById('output')!;
    output.innerHTML = '';

    //  Reset the tex labels (and automatic equation numbers, though there aren't any here).
    //  Get the conversion options (metrics and display settings)
    //  Convert the input to CommonHTML output and use a promise to wait for it to be ready
    //    (in case an extension needs to be loaded dynamically).
    MathJax.texReset();
    var mathJaxOptions = MathJax.getMetricsFor(output);
    mathJaxOptions.display = display.checked;
    MathJax.tex2svgPromise(input, mathJaxOptions)
        .then(function(node: any) {
            //  The promise returns the typeset node, which we add to the output
            //  Then update the document to include the adjusted CSS for the
            //    content of the new equation.
            output.appendChild(node);
            MathJax.startup.document.clear();
            MathJax.startup.document.updateDocument();
            // Display download button
            downloadBtn.style.display = 'block';
        })
        .catch(function(err: Error) {
            //  If there was an error, put the message into the output instead
            output
                .appendChild(document.createElement('pre'))
                .appendChild(document.createTextNode(err.message));
        })
        .then(function() {
            //  Error or not, re-enable the display and render buttons
            button.disabled = display.disabled = false;
        });
};
const main = () => {
    const form = document.getElementById('form') as HTMLFormElement;
    const number = document.getElementById('input') as HTMLInputElement;

    const gammaFunction = document.getElementById('gamma-function') as HTMLInputElement;
    const eulersIdentity = document.getElementById('eulers-identity') as HTMLInputElement;
    const exponentialLimits = document.getElementById('limits-exponential') as HTMLInputElement;
    const polynomialLimits = document.getElementById('limits-polynomial') as HTMLInputElement;
    const numberTheory = document.getElementById('number-theory') as HTMLInputElement;
    const geometricSeries = document.getElementById('geometric-series') as HTMLInputElement;
    const continuedFractions = document.getElementById('continued-fractions') as HTMLInputElement;

    form.addEventListener('submit', event => {
        event.preventDefault();

        convert(parseInt(number.value), {
            gammaFunction: gammaFunction.checked,
            eulersIdentity: eulersIdentity.checked,
            exponentialLimits: exponentialLimits.checked,
            polynomialLimits: polynomialLimits.checked,
            numberTheory: numberTheory.checked,
            geometricSeries: geometricSeries.checked,
            continuedFractions: continuedFractions.checked,
        });
    });

    download_png.main();
};

main();
