document.addEventListener('DOMContentLoaded', main);

const starty = 5;
const dy = 81;

const startx = 21;
const dx = 49;

const minProjectileLen = 50;
const maxProjectileLen = 700;

const minSteps = 8000;
const maxSteps = 12000;

const projectileCount = 10;

const lineColor = 'hsla(0, 0%, 60%, 0.1)';

/** @type {CanvasRenderingContext2D} */
let ctx;
/** @type {number} */
let width;
/** @type {number} */
let height;

let hprojectiles = [];
let vprojectiles = [];

function main() {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    return;
  }
  ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  canvas.width = width;
  canvas.height = height;

  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) {
      return;
    }
    const rect = entry.target.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
  });
  observer.observe(canvas.parentElement);

  const rcount = getrcount();
  for (let i = 0; i < projectileCount; ++i) {
    hprojectiles.push(createProjectile(rcount, width));
  }
  const ccount = getccount();
  for (let i = 0; i < projectileCount; ++i) {
    vprojectiles.push(createProjectile(ccount, height));
  }

  requestAnimationFrame(draw);
}
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} time
 */
function draw(time) {
  ctx.clearRect(0, 0, width, height);

  drawHorizontalLines();
  drawVerticalLines();

  for (const projectile of hprojectiles) {
    drawHProjectile(projectile, time);
  }

  for (const projectile of vprojectiles) {
    drawVProjectile(projectile, time);
  }

  window.requestAnimationFrame(draw);
}

/**
 * Creates direction-agnostic model of the projectile
 * @param {number} count Number of rows to pick from
 * @param {number} span  Total width/height of the trajectory
 */
function createProjectile(count, span) {
  const len = minProjectileLen + Math.random() * (maxProjectileLen - minProjectileLen);
  const steps = minSteps + Math.random() * (maxSteps - minSteps);
  const startTime = Date.now();
  const row = Math.floor(Math.random() * count) % count;
  const startPos = Math.floor(Math.random() * span) % span;
  const dir = Math.random() < 0.5 ? -1 : 1;
  return { startTime, row, len, startPos, dir, steps };
}

/**
 * @param {any} projectile
 * @param {number} time
 */
function drawHProjectile(projectile, time) {
  ctx.save();

  const { steps, len, dir } = projectile;
  const totalWidth = width + len;
  const step = ((time % steps) / steps) * totalWidth;
  const x = ((projectile.startPos + step * dir + totalWidth) % totalWidth) - len;
  const y = gety(projectile.row);

  const start = dir === 1 ? x : x + len;
  const end = dir === 1 ? x + len : x;
  ctx.fillStyle = createLineGradient(start, y, end, y);
  ctx.fillRect(x, y, len, 1);
  ctx.restore();
}

/**
 * @param {any} projectile
 * @param {number} time
 */
function drawVProjectile(projectile, time) {
  ctx.save();

  const { steps, len, dir } = projectile;
  const totalHeight = height + len;
  const step = ((time % steps) / steps) * totalHeight;
  const x = getx(projectile.row);
  const y = ((projectile.startPos + step * dir + totalHeight) % totalHeight) - len;

  const start = dir === 1 ? y : y + len;
  const end = dir === 1 ? y + len : y;
  ctx.fillStyle = createLineGradient(x, start, x, end);
  ctx.fillRect(x, y, 1, len);
  ctx.restore();
}

/**
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 */
function createLineGradient(x0, y0, x1, y1) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, 'rgba(174, 255, 132, 0.43)');
  gradient.addColorStop(0.0001, 'rgba(167, 217, 254, 0)');
  gradient.addColorStop(0.224, 'rgb(169, 239, 255)');
  gradient.addColorStop(0.6562, 'rgba(178, 255, 230, 1)');
  gradient.addColorStop(0.9427, 'rgba(178, 255, 230, 0)');
  return gradient;
}

function drawHorizontalLines() {
  let y = starty || dy;
  ctx.save();
  ctx.fillStyle = lineColor;
  while (y < height) {
    ctx.fillRect(0, y, width, 1);
    y += dy;
  }
  ctx.restore();
}

function drawVerticalLines() {
  let x = startx || dx;
  ctx.save();
  ctx.fillStyle = lineColor;
  while (x < width) {
    ctx.fillRect(x, 0, 1, height);
    x += dx;
  }
  ctx.restore();
}

/**
 * @param {number} row
 */
function gety(row) {
  return (starty || dy) + dy * row;
}

/**
 * @param {number} row
 */
function getx(row) {
  return (startx || dx) + dx * row;
}

function getrcount() {
  return Math.ceil((height - gety(0)) / dy);
}

function getccount() {
  return Math.ceil((width - getx(0)) / dx);
}
