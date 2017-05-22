import {Component, Input, OnInit, Output} from '@angular/core';
import {GameMode, GameService} from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gameTitle = '';
  isEndOfGame: boolean;
  @Output() message = '';
  gameStarted = false;
  gameMode: GameMode;
  @Input() randomPlayersDisplay;
  @Output() show = false;

  constructor(private gameService: GameService) {
     this.isEndOfGame = this.gameService.isEndOfGame;
     this.message = this.gameService.userMessage;
     this.randomPlayersDisplay = false;
  }

  ngOnInit() {

    this.gameService.startGameEvent.subscribe(
      () => {
        if (this.gameMode === GameMode.BasicGame) {
            this.randomPlayersDisplay = false;
        }
      }
    );
    this.isEndOfGame = this.gameService.isEndOfGame;
    this.message = this.gameService.userMessage;
    this.gameService.endOfGame.subscribe(
      () => {
        this.isEndOfGame = true;
      }
    );
    this.gameService.messageEvent.subscribe(
      (message: string) => {
        this.message = message;
      }
    );
  }

  playBasic(mode: string) {
    this.gameTitle = mode;
    if (mode === 'BasicGame') {
        this.gameMode = GameMode.BasicGame;
    }
    if ( mode === 'ComputerGame') {
      this.gameMode = GameMode.ComputerGame;
    }
    if ( mode === 'RandomGame') {
        this.gameMode = GameMode.RandomGame;
        this.randomPlayersDisplay = true;
    }else {
        this.randomPlayersDisplay = false;
    }
     this.gameStarted = true;
    setTimeout(() => { this.gameService.startGame(this.gameMode); } , 100);

  }

}
