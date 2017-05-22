import {Component, DoCheck, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from '../../game.service';
import {Cell} from './cell.model';
import {Player, State} from '../../players/player.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input() cell: Cell;
  @Output() playerMove = new EventEmitter<Cell>();
  @Input() sign: string;
   disable = true;
  constructor(private gameService: GameService) {
    console.log('from cell Constractor');
 }

  ngOnInit() {
    console.log('from cell ngIint');

       this.disable = this.gameService.isEndOfGame;
       this.gameService.startGameEvent.subscribe(
         () => this.disable = false
       );
      this.gameService.endOfGame.subscribe(
      () => {
         this.disable = true;
      }
    );
  }

  onCellCliked() {
    this.disable = this.gameService.isEndOfGame;

       if (!this.disable) {
         if (this.cell.sign === State.N) {
            this.playerMove.emit(this.cell);
            console.log('Clicked !!');
         }
       }
        console.log('end of game not Clicked !!');
      }


  getWidth(sign: string): string {
     console.log(sign);
    if (sign === 'assets/X.png') {
      return '30px';
    } else if (sign === 'assets/O.png') {
       return '50px';
    }
  }

  getClass(sign: string): string {
    if (sign === State.X) {
      return 'picX';
    } else if (sign === State.O) {
      return 'picO';
    }
  }
}
