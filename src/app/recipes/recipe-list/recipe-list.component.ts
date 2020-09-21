import {Component, OnDestroy, OnInit} from '@angular/core';

import {Recipe} from '../recipe.model';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesChanged: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.recipesChanged = this.store.select('recipes').subscribe(state => this.recipes = state.recipes);
  }

  ngOnDestroy(): void {
    this.recipesChanged.unsubscribe();
  }
}
