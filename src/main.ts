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

    const headerHeight = 60;
    header.clear();
    header.beginFill(0x007acc, 1);
    header.drawRoundedRect(0, 0, layoutWidth, headerHeight, cornerRadius);
    header.endFill();
    headerContainer.position.set(x, y);

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
  const mineInput = document.getElementById("mine-count") as HTMLInputElement;
  const mineLabel = document.getElementById("mine-label") as HTMLDivElement;
  const rewardLabel = document.getElementById("reward-label") as HTMLDivElement;
  const rewardBanner = document.getElementById("reward-banner") as HTMLDivElement;
  const cashoutBtn = document.getElementById("cashout-btn") as HTMLButtonElement;


  betInput.value = "1";
  mineInput.value = "3";

  function positionHtmlElements() {
    const { x, y } = headerContainer;
    const headerHeight = 60;
    const footerHeight = 80;

    htmlBtn.style.position = "absolute";
    htmlBtn.style.left = `${x + 20}px`;
    htmlBtn.style.top = `${y + (headerHeight - 40) / 2}px`;
    htmlBtn.style.zIndex = "2";

    funLabel.style.position = "absolute";
    funLabel.style.left = `${x + layoutWidth / 2}px`;
    funLabel.style.top = `${y + (headerHeight - 40) / 2}px`;
    funLabel.style.transform = "translateX(-50%)";
    funLabel.style.zIndex = "2";

    betBtn.style.position = "absolute";
    betBtn.style.left = `${x + layoutWidth - 500}px`;
    betBtn.style.top = `${y + layoutHeight - footerHeight + (footerHeight - 40) / 2}px`;
    betBtn.style.zIndex = "2";

    betInput.style.position = "absolute";
    betInput.style.left = `${x + 300}px`;
    betInput.style.top = `${y + app.screen.height * 0.6 - footerHeight + (footerHeight - 40) / 2}px`;
    betInput.style.zIndex = "2";

    balanceLabel.style.position = "absolute";
    balanceLabel.style.left = `${x + layoutWidth - 135}px`;
    balanceLabel.style.top = `${y + (headerHeight - 40) / 2}px`;
    balanceLabel.style.zIndex = "2";

    mineInput.style.position = "absolute";
    mineInput.style.left = `${x + 250}px`;
    mineInput.style.top = `${y + app.screen.height * 0.6 - footerHeight + (footerHeight - 40) / 2}px`;
    mineInput.style.zIndex = "2";

    mineLabel.style.position = "absolute";
    mineLabel.style.left = `${x + 180}px`;
    mineLabel.style.top = `${y + layoutHeight - footerHeight + (footerHeight - 40) / 2}px`;
    mineLabel.style.zIndex = "2";

    rewardLabel.style.position = "absolute";
    rewardLabel.style.left = `${x + layoutWidth - 350}px`;
    rewardLabel.style.top = `${y + (headerHeight - 40) / 2}px`;
    rewardLabel.style.zIndex = "2";

    rewardBanner.style.position = "absolute";
    rewardBanner.style.left = `${x + layoutWidth - 291}px`;
    rewardBanner.style.top = `${y + (headerHeight - 40) / 2}px`;
    rewardBanner.style.zIndex = "2";

    // Cash Out button
    cashoutBtn.style.position = "absolute";
    cashoutBtn.style.left = `${x + layoutWidth - 520}px`;
    cashoutBtn.style.top = `${y + layoutHeight - footerHeight + (footerHeight - 40) / 2}px`;
    cashoutBtn.style.zIndex = "2";
  }

  let balance = 3000;
  function updateBalanceDisplay() {
    balanceLabel.textContent = `$${balance.toFixed(2)}`;
  }
  updateBalanceDisplay();

  positionHtmlElements();

  let currentGame: Game | null = null;
  currentGame = new Game(3);
  scene.addChild(currentGame.container);
  currentGame.enableInteraction(false);
  centerGameGrid();

  function startGame() {
    cashoutBtn.disabled = false;
    const bet = parseFloat(betInput.value);
    const mineCount = parseInt(mineInput.value) || 3;

    if (isNaN(bet) || bet < 0.01) return alert("Enter a valid bet amount");
    if (bet > balance) return alert("Insufficient balance");
    if (mineCount < 1 || mineCount > 20) return alert("Mine count must be between 1 and 20");

    balance -= bet;
    updateBalanceDisplay();
    rewardLabel.textContent = "$0.00";

    if (currentGame) {
      scene.removeChild(currentGame.container);
    }

    currentGame = new Game(mineCount, (reward) => {
      balance += reward;
      updateBalanceDisplay();
      alert(`You won $${reward.toFixed(2)}!`);
    }, bet);

    currentGame.onRewardUpdate = (reward: number) => {
      rewardLabel.textContent = `$${reward.toFixed(2)}`;
    };

    scene.addChild(currentGame.container);
    currentGame.enableInteraction(true);
    centerGameGrid();
  }

  betBtn.addEventListener("click", startGame);

  function centerGameGrid() {
    if (!currentGame) return;
    const gridWidth = currentGame.container.width;
    const gridHeight = currentGame.container.height;
    currentGame.container.x = (app.screen.width - gridWidth) / 2;
    currentGame.container.y = (app.screen.height - gridHeight) / 2;
  }

  drawBackground();
  centerGameGrid();

  window.addEventListener("resize", () => {
    drawBackground();
    centerGameGrid();
    positionHtmlElements();
  });
})();
