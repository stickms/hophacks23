let search, button, logo;
let options = [];
let optioning = false;
let generation = null;

let spantext = "";

let option_labels = [
  'Overall',
  'Challenge',
  'Workload',
  'Year'
]

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
  search.size(600, 50);
  search.position(0, windowHeight / 2);
  search.center('horizontal');

  button = createButton('Let\'s go!');
  button.size(150, 50);
  button.position(0, search.y + 100);
  button.center('horizontal');

  for (let i = 0; i < 4; i++) {
    options[i] = i == 3 ? createSlider(2002, 2022, 2022, 1) : createSlider(2, 5, 2, 1);
    options[i].size(200, 5);

    if (windowWidth < 1000) {
      options[i].position(windowWidth / 2, windowHeight / 2 + 75 * i);
    } else {
      options[i].position((i % 2 + 1) * windowWidth / 4 + 80, windowHeight / 2 + 200 * (Math.floor(i / 2)));
    }

    options[i].hide();
  }

  button.mouseReleased(mouseReleasedButton);

  textAlign(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  search.position(0, windowHeight / 2);
  search.center('horizontal');

  button.position(0, windowHeight / 2 + (optioning ? 275 : 100));
  button.center('horizontal');

  for (let i = 0; options.length; i++) {
    if (windowWidth < 1000) {
      options[i].position(windowWidth / 2, windowHeight / 2 + 75 * i);
    } else {
      options[i].position((i % 2 + 1) * windowWidth / 4 + 80, windowHeight / 2 + 200 * (Math.floor(i / 2)));
    }
  }
}

function mouseReleasedButton() {
  if (!optioning) {
    search.hide();
    button.position(0, windowHeight / 2 + 275);
    button.center('horizontal');
  
    for (let i = 0; i < options.length; i++) {
      options[i].show();
    }
  
    optioning = true;  
  } else { // User picked options, time to hide everything and show the result
    button.hide();
    for (let i = 0; i < options.length; i++) {
      options[i].hide();
    }

    optioning = false;
    resulting = true;

    generation = select('#generation');
    generation.show();

    spantext = "You should drop out, immediately!";
  }
}

function mouseOverSlider() {
  if (!optioning) {
    return;
  }

  for (let i = 0; i < options.length; i++) {
    const xoff = (i % 2 == 1 && windowWidth >= 1000) ? 250 : -50;
    const align = (i % 2 == 1) && windowWidth >= 1000 ? LEFT : RIGHT;
  
    strokeWeight(0);
    textSize(28);
    textFont('Poppins');
    textStyle(BOLD);
    textAlign(align);
    fill('#FCFCFC');
    text(`${option_labels[i]}: ${options[i].value()}`, options[i].x + xoff, options[i].y + 10);  
  }
}

let curchar = 0;
let curtime = 0;

function animateText() {
  if (!generation) {
    return;
  }

  const display = spantext.slice(0, curchar);

  if (curtime++ > deltaTime / 20) {
    curtime = 0;
    curchar++;
  }

  generation.html(`<span>${display}</span>`);
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

  let logox = windowWidth / 2 - 175;
  let logoy = Math.max(windowHeight / 2 - 200, 25);

  image(logo, logox, logoy, 100, 100);

  textSize(48);
  textFont('Poppins');
  textStyle(BOLD);
  textAlign(CENTER);
  fill('#FCFCFC');
  text('Jayway', logox + 225, logoy + 65);

  handleCircles();
  mouseOverSlider();
  animateText();
}