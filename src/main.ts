import {
  Application,
  Graphics,
  Container,
} from "pixi.js";

import { initDevtools } from "@pixi/devtools";
import { Game } from "./game";

(async () => {
  const app = new Application();

  await app.init({
    backgroundColor: 0x000000,
    resizeTo: window,
    antialias: true,
  });

  initDevtools({ app });

  app.canvas.style.position = "absolute";
  app.canvas.style.zIndex = "0";

  document.getElementById("game-container")?.appendChild(app.canvas);

  const scene = new Container();
  app.stage.addChild(scene);

  const background = new Graphics();

  const headerContainer = new Container();
  const footerContainer = new Container();

  const header = new Graphics();
  const footer = new Graphics();

  headerContainer.addChild(header);
  footerContainer.addChild(footer);

  const cornerRadius = 32;

  let layoutWidth = app.screen.width * 0.6;
  let layoutHeight = app.screen.height * 0.6;

  const drawBackground = () => {
    layoutWidth = app.screen.width * 0.6;
    layoutHeight = app.screen.height * 0.6;
    const x = (app.screen.width - layoutWidth) / 2;
    const y = (app.screen.height - layoutHeight) / 2;

    background.clear();
    background
      .roundRect(x, y, layoutWidth, layoutHeight, cornerRadius)
      .fill({ color: 0x00c1ff, alpha: 0.8 })
      .stroke({ color: 0xffa500, width: 4, alpha: 1.0 });

    // Header
    const headerHeight = 60;
    header.clear();
    header.beginFill(0x007acc, 1);
    header.drawRoundedRect(0, 0, layoutWidth, headerHeight, cornerRadius);
    header.endFill();
    headerContainer.position.set(x, y);

    // Footer
    const footerHeight = 80;
    footer.clear();
    footer.beginFill(0x005b99, 1);
    footer.drawRoundedRect(0, 0, layoutWidth, footerHeight, cornerRadius);
    footer.endFill();
    footerContainer.position.set(x, y + layoutHeight - footerHeight);
  };

  drawBackground();

  scene.addChild(headerContainer);
  scene.addChild(footerContainer);
  scene.addChild(background);

  const htmlBtn = document.getElementById("how-to-play-btn") as HTMLButtonElement;
  const funLabel = document.getElementById("fun-label") as HTMLDivElement;
  const betBtn = document.getElementById("bet-btn") as HTMLButtonElement;
  const betInput = document.getElementById("bet-amount") as HTMLInputElement;
  const balanceLabel = document.getElementById("balance-label") as HTMLDivElement;
  

  function positionHtmlElements() {
    const { x, y } = headerContainer;
    const headerHeight = 60;
    const footerHeight = 80;

    // How to Play button
    htmlBtn.style.position = "absolute";
    htmlBtn.style.left = `${x + 20}px`;
    htmlBtn.style.top = `${y + (headerHeight - 40) / 2}px`;
    htmlBtn.style.zIndex = "2";

    // Fun label
    funLabel.style.position = "absolute";
    funLabel.style.left = `${x + layoutWidth / 2}px`;
    funLabel.style.top = `${y + (headerHeight - 40) / 2}px`;
    funLabel.style.transform = "translateX(-50%)";
    funLabel.style.zIndex = "2";

    // Bet button
    betBtn.style.position = "absolute";
    betBtn.style.left = `${x + layoutWidth - 500}px`; // adjust based on button width
    betBtn.style.top = `${y + layoutHeight - footerHeight + (footerHeight - 40) / 2}px`;
    betBtn.style.zIndex = "2";

    // Bet input
    betInput.style.position = "absolute";
    betInput.style.left = `${x + 300}px`; // left inside the footer
    betInput.style.top = `${y + app.screen.height * 0.6 - footerHeight + (footerHeight - 40) / 2}px`; // center vertically
    betInput.style.zIndex = "2";
  }

  let balance = 3000;
  function updateBalanceDisplay() {
   balanceLabel.textContent = `$${balance}`;
  }
  updateBalanceDisplay();
  

  positionHtmlElements();

  const grid = new Game();
  scene.addChild(grid.container);
  betBtn.addEventListener("click", () => {
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0) return alert("Enter a valid bet amount");
    if (bet > balance) return alert("Insufficient balance");

  balance -= bet;
  updateBalanceDisplay();

  // Enable interaction
  grid.enableInteraction(true);
});

  function centerGameGrid() {
    const gridWidth = grid.container.width;
    const gridHeight = grid.container.height;
    grid.container.x = (app.screen.width - gridWidth) / 2;
    grid.container.y = (app.screen.height - gridHeight) / 2;
  }

  drawBackground();
  centerGameGrid();

  window.addEventListener("resize", () => {
    drawBackground();
    centerGameGrid();
    positionHtmlElements();
  });
})();
