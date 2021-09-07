var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
const sum = (a, b, f) => {
    let result = 0;
    for (let i = a; i < b; i++) {
        result += f(i);
    }
    return result;
};
const sumWithout = (a, b, c, f) => {
    let result = 0;
    for (let i = a; i < b; i++) {
        if (i !== c) {
            result += f(i);
        }
    }
    return result;
};
export class Simulator {
    constructor(masses, lengths, φ, framesPerSecond, stepsPerFrame, g) {
        this.masses = masses;
        this.lengths = lengths;
        this.φ = φ;
        this.framesPerSecond = framesPerSecond;
        this.stepsPerFrame = stepsPerFrame;
        this.g = g;
        this.ddφ = new Array(lengths.length).fill(0);
        this.dφ = new Array(lengths.length).fill(0);
    }
    simluate() {
        return __asyncGenerator(this, arguments, function* simluate_1() {
            while (true)
                yield yield __await(this.simulateFrame());
        });
    }
    simulateFrame() {
        const Δt = 1 / this.framesPerSecond / this.stepsPerFrame;
        for (let i = 0; i < this.stepsPerFrame; i++) {
            this.step(Δt);
        }
        return new Frame(this);
    }
    step(Δt) {
        this.calculateDdφ(Δt);
        this.calculateφ(Δt);
    }
    calculateφ(Δt) {
        const newDφ = [];
        for (let i = 0; i < this.ddφ.length; ++i) {
            newDφ[i] = this.dφ[i] + this.ddφ[i] * Δt;
        }
        newDφ.forEach((v, i) => this.dφ[i] = v);
        const newφ = [];
        for (let i = 0; i < this.dφ.length; ++i) {
            newφ[i] = this.φ[i] + this.dφ[i] * Δt;
        }
        newφ.forEach((v, i) => this.φ[i] = v);
    }
    calculateDdφ(Δt) {
        const [n, m, l, φ, dφ, g] = [this.lengths.length, this.masses, this.lengths, this.φ, this.dφ, this.g];
        const { sin, cos } = Math;
        const ddφ = [];
        for (let j = 0; j < n; j++) {
            ddφ[j] =
                (sum(0, n, (i) => m[i] * sumWithout(0, i + 1, j, (k) => l[k] * (sin(φ[k] - φ[j]) * Math.pow(dφ[k], 2)
                    - cos(φ[k] - φ[j]) * this.ddφ[k])))
                    - g * sin(φ[j]) * sum(0, n, (k) => m[k]))
                    / (l[j] * sum(j, n, (i) => m[i]));
        }
        this.ddφ = ddφ;
    }
    x(index) {
        var sum = 0;
        for (let i = 0; i <= index; i++) {
            sum += Math.sin(this.φ[i]) * this.lengths[i];
        }
        return sum;
    }
    y(index) {
        var sum = 0;
        for (let i = 0; i <= index; i++) {
            sum += Math.cos(this.φ[i]) * this.lengths[i];
        }
        return sum;
    }
    H() {
        const [n, m, l, φ, φD] = [this.lengths.length, this.masses, this.lengths, this.φ, this.dφ];
        const { sin, cos } = Math;
        return sum(0, n, (i) => m[i] * ((Math.pow(sum(0, i + 1, (k) => cos(φ[k]) * φD[k] * l[k]), 2) + Math.pow(sum(0, i + 1, (k) => sin(φ[k]) * φD[k] * l[k]), 2)) / 2 - this.g * sum(0, i + 1, (k) => cos(φ[k]) * l[k])));
    }
}
export class Frame {
    constructor(simulator) {
        this.simulator = simulator;
        this.pendulums = [];
        for (let i = 0; i < this.simulator.masses.length; ++i) {
            this.pendulums[i] = [this.simulator.x(i), this.simulator.y(i)];
        }
    }
}
//# sourceMappingURL=simulator.js.map