const sum = (a: number, b: number, f: (x: number) => number) => {
    let result = 0;
    for (let i = a; i < b; i++) {
        result += f(i);
    }
    return result;
}

const sumWithout = (a: number, b: number, c: number, f: (x: number) => number) => {
    let result = 0;
    for (let i = a; i < b; i++) {
        if (i !== c) {
            result += f(i);
        }
    }
    return result;
}
export class Simulator {
    dφ: Array<number>;
    ddφ: Array<number>;
    constructor(public readonly masses: Array<number>, public readonly lengths: Array<number>, public φ: Array<number>, public framesPerSecond: number, public stepsPerFrame: number, public g: number) {
        this.ddφ = new Array(lengths.length).fill(0);
        this.dφ = new Array(lengths.length).fill(0);
    }
    async* simluate(): AsyncIterator<Frame> {
        while (true) yield this.simulateFrame();
    }
    simulateFrame(): Frame {
        const Δt = 1 / this.framesPerSecond / this.stepsPerFrame;
        for (let i = 0; i < this.stepsPerFrame; i++) {
            this.step(Δt);
        }
        return new Frame(this);
    }
    step(Δt: number): void {
        this.calculateDdφ(Δt);
        this.calculateφ(Δt);
    }
    protected calculateφ(Δt: number): void {
        const newDφ: Array<number> = [];
        for (let i = 0; i < this.ddφ.length; ++i) {
            newDφ[ i ] = this.dφ[ i ] + this.ddφ[ i ] * Δt;
        }
        newDφ.forEach((v, i) => this.dφ[ i ] = v);

        const newφ: Array<number> = [];
        for (let i = 0; i < this.dφ.length; ++i) {
            newφ[ i ] = this.φ[ i ] + this.dφ[ i ] * Δt;
        }
        newφ.forEach((v, i) => this.φ[ i ] = v);
    }
    protected calculateDdφ(Δt: number): void {
        const [ n, m, l, φ, φD ] = [ this.lengths.length, this.masses, this.lengths, this.φ, this.dφ ];
        const { sin, cos } = Math;

        const φDD: Array<number> = [];
        const ა = (k: number) => l[ k ] * (
            cos(φ[ k ]) * this.ddφ[ k ] -
            sin(φ[ k ]) * φD[ k ] * φD[ k ]
        );
        const დ = (k: number) => l[ k ] * (
            sin(φ[ k ]) * this.ddφ[ k ] +
            cos(φ[ k ]) * φD[ k ] * φD[ k ]
        );
        const გ = (k: number) => l[ k ] * cos(φ[ k ]) * φD[ k ];
        const ე = (k: number) => l[ k ] * sin(φ[ k ]) * φD[ k ];

        for (let j = 0; j < n; j++) {
            const TOHLE = sum(j, n, (i) => m[ i ] * l[ j ] * (
                cos(φ[ j ]) * sumWithout(0, i + 1, j, ა) +
                sin(φ[ j ]) * sumWithout(0, i + 1, j, დ) +
                cos(φ[ j ]) * φD[ j ] * sum(0, i + 1, ე) -
                sin(φ[ j ]) * φD[ j ] * sum(0, i + 1, გ)
            ));
            const partialLpodleφj = sum(j, n, (i) => m[ i ] * (
                sum(0, i + 1, (k) => sin(φ[ k ]) * φD[ k ] * l[ k ]) * φD[ j ] * l[ j ] * cos(φ[ j ]) -
                sum(0, i + 1, (k) => cos(φ[ k ]) * φD[ k ] * l[ k ]) * φD[ j ] * l[ j ] * sin(φ[ j ]) -
                this.g * l[ j ] * sin(φ[ j ])
            ));
            φDD[ j ] = (TOHLE - partialLpodleφj) / (l[ j ] * l[ j ] * sum(j, n, (i) => m[ i ]));
        }

        φDD.forEach((v: number, i: number) => this.ddφ[ i ] = v);
    }
    x(index: number): number {
        var sum = 0;
        for (let i = 0; i <= index; i++) {
            sum += Math.sin(this.φ[ i ]) * this.lengths[ i ];
        }
        return sum;
    }
    y(index: number): number {
        var sum = 0;
        for (let i = 0; i <= index; i++) {
            sum += Math.cos(this.φ[ i ]) * this.lengths[ i ];
        }
        return -sum;
    }
    H(): number {
        const [ n, m, l, φ, φD ] = [ this.lengths.length, this.masses, this.lengths, this.φ, this.dφ ];
        const { sin, cos } = Math;

        return sum(0, n, (i) =>
            (sum(0, i + 1, (k) => cos(φ[ k ]) * φD[ k ] * l[ k ]) ** 2 + sum(0, i + 1, (k) => sin(φ[ k ]) * φD[ k ] * l[ k ]) ** 2) / 2 +
            this.g * sum(0, i + 1, (k) => cos(φ[ k ]) * l[ k ])
        );
    }
}
export class Frame {
    readonly pendulums: Array<[ number, number ]> = [];
    constructor(public simulator: Simulator) {
        for (let i = 0; i < this.simulator.masses.length; ++i) {
            this.pendulums[ i ] = [ this.simulator.x(i), this.simulator.y(i) ];
        }
    }

}
