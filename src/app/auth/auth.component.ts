import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      return;
    } else {
      this.authService.signUp(email, password).subscribe(response => {
          console.log(response);
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
          console.log(error);
          this.error = 'An error occurred!';
        }
      )
    }
    form.reset();
  }
}