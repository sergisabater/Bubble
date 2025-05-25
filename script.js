const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Bubble {
  constructor(x, y, radius, color, label) {
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.label = label;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.dragging = false;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = '#003366';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, this.x, this.y);
  }

  update() {
    if (!this.dragging) {
      this.x += this.vx;
      this.y += this.vy;

      // Rebote en los bordes
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.vx *= -1;
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.vy *= -1;
      }
    }
  }

  isOutOfBounds() {
    return (
      this.x + this.radius < 0 ||
      this.x - this.radius > canvas.width ||
      this.y + this.radius < 0 ||
      this.y - this.radius > canvas.height
    );
  }

  resetPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  isPointInside(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }
}

const bubbles = [
  new Bubble(200, 200, 60, '#A0D6FF', 'Hola'),
  new Bubble(500, 300, 60, '#FF8080', 'Adiós')
];

let draggingBubble = null;
let offsetX = 0;
let offsetY = 0;

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = bubbles.length - 1; i >= 0; i--) {
    if (bubbles[i].isPointInside(mouseX, mouseY)) {
      draggingBubble = bubbles[i];
      offsetX = mouseX - draggingBubble.x;
      offsetY = mouseY - draggingBubble.y;
      draggingBubble.dragging = true;
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (draggingBubble) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    draggingBubble.x = mouseX - offsetX;
    draggingBubble.y = mouseY - offsetY;
  }
});

canvas.addEventListener('mouseup', () => {
  if (draggingBubble) {
    draggingBubble.dragging = false;
    draggingBubble = null;
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let bubble of bubbles) {
    bubble.update();
    bubble.draw(ctx);

    if (bubble.isOutOfBounds()) {
      bubble.resetPosition();
    }
  }

  requestAnimationFrame(animate);
}

animate();
