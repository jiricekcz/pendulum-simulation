import { Simulator, Frame } from "./simulator";
(<any>window).Simulator = Simulator;
(<any>window).Frame = Frame;

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

const simulator = new Simulator([ 1e-2, 1e-2 ], [ 1, 1 ], [ Math.PI / 4, Math.PI / 3 ], 60, 1000, 10);

const topX = 750;
const topY = 350;

function draw() {
    const frame = simulator.simulateFrame();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    const scale = 100;
    for (const p of frame.pendulums) {
        ctx.lineTo(topX + p[ 0 ] * scale, topY + p[ 1 ] * scale);
        ctx.stroke();
        fillCircle(topX + p[ 0 ] * scale, topY + p[ 1 ] * scale, 2, "black");

        ctx.beginPath();
        ctx.moveTo(topX + p[ 0 ] * scale, topY + p[ 1 ] * scale);
    }
    ctx.restore();
}

function fillCircle(x: number, y: number, r: number, color = "black"): void {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();

}

setInterval(draw, 1000 / simulator.framesPerSecond);