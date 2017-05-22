
import {Player, State} from './players/player.model';
import {Cell} from './board/cell/cell.model';
import {EventEmitter, Injectable, Output} from '@angular/core';

export enum GameMode {
  'BasicGame',
  'ComputerGame',
  'RandomGame'
}

@Injectable() export class GameService {

  @Output() isEndOfGame: boolean;
  gameMode: GameMode;
  winner: Player;
  gameBoard: Cell[][];
  players: Player[] = [];
  currentPlayer: Player;
  userMessage = '';
  isDraw = false;
  messageEvent = new EventEmitter<string>();
  setPlayers = new EventEmitter<Player[]>();
  endOfGame = new EventEmitter();
  startGameEvent = new EventEmitter();
  turnNum = 0;
  gameStarted = false;
  emptyCells: Cell[] ;
  changePlayersView = new EventEmitter<boolean>();

  constructor() {
    this.isEndOfGame = false;
  }

  initPlayers() {
    if (this.gameMode === GameMode.ComputerGame) {
        this.players[0] = new Player('Human', State.X, 'assets/X.png', '', '', '');
        this.players[1] = new Player('Computer', State.O, 'assets/O.png', '', '', '');
        this.setPlayers.emit(this.players);
         this.changePlayersView.emit(false);
      } else {
        if (this.gameMode === GameMode.BasicGame) {
        this.players[0] = new Player('Human', State.X, 'assets/X.png', '', '', '');
        this.players[1] = new Player('Human', State.O, 'assets/O.png', '', '', '');
        this.setPlayers.emit(this.players);
          this.changePlayersView.emit(false);
      }
    }
    console.log('players emit');
  }

  startGame(gameMode: GameMode) {
    this.gameMode = gameMode;
    this.startGameEvent.emit();
    this.isEndOfGame = false;
    this.gameStarted = true;
    this.initPlayers();
    this.currentPlayer = this.players[0];
    this.messageEvent.emit('Current Player is X');
  }

  setGameBoard(board: Cell[][], emptyCells: Cell[]) {
    this.gameBoard = board;
    this.emptyCells = emptyCells;
  }

  checkRow(row): boolean {
    return ((this.gameBoard[row][0].value === this.gameBoard[row][1].value &&
      this.gameBoard[row][1].value === this.gameBoard[row][2].value) &&
      this.gameBoard[row][2].value !== State.N);
  }
  checkColumn(col): boolean {
    return ((this.gameBoard[0][col].value === this.gameBoard[1][col].value &&
    this.gameBoard[1][col].value === this.gameBoard[2][col].value) &&
    this.gameBoard[2][col].value !== State.N);
  }
  checkDiagonals(): boolean {
    return ((((this.gameBoard[0][0].value === this.gameBoard[1][1].value &&
    this.gameBoard[1][1].value === this.gameBoard[2][2].value ) &&
    this.gameBoard[2][2].value !== State.N )) || ((this.gameBoard[0][2].value === this.gameBoard[1][1].value &&
    this.gameBoard[1][1].value === this.gameBoard[2][0].value) &&
    this.gameBoard[2][0].value !== State.N ));
  }

  checkWinner (row: number, col: number): string {
   if (this.checkRow(row) || this.checkColumn(col) || this.checkDiagonals()) {
     this.winner = this.currentPlayer;
     return this.currentPlayer.sign;
   }else {
     return '';
   }
  }

  checkEndGame(row: number, col: number): boolean {
   return ((this.checkWinner(row, col) !== '') || (this.isADraw()));
  }

  isADraw(): boolean {
    this.isDraw = true;
    for ( let i = 0 ; i < 3; i++) {
      for ( let j = 0; j < 3; j++) {
        if (this.gameBoard[i][j].value === State.N) {
            this.isDraw = false;
        }
      }
    }
    return this.isDraw;
  }

   Move(cell: Cell) {
       this.updateBoard(cell);
       this.currentPlayer.score++;
       this.changeTurn(cell.row, cell.col);
   }

  updateBoard(cell: Cell) {
    console.log(this.currentPlayer.value);
    this.gameBoard[cell.row][cell.col].value = this.currentPlayer.value;
    this.gameBoard[cell.row][cell.col].sign = this.currentPlayer.sign;
    const i = this.emptyCells.indexOf(this.gameBoard[cell.row][cell.col]);
    if ( i >= 0) {
      this.emptyCells.splice(i, 1);
    }
  }

  changeTurn(row: number, col: number) {
    this.isEndOfGame = this.checkEndGame(row, col);
    if (!this.isEndOfGame) {
      if (this.currentPlayer.sign === State.X) {
          this.currentPlayer = this.players[1];
          this.showCurrentPlayer();
         if (this.currentPlayer.type === 'Computer') {
           setTimeout(this.makeComputerMove(State.O, State.X), 80);
         }
      } else {
           this.currentPlayer = this.players[0];
           this.showCurrentPlayer();
        }
      } else if (this.isDraw) {
        this.messageEvent.emit('End Of Game !!! It is a Draw !');
        this.setEndOfGame();
      } else {
        this.messageEvent.emit('End Of Game !!!' + this.winner.sign + ' wins');
        this.setEndOfGame();
      }
      this.turnNum++;
    }


  setEndOfGame() {
    this.isEndOfGame = true;
    this.gameStarted = false;
    this.endOfGame.emit();
  }

  showCurrentPlayer() {
    if (this.currentPlayer.sign === State.X) {
      this.messageEvent.emit('Current Player is X');
    } else if (this.currentPlayer.sign === State.O) {
      this.messageEvent.emit('Current Player is O');
    }
  }

  makeComputerMove(mySign: string, oppSign: string) {
     let cell;
     cell = this.findComputerMove(mySign, oppSign);
     this.Move(cell);
  }

  findComputerMove(mySign: string, oppSign: string): Cell {
    let sq;
    sq = this.checkWinTriple(mySign);
    if (sq != null) {
      return sq;
    } else {
       sq = this.checkWinTriple(oppSign);
       if (sq != null) {
          return sq;
      } else {
         sq = this.findFork(mySign);
         if (sq != null) {
           return sq;
         } else {
           sq = this.findFork(oppSign);
           if (sq != null) {
             return sq;
           } else {
             sq = this.findCornerOrCenter();
             if (sq != null) {
               return sq;
             } else {
               sq = this.findEmptyCellToMove();
                return sq;
             }
           }
         }
       }
    }
  }

  findEmptyCellToMove(): Cell {
    if (this.emptyCells.length > 0) {
      return this.emptyCells.pop();
    }
  }

   findFork(mySign: string): Cell {
    if (this.gameBoard[0][0].sign === State.N && (this.gameBoard[1][1].sign === mySign || this.gameBoard[2][2].sign === mySign)) {
      return this.gameBoard[0][0];
    }
    if (this.gameBoard[2][2].sign === State.N && (this.gameBoard[0][0].sign === mySign || this.gameBoard[1][1].sign === mySign)) {
      return this.gameBoard[2][2];
    }
     if (this.gameBoard[1][1].sign === State.N && (this.gameBoard[0][0].sign === mySign || this.gameBoard[2][2].sign === mySign)) {
       return this.gameBoard[2][2];
     }
     if (this.gameBoard[0][1].sign === State.N && (this.gameBoard[0][2].sign === mySign || this.gameBoard[1][1].sign === mySign)) {
       return this.gameBoard[0][1];
     }
     if (this.gameBoard[0][2].sign === State.N && (this.gameBoard[0][1].sign === mySign || this.gameBoard[1][1].sign === mySign)) {
       return this.gameBoard[0][2];
     }
     return null;
  }

  checkWinTriple(sign: string): Cell {
    let cell;
    for (let i = 0 ; i < 3; i++) {
       cell = this.checkRowMove(i, sign);
       if (cell != null) {
         return cell;
       }
    }
    for (let i = 0 ; i < 3; i++) {
      cell = this.checkColMove(i, sign);
      if (cell != null) {
        return cell;
      }
    }
    cell = this.checkLeftDiagonal(sign);
    if (cell != null) {
        return cell;
     }
     cell = this.checkRightDiagonal(sign);
    if (cell != null) {
       return cell;
     }
    return null;
  }


 checkRowMove(row: number, sign: string): Cell {
    if (this.gameBoard[row][0].sign === State.N && this.gameBoard[row][1].sign === sign && this.gameBoard[row][2].sign === sign)  {
        return this.gameBoard[row][0];
    } else if (this.gameBoard[row][1].sign === State.N && this.gameBoard[row][0].sign === sign && this.gameBoard[row][2].sign === sign) {
      return this.gameBoard[row][1];
    }else if (this.gameBoard[row][2].sign === State.N && this.gameBoard[row][0].sign === sign && this.gameBoard[row][1].sign === sign) {
         return this.gameBoard[row][2];
    } else {
       return null;
    }
  }

 checkColMove(col: number, sign: string): Cell {
    if (this.gameBoard[0][col].sign === State.N && this.gameBoard[1][col].sign === sign && this.gameBoard[2][col].sign === sign)  {
       return this.gameBoard[0][col];
    } else if (this.gameBoard[1][col].sign === State.N && this.gameBoard[0][col].sign === sign && this.gameBoard[2][col].sign === sign) {
       return this.gameBoard[1][col];
    }else if (this.gameBoard[2][col].sign === State.N && this.gameBoard[0][col].sign === sign && this.gameBoard[1][col].sign === sign) {
      return this.gameBoard[2][col];
    } else {
      return null;
    }
  }

 checkLeftDiagonal(sign: string): Cell {
    if (this.gameBoard[0][0].sign === State.N && this.gameBoard[1][1].sign === sign && this.gameBoard[2][2].sign === sign) {
        return this.gameBoard[0][0];
    }else if (this.gameBoard[0][0].sign === sign && this.gameBoard[1][1].sign === State.N && this.gameBoard[2][2].sign === sign) {
      return this.gameBoard[1][1];
    }else if (this.gameBoard[0][0].sign === sign && this.gameBoard[1][1].sign === sign && this.gameBoard[2][2].sign === State.N ) {
      return this.gameBoard[2][2];
    } else {
      return null;
    }
}

  checkRightDiagonal(sign: string): Cell {
    if (this.gameBoard[0][2].sign === State.N && this.gameBoard[1][1].sign === sign && this.gameBoard[2][0].sign === sign) {
      return this.gameBoard[0][2];
    }else if (this.gameBoard[0][2].sign === sign && this.gameBoard[1][1].sign === State.N && this.gameBoard[2][0].sign === sign) {
      return this.gameBoard[1][1];
    }else if (this.gameBoard[0][0].sign === sign && this.gameBoard[1][1].sign === sign && this.gameBoard[2][0].sign === State.N ) {
      return this.gameBoard[2][0];
    } else {
      return null;
    }
  }


  findCornerOrCenter(): Cell {
    if (this.gameBoard[1][1].sign === State.N) {
      return this.gameBoard[1][1];
    }
    if (this.gameBoard[0][0].sign === State.N) {
      return this.gameBoard[0][0];
    }
    if (this.gameBoard[2][2].sign === State.N) {
       return this.gameBoard[2][2];
    }
    if (this.gameBoard[0][2].sign === State.N) {
      return this.gameBoard[0][1];
    }
    if (this.gameBoard[2][0].sign === State.N) {
      return this.gameBoard[2][0];
    }
    return null;
  }
}
