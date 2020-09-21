import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as RecipesActions from './recipes.actions';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipesEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => this.http.get<Recipe[]>('https://ng-recipe-book-4d6a9.firebaseio.com/recipes.json')),
    map(recipes => recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      })
    ),
    map(recipes => new RecipesActions.SetRecipes(recipes))
  );

  @Effect({dispatch: false})
  saveRecipes = this.actions$.pipe(
    ofType(RecipesActions.SAVE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, state]) =>
      this.http.put('https://ng-recipe-book-4d6a9.firebaseio.com/recipes.json', state.recipes)
    )
  )

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {
  }
}
