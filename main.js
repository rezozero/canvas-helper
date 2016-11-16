/**
 * Copyright Rezo Zero 2016
 *
 *
 *
 * @file main.js
 * @copyright Rezo Zero 2016
 * @author Ambroise Maupate
 */
import {ExampleCanvas} from "./src/example";


(function() {
    let canvas = document.getElementById('canvas');

    const example = new ExampleCanvas(canvas, {
        width: window.innerWidth,
        height: window.innerHeight
    });

    console.log(example.getPixelRatio(example.ctx));
})();