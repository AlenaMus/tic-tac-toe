import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/Rx';

@Injectable()export class RandomPlayersService {

 randomApi = 'https://randomuser.me/api/?results=2';

  constructor(private http: Http) {

  }

  getRandomPlayersData(): any {
    return this.http.get(this.randomApi).map(
      (response: Response) => {
        const players = response.json();
        return players;
      }
    );
  }

}
