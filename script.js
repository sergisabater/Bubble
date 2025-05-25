// Alias útiles
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

// Crear motor y mundo
const engine = Engine.create();
engine.gravity.y = 0;

const world = engine.world;

// Crear renderizador
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: '#f0f0f0',
    wireframes: false
  }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Crear burbuja con color personalizado
function createBubble(x, y, text, color) {
  const body = Bodies.circle(x, y, 60, {
    restitution: 0.9,
    render: {
      fillStyle: color,
      strokeStyle: '#000000',
      lineWidth: 2
    },
    label: text,
    initialPosition: { x, y }
  });
  return body;
}

// Dos burbujas visibles desde el principio
let bubbles = [
  createBubble(200, 200, "Hola", "#A0D6FF"),
  createBubble(500, 400, "Adiós", "#FF8080")
];

Composite.add(world, bubbles);

// Mouse interacción
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
Composite.add(world, mouseConstraint);

// Verificación para reiniciar si salen de pantalla
function checkOutOfBounds() {
  bubbles.forEach(bubble => {
    const pos = bubble.position;
    if (
      pos.x < -100 || pos.x > window.innerWidth + 100 ||
      pos.y < -100 || pos.y > window.innerHeight + 100
    ) {
      Matter.Body.setPosition(bubble, bubble.initialPosition);
      Matter.Body.setVelocity(bubble, { x: 0, y: 0 });
    }
  });
  requestAnimationFrame(checkOutOfBounds);
}
checkOutOfBounds();

// Dibujar texto dentro de burbujas
(function renderLabels() {
  const ctx = render.context;
  requestAnimationFrame(renderLabels);
  ctx.font = "bold 16px sans-serif";
  ctx.fillStyle = "#003366";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  bubbles.forEach(bubble => {
    const pos = bubble.position;
    ctx.fillText(bubble.label, pos.x, pos.y);
  });
})();
