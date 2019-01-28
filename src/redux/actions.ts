import {
  CHECK_USER_LOGGED_IN_REQUEST,
  CHECK_USER_LOGGED_IN_SUCCESS,
  CHECK_USER_LOGGED_IN_FAILURE
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
    dispatch(checkUserLoggedInRequest);
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
        console.log(json);
        dispatch(checkUserLoggedInSuccess(json));
      }
    );
  }
}
