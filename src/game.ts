import { Container } from "pixi.js";
import { Cell } from "./cell";

const GRID_SIZE = 5;
const CELL_SIZE = 64;
const PADDING = 8;

export class Game {
  container: Container;
  grid: Cell[][] = [];

  constructor() {
    this.container = new Container();
    this.setupGrid();
  }

  setupGrid() {
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowCells: Cell[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const cell = new Cell(col, row, CELL_SIZE);
        cell.x = col * (CELL_SIZE + PADDING);
        cell.y = row * (CELL_SIZE + PADDING);
        this.container.addChild(cell);
        rowCells.push(cell);
      }
      this.grid.push(rowCells);
    }

    this.placeMines(5); // place 5 mines randomly
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
}
