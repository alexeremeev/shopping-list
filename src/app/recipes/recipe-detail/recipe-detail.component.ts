import {Component, OnInit} from '@angular/core';

import {Recipe} from '../recipe.model';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params.pipe(
      map(params => +params['id']),
      switchMap( (id: number) => {
        this.id = id;
        return this.store.select('recipes')
      }),
      map(state => state.recipes.find((r, index) => this.id === index))
    ).subscribe(recipe => this.recipe = recipe);
  }

  addToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onRecipeDelete() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
