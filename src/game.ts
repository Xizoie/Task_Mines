import { Container } from "pixi.js";
import { Cell } from "./cell";

const GRID_SIZE = 5;
const CELL_SIZE = 60;
const PADDING = 8;
const MINE_COUNT = 5;

export class Game {
  container: Container;
  grid: Cell[][] = [];
  totalSafeCells: number;
  revealedCells: number = 0;

  constructor() {
    this.container = new Container();
    this.totalSafeCells = GRID_SIZE * GRID_SIZE - MINE_COUNT;
    this.setupGrid();
    this.enableInteraction(false);
  }

  setupGrid() {
    this.grid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowCells: Cell[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const cell = new Cell(col, row, CELL_SIZE, () => this.handleCellReveal(cell));
        cell.x = col * (CELL_SIZE + PADDING);
        cell.y = row * (CELL_SIZE + PADDING);
        this.container.addChild(cell);
        rowCells.push(cell);
      }
      this.grid.push(rowCells);
    }

    this.placeMines(MINE_COUNT);
  }

  placeMines(count: number) {
    let placed = 0;
    while (placed < count) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      const cell = this.grid[r][c];
      if (!cell.isMine) {
        cell.isMine = true;
        placed++;
      }
    }
  }

  handleCellReveal(cell: Cell) {
    if (cell.isMine) {
      console.log("💥 Game Over! You hit a mine.");
      this.enableInteraction(false);

      //  Reset after 2 seconds
      setTimeout(() => this.reset(), 2000);
    } else {
      this.revealedCells++;
      if (this.revealedCells === this.totalSafeCells) {
        console.log("🎉 You Win!");
        this.enableInteraction(false);
      }
    }
  }

  enableInteraction(enable : boolean) {
    for (const row of this.grid) {
      for (const cell of row) {
        cell.interactive = enable;
      }
    }
  }

  reset() {
    this.revealedCells = 0;
    this.container.removeChildren(); // Remove old cells
    this.setupGrid(); // Rebuild
    this.enableInteraction(false);
  }
}
