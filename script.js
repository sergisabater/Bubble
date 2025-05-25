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
engine.gravity.y = 0; // 💡 Sin gravedad: flotan

const world = engine.world;

// Crear renderizador en pantalla
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

// 🟣 Crear burbujas
function createBubble(x, y, text) {
  return Bodies.circle(x, y, 60, {
    restitution: 0.9,
    render: {
      fillStyle: '#A0D6FF',
      strokeStyle: '#0095ff',
      lineWidth: 3
    },
    label: text
  });
}

const bubbles = [
  createBubble(300, 300, "Hola"),
  createBubble(600, 200, "Sokpop")
];

Composite.add(world, bubbles);

// 💻 Mouse para mover burbujas
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
Composite.add(world, mouseConstraint);

// 🧱 Paredes invisibles para que no se vayan
const borders = [
  Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, { isStatic: true }),
  Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true }),
  Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
  Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true })
];
Composite.add(world, borders);

// 🎨 Mostrar texto dentro de las burbujas
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
