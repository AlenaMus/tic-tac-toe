import {Component, DoCheck, EventEmitter, OnInit, Output} from '@angular/core';
import {Cell} from './cell/cell.model';
import {GameService} from '../game.service';
import {State} from '../players/player.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

   @Output() board: Cell[][];
   emptyCells: Cell[] = [];

  constructor(private gameService: GameService) {
    this.initBoard();
  }

  ngOnInit() {
    this.gameService.startGameEvent.subscribe(
      () => {
        this.initBoard();
        console.log('in board on init and set board');
      }
    );
  }

  initBoard() {
    let k = 0;
    this.board = [];
    for (let i = 0; i < 3; i++) {
      this.board[i] = [];
      for (let j = 0; j < 3; j++) {
        this.board[i][j] = new Cell(i, j, State.N, State.N);
        this.emptyCells[k] = this.board[i][j];
        k++;
      }
    }
     this.gameService.setGameBoard(this.board, this.emptyCells);
  }

 play(chosenCell: Cell) {
       console.log('play in board to game');
       this.gameService.Move(chosenCell);
 }
}
