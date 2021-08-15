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
        const [ n, m, l, φ, dφ, g ] = [ this.lengths.length, this.masses, this.lengths, this.φ, this.dφ, this.g ];
        const { sin, cos } = Math;

        const ddφ: Array<number> = [];

        for (let j = 0; j < n; j++) {
            const m_j_n = sum(j, n, (i) => m[i]);
            ddφ[j] = (sum(0, n, (i) => m[i] * sumWithout(0, i + 1, j, (k) => l[k] * (l[j] * (sin(φ[k] - φ[j]) * dφ[k]**2 - cos(φ[k] - φ[j]) * this.ddφ[k]) - g * sin(φ[k])))) - l[j] * g * sin(φ[j]) * m_j_n) / (l[j] ** 2 * m_j_n);
        }

        this.ddφ = ddφ;
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
        return sum;
    }
    H(): number {
        const [ n, m, l, φ, φD ] = [ this.lengths.length, this.masses, this.lengths, this.φ, this.dφ ];
        const { sin, cos } = Math;

        return sum(0, n, (i) =>
                   m[i] * ((sum(0, i + 1, (k) => cos(φ[ k ]) * φD[ k ] * l[ k ]) ** 2 + sum(0, i + 1, (k) => sin(φ[ k ]) * φD[ k ] * l[ k ]) ** 2) / 2 - this.g * sum(0, i + 1, (k) => cos(φ[ k ]) * l[ k ]))
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
