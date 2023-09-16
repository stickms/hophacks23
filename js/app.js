let search, button, logo;

let circles = [];
const MAX_CIRCLES = 20;

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  background('#99E1D9');

  for (let i = 0; i < MAX_CIRCLES; i++) {
    circles[i] = {
      r: getRandomInt(5, 25),
      x: getRandomInt(0, windowWidth),
      y: getRandomInt(0, windowHeight),
      dx: getRandomInt(-5, 5),
      dy: getRandomInt(-5, 5)
    };
  }

  logo = loadImage('../images/logo.png');

  search = createInput();
  search.attribute('placeholder', 'What\'s your ideal college experience?');
  search.style(`
    border-radius: 25px;
    border: 0;
    font-size: 24px;
    font-family: "Poppins";
    font-weight: bold;
    padding: 20px 20px;
    outline: none;
  `);

  search.size(600, 50);
  search.position(50, windowHeight / 2);
  search.center('horizontal');

  button = createButton('Let\'s go!');
  button.style(`
    border: 0;
    border-radius: 25px;
    background: #F7567C;
    color: #FCFCFC;
    font-weight: bold;
    font-family: "Poppins";
    transition: transform 200ms ease-in-out;
  `);
  button.size(150, 50);
  button.position(50, search.y + 100);
  button.center('horizontal');

  button.mouseOver(_ => {
    button.style('transform: scale(1.05);');
  });

  button.mouseOut(_ => {
    button.style('transform: scale(1)');
  });

  button.mousePressed(mousePressedButton);
  button.mouseReleased(_ => {
    button.style('filter: brightness(100%);');
  });

  textAlign(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  search.center('horizontal');
  button.center('horizontal');
}

function mousePressedButton() {
  button.style('filter: brightness(85%);');
  console.log('pressed');
}

function handleCircles() {
  strokeWeight(0);
  fill('#FFFFFFAA');

  for (let i = 0; i < MAX_CIRCLES; i++) {
    const data = circles[i];
    circle(data.x, data.y, data.r * 2);

    if (data.x + data.r > windowWidth && data.dx > 0) {
      data.dx *= -1;
    } else if (data.x - data.r < 0 && data.dx < 0) {
      data.dx *= -1;
    }

    if (data.y + data.r > windowHeight && data.dy > 0) {
      data.dy *= -1;
    } else if (data.y - data.r < 0 && data.dy < 0) {
      data.dy *= -1;
    }

    circles[i].x += data.dx;
    circles[i].y += data.dy;
  }
}

function draw() {
  background('#99E1D9');

  let logox = search.x + 135;
  let logoy = search.y - 200;

  image(logo, logox, logoy, 100, 100);

  textSize(48);
  textFont('Poppins');
  textStyle(BOLD);
  fill('#FCFCFC');
  text('Jayway', logox + 225, logoy + 65);

  handleCircles();
}