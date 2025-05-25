const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Body,
  Composite,
  Events,
  Mouse,
  MouseConstraint
} = Matter;

const engine = Engine.create();
const world = engine.world;

const width = window.innerWidth;
const height = window.innerHeight;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    background: '#f0f8ff'
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Paredes
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
];
World.add(world, walls);

function createBubble(x, y, text, id) {
  const radius = 60;
  const body = Bodies.circle(x, y, radius, {
    restitution: 0.9,
    frictionAir: 0.01,
    label: id,
    render: {
      fillStyle: '#add8e6',
      strokeStyle: '#000',
      lineWidth: 2
    }
  });
  body.originalRadius = radius;
  body.bubbleText = text;
  return body;
}

const bubble1 = createBubble(200, 200, 'Hola', 'bubble1');
const bubble2 = createBubble(600, 300, 'Adios', 'bubble2');
World.add(world, [bubble1, bubble2]);

Events.on(render, 'afterRender', () => {
  const context = render.context;
  context.font = '20px Arial';
  context.fillStyle = '#000';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(bubble1.bubbleText, bubble1.position.x, bubble1.position.y);
  context.fillText(bubble2.bubbleText, bubble2.position.x, bubble2.position.y);
});

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
World.add(world, mouseConstraint);

// Limitar movimiento a los bordes
Events.on(engine, 'beforeUpdate', () => {
  [bubble1, bubble2].forEach(bubble => {
    const radius = bubble.circleRadius;
    if (bubble.position.x - radius < 0) {
      Body.setPosition(bubble, { x: radius, y: bubble.position.y });
      Body.setVelocity(bubble, { x: -bubble.velocity.x, y: bubble.velocity.y });
    }
    if (bubble.position.x + radius > width) {
      Body.setPosition(bubble, { x: width - radius, y: bubble.position.y });
      Body.setVelocity(bubble, { x: -bubble.velocity.x, y: bubble.velocity.y });
    }
    if (bubble.position.y - radius < 0) {
      Body.setPosition(bubble, { x: bubble.position.x, y: radius });
      Body.setVelocity(bubble, { x: bubble.velocity.x, y: -bubble.velocity.y });
    }
    if (bubble.position.y + radius > height) {
      Body.setPosition(bubble, { x: bubble.position.x, y: height - radius });
      Body.setVelocity(bubble, { x: bubble.velocity.x, y: -bubble.velocity.y });
    }
  });
});

// Reacciones a colisiones
Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(pair => {
    const a = pair.bodyA;
    const b = pair.bodyB;
    if ((a.label === 'bubble1' && b.label === 'bubble2') ||
        (a.label === 'bubble2' && b.label === 'bubble1')) {
      a.shrinking = true;
      b.shrinking = true;
    }
  });
});

Events.on(engine, 'collisionEnd', event => {
  event.pairs.forEach(pair => {
    const a = pair.bodyA;
    const b = pair.bodyB;
    if ((a.label === 'bubble1' && b.label === 'bubble2') ||
        (a.label === 'bubble2' && b.label === 'bubble1')) {
      a.shrinking = false;
      b.shrinking = false;
    }
  });
});

// Animar tamaño
Events.on(engine, 'beforeUpdate', () => {
  [bubble1, bubble2].forEach(bubble => {
    let scaleStep = 0.005;
    if (bubble.shrinking) {
      if (bubble.circleRadius > bubble.originalRadius * 0.6) {
        let newRadius = bubble.circleRadius * (1 - scaleStep);
        Body.scale(bubble, newRadius / bubble.circleRadius, newRadius / bubble.circleRadius);
      }
    } else {
      if (bubble.circleRadius < bubble.originalRadius) {
        let newRadius = bubble.circleRadius * (1 + scaleStep);
        if (newRadius > bubble.originalRadius) newRadius = bubble.originalRadius;
        Body.scale(bubble, newRadius / bubble.circleRadius, newRadius / bubble.circleRadius);
      }
    }
  });
});
