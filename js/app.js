let search, button, logo;
let options = [];
let optioning = false;
let gendiv = null;

let spantext = "";

let serverip = "10.203.28.201:2212";

function setServerIp(ip) {
  serverip = ip;
}

let option_labels = ["Sentiment", "Challenge", "Workload", "Year"];

let circles = [];
const MAX_CIRCLES = 20;

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("display", "block");
  background("#99E1D9");

  for (let i = 0; i < MAX_CIRCLES; i++) {
    circles[i] = {
      r: getRandomInt(5, 25),
      x: getRandomInt(0, windowWidth),
      y: getRandomInt(0, windowHeight),
      dx: getRandomInt(-5, 5),
      dy: getRandomInt(-5, 5),
    };
  }

  logo = createImg("../images/logo.png", "Jayway Logo");
  logo.size(100, 100);
  logo.mouseReleased((_) => {
    if (!optioning && !gendiv) {
      window.location.href = "../index.html";
    } else {
      window.location.href = "../app.html";
    }
  });

  search = createInput();
  search.attribute("placeholder", "What's your ideal college experience?");
  search.size(600, 50);
  search.position(0, windowHeight / 2);
  search.center("horizontal");

  button = createButton("Let's go!");
  button.size(150, 50);
  button.position(0, search.y + 100);
  button.center("horizontal");

  for (let i = 0; i < 4; i++) {
    options[i] =
      i == 3 ? createSlider(2002, 2022, 2022, 1) : createSlider(2, 5, 2, 1);
    options[i].size(200, 5);

    if (windowWidth < 1000) {
      options[i].position(windowWidth / 2, windowHeight / 2 + 75 * i);
    } else {
      options[i].position(
        (((i % 2) + 1) * windowWidth) / 4 + 80,
        windowHeight / 2 + 200 * Math.floor(i / 2)
      );
    }

    options[i].hide();
  }

  button.mouseReleased(mouseReleasedButton);

  textAlign(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  search.position(0, windowHeight / 2);
  search.center("horizontal");

  button.position(0, windowHeight / 2 + (optioning ? 275 : 100));
  button.center("horizontal");

  for (let i = 0; options.length; i++) {
    if (windowWidth < 1000) {
      options[i].position(windowWidth / 2, windowHeight / 2 + 75 * i);
    } else {
      options[i].position(
        (((i % 2) + 1) * windowWidth) / 4 + 80,
        windowHeight / 2 + 200 * Math.floor(i / 2)
      );
    }
  }
}

function mouseReleasedButton() {
  if (!optioning) {
    search.hide();
    button.position(0, windowHeight / 2 + 275);
    button.center("horizontal");

    for (let i = 0; i < options.length; i++) {
      options[i].show();
    }

    optioning = true;
  } else {
    // User picked options, time to hide everything and show the result
    button.hide();
    for (let i = 0; i < options.length; i++) {
      options[i].hide();
    }

    optioning = false;
    resulting = true;

    gendiv = select("#generation");
    gendiv.show();

    fetch(`https://hophacks23-399208.uk.r.appspot.com/`, {
      method: "POST",
      body: search.value(),
    })
      .then((res) => {
        return res.json();
      })
      .then((str) => {
        console.log(str);
        spantext = str;
      });
  }
}

function mouseOverSlider() {
  if (!optioning) {
    return;
  }

  for (let i = 0; i < options.length; i++) {
    const xoff = i % 2 == 1 && windowWidth >= 1000 ? 250 : -50;
    const align = i % 2 == 1 && windowWidth >= 1000 ? LEFT : RIGHT;

    let textValue = `${option_labels[i]}: ${options[i].value()}`;
    if (i != 3) {
      textValue += "/5";
    }

    strokeWeight(0);
    textSize(28);
    textFont("Poppins");
    textStyle(BOLD);
    textAlign(align);
    fill("#FCFCFC");
    text(textValue, options[i].x + xoff, options[i].y + 10);
  }
}

let curchar = 0;
let curtime = 0;
let stage = 0;

function animateText() {
  if (!gendiv) {
    return;
  }

  const pleasewait = "Generating response, this may take a while";

  if (stage == 0) {
    // generating the please wait text
    if (curtime++ > deltaTime / 10) {
      curtime = 0;
      curchar++;
    }

    gendiv.html(`<span>${pleasewait.slice(0, curchar)}</span>`);

    if (curchar == pleasewait.length) {
      stage = 1;
      curtime = 0;
      curchar = 0;
    }
  } else if (stage == 1) {
    // generate waiting "periods"
    if (curtime++ > deltaTime) {
      curtime = 0;
      curchar = ++curchar % 5;
    }

    gendiv.html(
      `<span>${
        "Generating response, this may take a while" + ".".repeat(curchar)
      }</span>`
    );

    if (spantext.length > 0) {
      stage = 2;
      curtime = 0;
      curchar = pleasewait.length;
    }
  } else if (stage == 2) {
    // delete generating text
    if (curtime++ > deltaTime / 30) {
      curtime = 0;
      curchar--;
    }

    gendiv.html(
      `<span>${"Generating response, this may take a while".slice(
        0,
        curchar
      )}</span>`
    );

    if (curchar == 0) {
      stage = 3;
    }
  } else {
    // now show the generated prompt
    if (curchar < spantext.length && curtime++ > deltaTime / 60) {
      curtime = 0;
      curchar++;
    }

    gendiv.html(`<p>${spantext.slice(0, curchar).replace(/\n/g, "<br>")}</p>`);
  }
}

function handleCircles() {
  strokeWeight(0);
  fill("#FFFFFFAA");

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

function drawLogo() {
  let logox = windowWidth / 2 - 175;
  let logoy = Math.max(windowHeight / 2 - 200, 25);

  logo.position(logox, logoy);

  textSize(48);
  textFont("Poppins");
  textStyle(BOLD);
  textAlign(CENTER);
  fill("#FCFCFC");
  text("Jayway", logox + 225, logoy + 65);
}

function draw() {
  background("#99E1D9");

  if (search.value().length == 0) {
    button.attribute("disabled", "true");
  } else {
    button.removeAttribute("disabled");
  }

  drawLogo();
  handleCircles();
  mouseOverSlider();
  animateText();
}
