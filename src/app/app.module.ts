import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CellComponent } from './board/cell/cell.component';
import { PlayersComponent } from './players/players.component';
import {GameService} from './game.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DropdownDirective} from './shared/dropdown.directive';
import {HighlightDirective} from './shared/highlight.directive';
import { RandomPlayersComponent } from './random-players/random-players.component';
import {RandomPlayersService} from './random-players/random-players.service';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CellComponent,
    PlayersComponent,
    DropdownDirective,
    HighlightDirective,
    RandomPlayersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule
  ],
  providers: [GameService, RandomPlayersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
