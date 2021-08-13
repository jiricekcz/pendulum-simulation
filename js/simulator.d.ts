export declare class Simulator {
    readonly masses: Array<number>;
    readonly lengths: Array<number>;
    φ: Array<number>;
    framesPerSecond: number;
    stepsPerFrame: number;
    g: number;
    dφ: Array<number>;
    ddφ: Array<number>;
    constructor(masses: Array<number>, lengths: Array<number>, φ: Array<number>, framesPerSecond: number, stepsPerFrame: number, g: number);
    simluate(): AsyncIterator<Frame>;
    simulateFrame(): Frame;
    step(Δt: number): void;
    protected calculateφ(Δt: number): void;
    protected calculateDdφ(Δt: number): void;
    x(index: number): number;
    y(index: number): number;
    H(): number;
}
export declare class Frame {
    simulator: Simulator;
    readonly pendulums: Array<[number, number]>;
    constructor(simulator: Simulator);
}
//# sourceMappingURL=simulator.d.ts.map