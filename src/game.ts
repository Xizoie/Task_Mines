import { Container } from "pixi.js";
import { Cell } from "./cell";

const GRID_SIZE = 5;
const CELL_SIZE = 60;
const PADDING = 8;

export class Game {
  container: Container;
  grid: Cell[][] = []; 
  totalSafeCells: number; 
  revealedCells = 0;    
  reward = 0;            
  bet: number;           
  isInProgress = false;   

  // Callback to update reward display
  onRewardUpdate?: (reward: number) => void;

  // Callback to notify win/loss state
  onGameEnd: ((won: boolean) => void) | null = null;

  constructor(
    private mineCount: number = 3, // How many mines to place, by default 3
    private onWin?: (reward: number) => void, // Called on win or cashout
    bet: number = 0.01
  ) {
    this.bet = bet;
    this.totalSafeCells = GRID_SIZE * GRID_SIZE - mineCount;
    this.container = new Container(); // Main visual container
    this.setupGrid(); // Initialize cells
    this.enableInteraction(false); // Disabled until game starts
  }

  /**
   * Creates the grid and places mines
   */
  private setupGrid(): void {
    this.grid = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      const rowCells: Cell[] = [];

      for (let col = 0; col < GRID_SIZE; col++) {
        // Create a cell and assign reveal handler
        const cell = new Cell(col, row, CELL_SIZE, () => this.handleCellReveal(cell));
        cell.x = col * (CELL_SIZE + PADDING);
        cell.y = row * (CELL_SIZE + PADDING);
        this.container.addChild(cell);
        rowCells.push(cell);
      }

      this.grid.push(rowCells);
    }

    this.placeMines(this.mineCount);
  }

  /**
   * Randomly places mineCount mines into the grid
   */
  private placeMines(count: number): void {
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

  /**
   * Called when a cell is revealed by user
   */
  private handleCellReveal(cell: Cell): void {
    if (cell.isMine) {
      console.log("Game Over! You hit a mine.");
      this.endGame(false);
      return;
    }

    this.revealedCells++;

    // Calculate dynamic reward based on progress
    this.reward = this.bet * this.getRewardMultiplier();

    if (this.onRewardUpdate) {
      this.onRewardUpdate(this.reward);
    }

    // If all safe cells are revealed, player wins
    if (this.revealedCells === this.totalSafeCells) {
      console.log("You Win!");
      this.endGame(true);
    }
  }

  /**
   * Returns reward multiplier based on progress and mine count
   */
  private getRewardMultiplier(): number {
    const progress = this.revealedCells / this.totalSafeCells;
    const baseMultiplier = 1 + this.mineCount;
    return baseMultiplier * progress;
  }

  /**
   * Enables or disables cell interaction
   */
  enableInteraction(enable: boolean): void {
    for (const row of this.grid) {
      for (const cell of row) {
        cell.interactive = enable;
      }
    }
  }

  /**
   * Handles end of game (win or loss)
   */
  private endGame(won: boolean): void {
    this.isInProgress = false;
    this.enableInteraction(false);

    if (won && this.onWin) {
      this.onWin(this.reward);
    }

    if (this.onGameEnd) {
      this.onGameEnd(won);
    }

    // Auto-reset after 2 seconds
    setTimeout(() => this.reset(), 2000);
  }

  /**
   * Called when player cashes out manually
   */
  cashOut(): void {
    if (!this.isInProgress) return;

    this.isInProgress = false;
    this.enableInteraction(false);

    console.log(`Cashed out with reward: $${this.reward.toFixed(2)}`);

    if (this.onWin) this.onWin(this.reward);
    if (this.onGameEnd) this.onGameEnd(true);

    // Auto-reset after short delay
    setTimeout(() => this.reset(), 1500);
  }

  /**
   * Resets the game board and state
   */
  reset(): void {
    this.revealedCells = 0;
    this.reward = 0;
    this.container.removeChildren(); // Remove all cells from view
    this.setupGrid();               // Recreate board
    this.enableInteraction(false);  // Stay locked until next game
  }
}
