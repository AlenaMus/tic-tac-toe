import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RandomPlayersService} from './random-players.service';
import {Player, State} from '../players/player.model';
import {GameMode, GameService} from '../game.service';

@Component({
  selector: 'app-random-players',
  templateUrl: './random-players.component.html',
  styleUrls: ['./random-players.component.css'],
  providers: [RandomPlayersService]
})
export class RandomPlayersComponent implements OnInit {

   displayPlayers = false;
   players: Player[] = [];
   name: string;
   last: string;
   photo: string;
   gender: string;

  constructor(private randomService: RandomPlayersService, private gameService: GameService) {
    if (this.gameService.gameMode === GameMode.RandomGame) {
        this.setUsers();
        this.displayPlayers = true;
    }
  }

  ngOnInit() {
    this.gameService.startGameEvent.subscribe(
      () => {
        if (this.gameService.gameMode === GameMode.RandomGame) {
            this.setUsers();
            this.displayPlayers = true;
            this.gameService.currentPlayer = this.players[0];
        }
      }
    );
  }

 setUsers() {
    this.randomService.getRandomPlayersData().subscribe(
      (players: any) => {
          this.gender = players.results[0].gender;
          this.name = players.results[0].name.first;
          this.last = players.results[0].name.last;
          this.photo = players.results[0].picture.medium;
          this.players[0] = new Player('Human', State.X, 'assets/X.png', this.photo, this.name + ' ' + this.last, this.gender );
          this.gameService.players[0] = this.players[0];
          console.log( this.gameService.players[0]);
          this.gender = players.results[1].gender;
          this.name = players.results[1].name.first;
          this.last = players.results[1].name.last;
          this.photo = players.results[1].picture.medium;
          this.players[1] = new Player('Human', State.O, 'assets/O.png', this.photo, this.name + ' ' + this.last, this.gender );
          this.gameService.players[1] = this.players[1];
          this.gameService.currentPlayer = this.players[0];

      },
       (error) => console.log(error)
    );
 }
}
