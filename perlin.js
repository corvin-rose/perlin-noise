
class PRNG {
    constructor(seed=0) {
        // Init Seed
        if (isNaN(seed)) seed = seed.split('').map((_,i) => seed.charCodeAt(i)).reduce((a,b)=>a+b);
        this._seed = seed % 2147483647;
        if (this._seed <= 0) this._seed += 2147483646;
        // Permutation table
        let tmp = new Array(256).fill().map(v => Math.floor(this.next() * 256));
        this.perm = new Array(512).fill().map((_,i) => tmp[i % 256]);
    }
    next() {
        let v = this._seed = this._seed * 16807 % 2147483647;
        return (v - 1) / 2147483646;
    }
}

class Perlin {
    constructor(seed=0) {
        this._random = new PRNG(seed);
        this._perm = this._random.perm;
    }
    // Noise 1D
    interpolate(xq, w0, w1){
        let sx = xq**3 * (xq * (xq * 6.0 - 15.0) + 10.0);
        return (1 - sx) * w0 + sx * w1;
    }
    noise(x) {
        let _x = x >= 0 ? x % 256 : 256 - Math.abs(x) % 256;
        let p = Math.floor(_x);
        let g0 = this._perm[p] / 256 * 2 - 1;
        let g1 = this._perm[p + 1] / 256 * 2 - 1;
        let xq = _x - p;
        let w0 = g0 * xq;
        let w1 = g1 * (xq - 1);
        let w = this.interpolate(xq, w0, w1);
        return 0.5 + w;
    }
    noiseOctave(x, oct=8, pers=0.5) {
        let sum = 0;
        let f = 1;
        let a = 1;
        let norm = 0;
        for (let i = 0; i < oct; i++) {
            sum += a * this.noise(f * x);
            norm += a;
            f *= 2;
            a *= pers;
        }
        return sum / norm;
    }
    // Noise 2D
    interpolate2D(xq, yq, w00, w10, w01, w11){
        let s = (x) => x**3 * (x * (x * 6.0 - 15.0) + 10.0);
        let w0 = (1 - s(xq)) * w00 + s(xq) * w10;
        let w1 = (1 - s(xq)) * w01 + s(xq) * w11;
        return (1 - s(yq)) * w0 + s(yq) * w1;
    }
    grad2D(g, x, y) {
        switch (g % 4) {
            case 0: return x + y;
            case 1: return -x + y;
            case 2: return x -y;
            case 3: return -x -y;
        }
    }
    noise2D(x, y) {
        let _x = x >= 0 ? x % 256 : 256 - Math.abs(x) % 256;
        let _y = y >= 0 ? y % 256 : 256 - Math.abs(y) % 256;
        let px = Math.floor(_x);
        let py = Math.floor(_y);
        let g00 = this._perm[this._perm[px] + py];
        let g10 = this._perm[this._perm[px + 1] + py];
        let g01 = this._perm[this._perm[px] + py + 1];
        let g11 = this._perm[this._perm[px + 1] + py + 1];
        let xq = _x - px;
        let yq = _y - py;
        let w00 = this.grad2D(g00, xq, yq);
        let w10 = this.grad2D(g10, xq - 1, yq);
        let w01 = this.grad2D(g01, xq, yq - 1);
        let w11 = this.grad2D(g11, xq - 1, yq - 1);
        let w = this.interpolate2D(xq, yq, w00, w10, w01, w11);
        return 0.5 + w; 
    }
    noise2DOctave(x, y, oct=8, pers=0.5) {
        let sum = 0;
        let f = 1;
        let a = 1;
        let norm = 0;
        for (let i = 0; i < oct; i++) {
            sum += a * this.noise2D(f * x, f * y);
            norm += a;
            f *= 2;
            a *= pers;
        }
        return sum / norm;
    }
}
