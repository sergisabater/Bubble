const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events } = Matter;

// Crear motor y mundo
const engine = Engine.create();
engine.gravity.y = 0;
const world = engine.world;

// Crear render
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
Runner.run(Runner.create(), engine);

// Crear burbujas
function createBubble(x, y, color, label) {
  const bubble = Bodies.circle(x, y, 60, {
    restitution: 0.9,
    render: {
      fillStyle: color,
      strokeStyle: '#000000',
      lineWidth: 2
    },
    label: label,
    initialPosition: { x, y }
  });
  return bubble;
}

const bubble1 = createBubble(200, 200, "#A0D6FF", "Hola");
const bubble2 = createBubble(500, 300, "#FF8080", "Adiós");

const bubbles = [bubble1, bubble2];
World.add(world, bubbles);

// Agregar control de mouse
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
World.add(world, mouseConstraint);

// Redibujar textos después del render
Events.on(render, 'afterRender', function () {
  const ctx = render.context;
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#003366";

  bubbles.forEach(bubble => {
    ctx.fillText(bubble.label, bubble.position.x, bubble.position.y);
  });
});

// Volver a la posición inicial si salen de pantalla
function checkBounds() {
  bubbles.forEach(bubble => {
    const { x, y } = bubble.position;
    const margin = 100;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (x < -margin || x > width + margin || y < -margin || y > height + margin) {
      Matter.Body.setPosition(bubble, bubble.initialPosition);
      Matter.Body.setVelocity(bubble, { x: 0, y: 0 });
    }
  });

  requestAnimationFrame(checkBounds);
}

checkBounds();
