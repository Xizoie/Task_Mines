import { Application, Graphics, Container } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Game } from "./game";

(async () => {
  // Initialize the PIXI Application
  const app = new Application();
  await app.init({
    backgroundColor: 0x000000,
    resizeTo: window,
    antialias: true,
  });

  // Enable PIXI devtools for debugging
  initDevtools({ app });

  // Position canvas behind HTML elements
  app.canvas.style.position = "absolute";
  app.canvas.style.zIndex = "0";
  document.getElementById("game-container")?.appendChild(app.canvas);

  // Main PIXI containers
  const scene = new Container();
  app.stage.addChild(scene);

  // Layout elements
  const background = new Graphics();
  const headerContainer = new Container();
  const footerContainer = new Container();
  const header = new Graphics();
  const footer = new Graphics();
  headerContainer.addChild(header);
  footerContainer.addChild(footer);

  // Initial layout dimensions
  const cornerRadius = 32;
  let layoutWidth = app.screen.width * 0.6;
  let layoutHeight = app.screen.height * 0.6;

  // Draw layout shapes and apply styles
  const drawBackground = () => {
    layoutWidth = app.screen.width * 0.6;
    layoutHeight = app.screen.height * 0.6;
    const x = (app.screen.width - layoutWidth) / 2;
    const y = (app.screen.height - layoutHeight) / 2;

    background.clear();
    background.roundRect(x, y, layoutWidth, layoutHeight, cornerRadius)
      .fill({ color: 0x00c1ff, alpha: 0.8 })
      .stroke({ color: 0xffa500, width: 4, alpha: 1.0 });

    // Header
    const headerHeight = 60;
    header.clear();
    header.fill(0x007acc, 1);
    header.roundRect(0, 0, layoutWidth, headerHeight, cornerRadius);
    header.fill();
    headerContainer.position.set(x, y);

    // Footer
    const footerHeight = 80;
    footer.clear();
    footer.fill(0x005b99, 1);
    footer.roundRect(0, 0, layoutWidth, footerHeight, cornerRadius);
    footer.fill();
    footerContainer.position.set(x, y + layoutHeight - footerHeight);
  };

  drawBackground();
  scene.addChild(headerContainer, footerContainer, background);

  // === HTML ELEMENTS ===
  const howToPlayBtn = document.getElementById("how-to-play-btn") as HTMLButtonElement;
  const howToPlayModal = document.getElementById("how-to-play-modal") as HTMLElement;
  const closeHowToPlay = document.getElementById("close-how-to-play") as HTMLElement;
  const funLabel = document.getElementById("fun-label") as HTMLDivElement;
  const betBtn = document.getElementById("bet-btn") as HTMLButtonElement;
  const betInput = document.getElementById("bet-amount") as HTMLInputElement;
  const balanceLabel = document.getElementById("balance-label") as HTMLDivElement;
  const mineInput = document.getElementById("mine-count") as HTMLInputElement;
  const mineLabel = document.getElementById("mine-label") as HTMLDivElement;
  const rewardLabel = document.getElementById("reward-label") as HTMLDivElement;
  const rewardBanner = document.getElementById("reward-banner") as HTMLDivElement;
  const cashoutBtn = document.getElementById("cashout-btn") as HTMLButtonElement;

  // Default input values
  betInput.value = "1";
  mineInput.value = "3";

  // Positioning HTML UI relative to header/footer layout
  function positionHtmlElements() {
    const { x, y } = headerContainer;
    const headerHeight = 60;
    const footerHeight = 80;

    const style = (el: HTMLElement, left: number, top: number) => {
      el.style.position = "absolute";
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.zIndex = "2";
    };

    style(howToPlayBtn, x + 20, y + (headerHeight - 40) / 2);
    style(funLabel, x + layoutWidth / 2, y + (headerHeight - 40) / 2);
    funLabel.style.transform = "translateX(-50%)";

    style(betBtn, x + layoutWidth - 500, y + layoutHeight - footerHeight + (footerHeight - 40) / 2);
    style(betInput, x + 300, y + layoutHeight - footerHeight + (footerHeight - 40) / 2);
    style(balanceLabel, x + layoutWidth - 135, y + (headerHeight - 40) / 2);
    style(mineInput, x + 250, y + layoutHeight - footerHeight + (footerHeight - 40) / 2);
    style(mineLabel, x + 180, y + layoutHeight - footerHeight + (footerHeight - 40) / 2);
    style(rewardLabel, x + layoutWidth - 350, y + (headerHeight - 40) / 2);
    style(rewardBanner, x + layoutWidth - 291, y + (headerHeight - 40) / 2);
    style(cashoutBtn, x + layoutWidth - 520, y + layoutHeight - footerHeight + (footerHeight - 40) / 2);
  }

  // Balance management
  let balance = 3000;
  function updateBalanceDisplay() {
    balanceLabel.textContent = `$${balance.toFixed(2)}`;
  }

  updateBalanceDisplay();
  positionHtmlElements();

  // === GAME SETUP ===
  let currentGame: Game | null = new Game(3);
  scene.addChild(currentGame.container);
  currentGame.enableInteraction(false);
  centerGameGrid();

  // Center grid on screen
  function centerGameGrid() {
    if (!currentGame) return;
    const gridWidth = currentGame.container.width;
    const gridHeight = currentGame.container.height;
    currentGame.container.x = (app.screen.width - gridWidth) / 2;
    currentGame.container.y = (app.screen.height - gridHeight) / 2;
  }

  // Start game with current inputs
  function startGame() {
    cashoutBtn.disabled = false;
    cashoutBtn.classList.add("visible");

    const bet = parseFloat(betInput.value);
    const mineCount = parseInt(mineInput.value) || 3;

    if (isNaN(bet) || bet < 0.01) return alert("Enter a valid bet amount");
    if (bet > balance) return alert("Insufficient balance");
    if (mineCount < 1 || mineCount > 20) return alert("Mine count must be between 1 and 20");

    balance -= bet;
    updateBalanceDisplay();
    rewardLabel.textContent = "$0.00";

    if (currentGame) scene.removeChild(currentGame.container);

    currentGame = new Game(mineCount, (reward) => {
      balance += bet + reward;
      updateBalanceDisplay();
      alert(`You won $${reward.toFixed(2)}!`);
    }, bet);

    currentGame.onRewardUpdate = (reward) => {
      rewardLabel.textContent = `$${reward.toFixed(2)}`;
    };

    currentGame.onGameEnd = () => {
      cashoutBtn.disabled = true;
      cashoutBtn.classList.remove("visible");
      rewardLabel.textContent = "$0.00";
    };

    scene.addChild(currentGame.container);
    currentGame.enableInteraction(true);
    currentGame.isInProgress = true;
    centerGameGrid();
  }

  // === EVENT LISTENERS ===
  betBtn.addEventListener("click", startGame);

  cashoutBtn.addEventListener("click", () => {
    if (currentGame?.isInProgress) {
      currentGame.cashOut();
      cashoutBtn.disabled = true;
      cashoutBtn.classList.remove("visible");
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    drawBackground();
    centerGameGrid();
    positionHtmlElements();
  });

  // Modal: How To Play
  howToPlayBtn.addEventListener("click", () => {
    howToPlayModal.classList.remove("hidden");
  });

  closeHowToPlay.addEventListener("click", () => {
    howToPlayModal.classList.add("hidden");
  });

  window.addEventListener("click", (event) => {
    if (event.target === howToPlayModal) {
      howToPlayModal.classList.add("hidden");
    }
  });
})();
