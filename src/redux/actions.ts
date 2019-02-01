import {
  CHECK_USER_LOGGED_IN_REQUEST,
  CHECK_USER_LOGGED_IN_SUCCESS,
  CHECK_USER_LOGGED_IN_FAILURE,
  LOCAL_LOGIN_REQUEST,
  LOCAL_LOGIN_SUCCESS,
  LOCAL_LOGIN_FAILURE,
  LOCAL_REGISTER_REQUEST,
  LOCAL_REGISTER_SUCCESS,
  LOCAL_REGISTER_FAILURE,
  GOOGLE_OAUTH2_REQUEST,
  GOOGLE_OAUTH2_SUCCESS,
  GOOGLE_OAUTH2_FAILURE
} from "./actionTypes";

import axios from "axios";

interface IAction {
  type: string;
  payload?: any;
}

export function checkUserLoggedInRequest(): IAction {
  return {
    type: CHECK_USER_LOGGED_IN_REQUEST
  }
}

export function checkUserLoggedInSuccess(data: any): IAction {
  return {
    type: CHECK_USER_LOGGED_IN_SUCCESS,
    payload: data
  }
}

export function checkUserLoggedInFailure(err: any): IAction {
  return {
    type: CHECK_USER_LOGGED_IN_FAILURE,
    payload: err
  }
}

export function handleCheckUserLoggedInRequest() {
  return function (dispatch: any) {
    dispatch(checkUserLoggedInRequest());
    return axios.get('/auth/user').then(
      response => {
        return response.data;
      },
      error => {
        console.error("An error occurred: ", error);
        dispatch(checkUserLoggedInFailure(error));
      }
    ).then(
      json => {
        dispatch(checkUserLoggedInSuccess(json));
      }
    );
  }
}

export function localLoginRequest(data): IAction {
  return {
    type: LOCAL_LOGIN_REQUEST,
    payload: data
  }
}

export function localLoginReturned(data: any): IAction {
  return {
    type: LOCAL_LOGIN_SUCCESS,
    payload: data
  }
}

export function localLoginError(err: any): IAction {
  return {
    type: LOCAL_LOGIN_FAILURE,
    payload: err
  }
}

export function handleLocalLoginRequest(data: any) {
  return function (dispatch: any) {
    dispatch(localLoginRequest(data));
    axios.post('/auth/login', data).then(
      response => {
        console.log("RESPONSE::")
        console.log(response.data);
        if (!response.data.err) {
          dispatch(localLoginReturned(response.data));
        } else {
          dispatch(localLoginError(response.data))
        }
      },
      error => {
        console.error("An error occurred: ", error);
        dispatch(localLoginError(error));
      })
  }
}

export function localRegisterRequest(data): IAction {
  return {
    type: LOCAL_REGISTER_REQUEST,
    payload: data
  }
}

export function localRegisterReturned(data): IAction {
  return {
    type: LOCAL_REGISTER_SUCCESS,
    payload: data
  }
}

export function localRegisterError(err): IAction {
  return {
    type: LOCAL_REGISTER_FAILURE,
    payload: err
  }
}

export function handleLocalRegisterRequest(data) {
  return function (dispatch: any) {
    dispatch(localRegisterRequest(data));
    axios.post('/auth/signup', data).then(
      response => {
        if (!response.data.err) {
          dispatch(localRegisterReturned(response.data));
        } else {
          dispatch(localRegisterError(response.data));
        }
      },
      error => {
        console.error("An error occurred: ", error);
        dispatch(localRegisterError(error));
      }
    );
  }
}

export function googleOauth2Request(): IAction {
  return {
    type: GOOGLE_OAUTH2_REQUEST
  }
}

export function googleOauth2Success(data: any): IAction {
  return {
    type: GOOGLE_OAUTH2_SUCCESS,
    payload: data
  }
}

export function googleOauth2Failure(err: any): IAction {
  return {
    type: GOOGLE_OAUTH2_FAILURE,
    payload: err
  }
}

export function handleGoogleOauth2Request() {
  return function (dispatch: any) {
    dispatch(googleOauth2Request());
    axios.get('/auth/google').then(
      response => {
        dispatch(googleOauth2Success(response.data));
      },
      error => {
        console.error("An error occurred: ", error);
        dispatch(googleOauth2Failure(error));
      }
    );
  }
}