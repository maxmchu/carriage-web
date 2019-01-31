import {
  CHECK_USER_LOGGED_IN_REQUEST,
  CHECK_USER_LOGGED_IN_SUCCESS,
  CHECK_USER_LOGGED_IN_FAILURE,
  GOOGLE_OAUTH2_REQUEST,
  GOOGLE_OAUTH2_SUCCESS,
  GOOGLE_OAUTH2_FAILURE
} from "./actionTypes";

import axios from "axios";

export function checkUserLoggedInRequest() {
  return {
    type: CHECK_USER_LOGGED_IN_REQUEST
  }
}

export function checkUserLoggedInSuccess(data: any) {
  return {
    type: CHECK_USER_LOGGED_IN_SUCCESS,
    payload: data
  }
}

export function checkUserLoggedInFailure(err: any) {
  return {
    type: CHECK_USER_LOGGED_IN_FAILURE,
    payload: err
  }
}

export function handleCheckUserLoggedInRequest() {
  return function (dispatch: any) {
    dispatch(checkUserLoggedInRequest());
    axios.get('auth/user').then(
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

export function googleOauth2Request() {
  return {
    type: GOOGLE_OAUTH2_REQUEST
  }
}

export function googleOauth2Success(data: any) {
  return {
    type: GOOGLE_OAUTH2_SUCCESS,
    payload: data
  }
}

export function googleOauth2Failure(err: any) {
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