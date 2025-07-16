import {
  Application,
  Graphics,
  Container,
  Text,
  TextStyle,
} from "pixi.js";

import { initDevtools } from "@pixi/devtools";

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
  app.canvas.style.pointerEvents = "none";

  document.body.appendChild(app.canvas);

  const scene = new Container();
  app.stage.addChild(scene);

  const background = new Graphics();

  // ✅ Separate containers for header and footer
  const headerContainer = new Container();
  const footerContainer = new Container();

  const header = new Graphics();
  const footer = new Graphics();

  headerContainer.addChild(header);
  footerContainer.addChild(footer);

  const cornerRadius = 32;

  const drawBackground = () => {
    const width = app.screen.width * 0.6;
    const height = app.screen.height * 0.6;
    const x = (app.screen.width - width) / 2;
    const y = (app.screen.height - height) / 2;

    background.clear();
    background
      .roundRect(x, y, width, height, cornerRadius)
      .fill({ color: 0x00c1ff, alpha: 0.8 })
      .stroke({ color: 0xffa500, width: 4, alpha: 1.0 });

    // ✅ Header
    const headerHeight = 60;
    header.clear();
    header.beginFill(0x007acc, 1);
    header.drawRoundedRect(0, 0, width, headerHeight, cornerRadius);
    header.endFill();

    // Position headerContainer
    headerContainer.position.set(x, y);

    // ✅ Footer
    const footerHeight = 80;
    footer.clear();
    footer.beginFill(0x005b99, 1);
    footer.drawRoundedRect(0, 0, width, footerHeight, cornerRadius);
    footer.endFill();

    // Position footerContainer
    footerContainer.position.set(x, y + height - footerHeight);
  };

  drawBackground();

  // ✅ Add order: header/footer under background
  scene.addChild(headerContainer);
  scene.addChild(footerContainer);
  scene.addChild(background);

  // Optional: redraw on resize
  window.addEventListener("resize", drawBackground);
})();
