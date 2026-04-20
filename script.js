const timelineButtons = document.querySelectorAll(".timeline-button");

timelineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    item.classList.toggle("open");
  });
});

const slider = document.getElementById("xSlider");
const xValue = document.getElementById("xValue");
const pointText = document.getElementById("pointText");
const slopeText = document.getElementById("slopeText");
const svg = document.getElementById("graph");

const width = 640;
const height = 420;
const padding = 50;
const xMin = -3.5;
const xMax = 3.5;
const yMin = -1;
const yMax = 10.5;

function toSvgX(x) {
  return padding + ((x - xMin) / (xMax - xMin)) * (width - padding * 2);
}

function toSvgY(y) {
  return height - padding - ((y - yMin) / (yMax - yMin)) * (height - padding * 2);
}

function curvePath() {
  let path = "";

  for (let x = xMin; x <= xMax; x += 0.05) {
    const y = x * x;
    const command = path === "" ? "M" : "L";
    path += `${command} ${toSvgX(x)} ${toSvgY(y)} `;
  }

  return path;
}

svg.innerHTML = `
  <rect width="${width}" height="${height}" rx="20" fill="#0b1725"></rect>
  <line x1="${padding}" y1="${toSvgY(0)}" x2="${width - padding}" y2="${toSvgY(0)}" stroke="#8fa8c4"></line>
  <line x1="${toSvgX(0)}" y1="${padding}" x2="${toSvgX(0)}" y2="${height - padding}" stroke="#8fa8c4"></line>
  <path d="${curvePath()}" fill="none" stroke="#7ed0ff" stroke-width="4"></path>
  <line id="tangentLine" stroke="#ffcb70" stroke-width="3"></line>
  <line id="guideX" stroke="rgba(255,255,255,0.25)" stroke-dasharray="5 5"></line>
  <line id="guideY" stroke="rgba(255,255,255,0.25)" stroke-dasharray="5 5"></line>
  <circle id="point" r="7" fill="#fff3d3"></circle>
  <text x="${padding + 90}" y="34" fill="#eef4ff" font-size="16">y = x²</text>
  <text id="graphLabel" x="${padding + 90}" y="58" fill="#ffcb70" font-size="15"></text>
`;

const tangentLine = document.getElementById("tangentLine");
const guideX = document.getElementById("guideX");
const guideY = document.getElementById("guideY");
const point = document.getElementById("point");
const graphLabel = document.getElementById("graphLabel");

function updateGraph() {
  const x = Number(slider.value);
  const y = x * x;
  const slope = 2 * x;
  const intercept = y - slope * x;

  const lineX1 = xMin;
  const lineY1 = slope * lineX1 + intercept;
  const lineX2 = xMax;
  const lineY2 = slope * lineX2 + intercept;

  const pointX = toSvgX(x);
  const pointY = toSvgY(y);

  tangentLine.setAttribute("x1", toSvgX(lineX1));
  tangentLine.setAttribute("y1", toSvgY(lineY1));
  tangentLine.setAttribute("x2", toSvgX(lineX2));
  tangentLine.setAttribute("y2", toSvgY(lineY2));

  guideX.setAttribute("x1", pointX);
  guideX.setAttribute("y1", pointY);
  guideX.setAttribute("x2", pointX);
  guideX.setAttribute("y2", toSvgY(0));

  guideY.setAttribute("x1", toSvgX(0));
  guideY.setAttribute("y1", pointY);
  guideY.setAttribute("x2", pointX);
  guideY.setAttribute("y2", pointY);

  point.setAttribute("cx", pointX);
  point.setAttribute("cy", pointY);

  xValue.textContent = x.toFixed(2);
  pointText.textContent = `Point: (${x.toFixed(2)}, ${y.toFixed(2)})`;
  slopeText.textContent = `Slope: ${slope.toFixed(2)}`;
  graphLabel.textContent = `Derivative here: 2x = ${slope.toFixed(2)}`;
}

slider.addEventListener("input", updateGraph);
updateGraph();
