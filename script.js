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
    wireframes: false,
    pixelRatio: window.devicePixelRatio
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

// Crear las burbujas
const bubble1 = createBubble(200, 200, "Hola", "#A0D6FF");
const bubble2 = createBubble(500, 400, "Adiós", "#FF8080");

const bubbles = [bubble1, bubble2];
Composite.add(world, bubbles);

// Hacerlas arrastrables
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
Composite.add(world, mouseConstraint);

// Si se salen, vuelven a su posición original
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

// Asegurarnos de que se dibujen los textos de todas las burbujas
Events.on(render, 'afterRender', function() {
  const ctx = render.context;
  ctx.save();
  ctx.font = "bold 16px sans-serif";
  ctx.fillStyle = "#003366";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  bubbles.forEach(bubble => {
    const pos = bubble.position;
    ctx.fillText(bubble.label, pos.x, pos.y);
  });

  ctx.restore();
});
