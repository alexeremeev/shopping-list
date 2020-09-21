import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import {map} from 'rxjs/operators';
import * as RecipesActions from '../store/recipes.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private storeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }


  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDesc = '';
    const recipeIngredients = new FormArray([]);
    if (this.editMode) {
      this.storeSub = this.store.select('recipes').pipe(
        map(state => state.recipes.find((r, index) => this.id === index))
      ).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDesc = recipe.description;
        if (recipe.ingredients) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            }));
          }
        }
      })
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDesc, Validators.required),
      ingredients: recipeIngredients
    });
  }

  get controls() {
    return (<FormArray> this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray> this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, recipe: this.recipeForm.value}))
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value))
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (<FormArray> this.recipeForm.get('ingredients')).removeAt(index);
  }
}
