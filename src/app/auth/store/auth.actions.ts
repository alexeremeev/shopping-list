import {Action} from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const LOGOUT = '[Auth] Logout';
export const SIGN_UP_START = '[Auth] Sign Up Start';
export const HANDLE_ERROR = '[Auth] Handle Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date
    }
  ) {
  }

}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {
    email: string;
    password: string;
  }) {
  }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {
  }
}

export class SignUpStart implements Action {
  readonly type = SIGN_UP_START;

  constructor(public payload: {
    email: string;
    password: string;
  }) {
  }
}

export class HandleError implements Action {
  readonly type = HANDLE_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignUpStart
  | HandleError
  | AutoLogin;
