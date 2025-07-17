import { Graphics } from "pixi.js";

export class Cell extends Graphics {
  isMine = false;
  isRevealed = false;
  gridX: number;
  gridY: number;
  size: number;

  constructor(x: number, y: number, size: number, onReveal: () => void) {
    super();
    this.gridX = x;
    this.gridY = y;
    this.size = size;
    this.interactive = true;
    this.cursor = "pointer";
    this.drawCell();

    this.on("pointertap", () => {
      if (!this.isRevealed) {
        this.reveal();
        onReveal();
      }
    });
}


  drawCell() {
    this.clear();
    this.beginFill(0x0033cc); // a nice medium blue
    this.drawRect(0, 0, this.size, this.size);
    this.endFill();
  }

  reveal() {
    if (this.isRevealed) return;
    this.isRevealed = true;

    this.clear();
    this.beginFill(this.isMine ? 0xff0000 : 0x88cc88);
    this.drawRect(0, 0, this.size, this.size);
    this.endFill();
  }
}
