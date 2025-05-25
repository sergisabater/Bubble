// Alias útiles
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Events = Matter.Events;

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

// Crear burbujas con tamaño dinámico
function createBubble(x, y, text) {
  const radius = 60;
  const body = Bodies.circle(x, y, radius, {
    restitution: 0.9,
    render: {
      fillStyle: '#A0D6FF',
      strokeStyle: '#0095ff',
      lineWidth: 3
    },
    label: text
  });
  body.radius = radius;
  return body;
}

let bubbles = [
  createBubble(200, 200, "Hola"),
  createBubble(500, 400, "Sokpop")
];

Composite.add(world, bubbles);

// Mouse interacciones
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
Composite.add(world, mouseConstraint);

// Bordes invisibles
const borders = [
  Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, { isStatic: true }),
  Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true }),
  Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
  Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true })
];
Composite.add(world, borders);

// Encogimiento y desaparición si están fuera de pantalla
function updateBubbles() {
  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i];
    const r = b.circleRadius;

    if (
      b.position.y < 20 || b.position.y > window.innerHeight - 20 ||
      b.position.x < 20 || b.position.x > window.innerWidth - 20
    ) {
      // Encoger
      const shrink = 0.98;
      Matter.Body.scale(b, shrink, shrink);
      b.circleRadius *= shrink;

      if (b.circleRadius < 10) {
        // Remover del mundo
        Composite.remove(world, b);
        // Crear nuevo en el centro
        const newB = createBubble(
          100 + Math.random() * (window.innerWidth - 200),
          100 + Math.random() * (window.innerHeight - 200),
          b.label
        );
        bubbles[i] = newB;
        Composite.add(world, newB);
      }
    } else if (b.circleRadius < b.radius) {
      // Si vuelve al centro, restaurar tamaño poco a poco
      const grow = 1.02;
      Matter.Body.scale(b, grow, grow);
      b.circleRadius = Math.min(b.radius, b.circleRadius * grow);
    }
  }
  requestAnimationFrame(updateBubbles);
}
updateBubbles();

// Renderizado del texto
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
