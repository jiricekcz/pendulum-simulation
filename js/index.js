import { Simulator, Frame } from "./simulator.js";
window.Simulator = Simulator;
window.Frame = Frame;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const simulator = new Simulator([1, 1], [1, 1], [Math.PI / 4, Math.PI / 4 + 0.2], 60, 1000, 10);
// const simulator = new Simulator([1], [1], [Math.PI / 4 + 0.2], 60, 1000, 10);
window.simulator = simulator;
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
        ctx.lineTo(topX + p[0] * scale, topY + p[1] * scale);
        ctx.stroke();
        fillCircle(topX + p[0] * scale, topY + p[1] * scale, 2, "black");
        ctx.beginPath();
        ctx.moveTo(topX + p[0] * scale, topY + p[1] * scale);
    }
    ctx.restore();
    ctx.fillRect(10, 300, 50, simulator.H() * 10);
}
function fillCircle(x, y, r, color = "black") {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
}
setInterval(draw, 1000 / simulator.framesPerSecond);
//# sourceMappingURL=index.js.map