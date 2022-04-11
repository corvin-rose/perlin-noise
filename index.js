
const WIDTH = 400;
const HEIGHT = 400;

function PCanvas(id) {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    canvas.setSize = (w, h) => {
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }
    canvas.getCtx = () => {
        return ctx;
    }

    return canvas;
}

let random;
let pn;
document.addEventListener("DOMContentLoaded", function (event) {
    random = new PRNG(123124);
    pn = new Perlin(877887);
    drawNoise1D(new PCanvas('canvas').getCtx());
    drawNoise1DOctave(new PCanvas('canvas2').getCtx());
    drawNoise2D(new PCanvas('canvas3').getCtx());
    drawNoise2DOctave(new PCanvas('canvas4').getCtx());
});

function drawNoise1D(ctx) {
    let time = 0;
    let inc = 0.05;
    setInterval(() => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.beginPath();
        let xoff = time;
        for (let x = 0; x < WIDTH; x++) {
            let y1 = pn.noise(xoff) * HEIGHT;
            let y2 = pn.noise(xoff + inc) * HEIGHT;
            ctx.moveTo(x, y1);
            ctx.lineTo(x + 1, y2);
            xoff += inc;
        }
        ctx.stroke();
        ctx.font = "15px Arial";
        ctx.fillText("noise(x): " + pn.noise(Math.floor(xoff * 5) / 5).toPrecision(2) + "      x: " + Math.floor(xoff * 10) / 10, 5, HEIGHT - 5); 
        time += inc;
    }, 10);
}
function drawNoise1DOctave(ctx) {
    let xoff = 0;
    let inc = 0.02;
    ctx.beginPath();
    for (let x = 0; x < WIDTH; x++) {
        let y1 = pn.noiseOctave(xoff) * HEIGHT;
        let y2 = pn.noiseOctave(xoff + inc) * HEIGHT;
        ctx.moveTo(x, y1);
        ctx.lineTo(x + 1, y2);
        xoff += inc;
    }
    ctx.stroke();
}
function drawNoise2D(ctx) {
    let imgRef = ctx.createImageData(WIDTH, HEIGHT);
    let img = imgRef.data;
    let xoff = 0;
    let yoff = 0;
    let inc = 0.02;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let index = (x + y * WIDTH) * 4;
            let b = pn.noise2D(xoff, yoff) * 255;
            img[index + 0] = b;
            img[index + 1] = b;
            img[index + 2] = b;
            img[index + 3] = 255;
            xoff += inc;
        }
        xoff = 0;
        yoff += inc;
    }
    ctx.putImageData(imgRef, 0, 0);
}
function drawNoise2DOctave(ctx) {
    let imgRef = ctx.createImageData(WIDTH, HEIGHT);
    let img = imgRef.data;
    let xoff = 0;
    let yoff = 0;
    let inc = 0.02;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let index = (x + y * WIDTH) * 4;
            let b = pn.noise2DOctave(xoff, yoff) * 255;
            img[index + 0] = b;
            img[index + 1] = b;
            img[index + 2] = b;
            img[index + 3] = 255;
            xoff += inc;
        }
        xoff = 0;
        yoff += inc;
    }
    ctx.putImageData(imgRef, 0, 0);
}
