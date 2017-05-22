import {Component, DoCheck, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Player} from './player.model';
import {GameMode, GameService} from '../game.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  @Output() playerX: Player;
  @Output() playerO: Player;
  @Output() displayME = false;

  constructor(private gameService: GameService) {
      this.displayME = false;
  }

  ngOnInit() {
    this.gameService.startGameEvent.subscribe(
      () => {
             this.displayME = true;
      }
    );

    this.gameService.setPlayers.subscribe(
      (players: Player[]) => {
        this.playerX = players[0];
        this.playerO = players[1];
        this.displayME = true;
      });
  }

}

