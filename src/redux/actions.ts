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
  GOOGLE_OAUTH2_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  FETCH_LOCATIONS_REQUEST,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_LOCATIONS_FAILURE,
  REQUEST_RIDE_REQUEST,
  REQUEST_RIDE_SUCCESS,
  REQUEST_RIDE_FAILURE,
  RESET_REQUEST_RIDE_FORM,
  FETCH_UPCOMING_RIDES_REQUEST,
  FETCH_UPCOMING_RIDES_SUCCESS,
  FETCH_UPCOMING_RIDES_FAILURE,
  FETCH_PAST_RIDES_REQUEST,
  FETCH_PAST_RIDES_SUCCESS,
  RESET_RIDES_STATE,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,
  FETCH_DAY_UPCOMING_RIDES_REQUEST,
  FETCH_DAY_UPCOMING_RIDES_SUCCESS,
  FETCH_DAY_UPCOMING_RIDES_FAILURE,
  FETCH_ALL_RIDES_FOR_DAY_REQUEST,
  FETCH_ALL_RIDES_FOR_DAY_SUCCESS,
  FETCH_ALL_RIDES_FOR_DAY_FAILURE,
  FETCH_ALL_REQUESTS_FOR_DAY_REQUEST,
  FETCH_ALL_REQUESTS_FOR_DAY_SUCCESS,
  FETCH_ALL_REQUESTS_FOR_DAY_FAILURE
} from "./actionTypes";

import axios from "axios";
import { RideRequest } from "../types";
import { sortBy } from "lodash";

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

export function logoutRequest(): IAction {
  return {
    type: LOGOUT_REQUEST
  }
}

export function logoutSuccess(data): IAction {
  return {
    type: LOGOUT_SUCCESS,
    payload: data
  }
}

export function logoutFailure(err): IAction {
  return {
    type: LOGOUT_FAILURE,
    payload: err
  }
}

export function handleLogoutRequest() {
  return function (dispatch: any) {
    dispatch(logoutRequest());
    dispatch(resetRidesState());
    axios.post('/auth/logout').then(
      response => {
        dispatch(logoutSuccess(response.data));
      },
      error => {
        console.error("An error occurred: ", error);
        dispatch(logoutFailure(error));
      }
    );
  }
}

export function fetchLocationsRequest(): IAction {
  return {
    type: FETCH_LOCATIONS_REQUEST
  }
}

export function fetchLocationsSuccess(data: any): IAction {
  return {
    type: FETCH_LOCATIONS_SUCCESS,
    payload: data
  }
}

export function fetchLocationsFailure(err: any): IAction {
  return {
    type: FETCH_LOCATIONS_FAILURE,
    payload: err
  }
}

export function handleFetchLocationsRequest() {
  return function (dispatch: any) {
    dispatch(fetchLocationsRequest());
    axios.get('/db/locations').then(
      response => {
        if (response.data.err) {
          console.error("An error occurred: ", response.data.err);
          dispatch(fetchLocationsFailure(response.data.err));
        } else {
          dispatch(fetchLocationsSuccess(response.data));
        }
      },
      err => {
        console.error("An error occurred: ", err);
        dispatch(fetchLocationsFailure(err));
      }
    )
  }
}

export function requestRideRequest(data: RideRequest): IAction {
  return {
    type: REQUEST_RIDE_REQUEST,
    payload: data
  }
}

export function requestRideSuccess(data): IAction {
  return {
    type: REQUEST_RIDE_SUCCESS,
    payload: data
  }
}

export function requestRideFailure(err): IAction {
  return {
    type: REQUEST_RIDE_FAILURE,
    payload: err
  }
}

export function handleRequestRideRequest(data: RideRequest) {
  return function (dispatch: any) {
    dispatch(requestRideRequest(data));
    axios.post('/rides/request', data).then(
      response => {
        if (response.data.err) {
          dispatch(requestRideFailure(response.data.err));
          console.error("An error occurred: ", response.data.err);
        } else {
          dispatch(requestRideSuccess(response.data));
        }
      },
      err => {
        dispatch(requestRideFailure(err));
        console.error("An error occurred: ", err);
      }
    );
  }
}

export function resetRequestRideForm() {
  return function (dispatch: any) {
    dispatch({ type: RESET_REQUEST_RIDE_FORM });
  }
}

export function fetchUpcomingRidesRequest(data): IAction {
  return {
    type: FETCH_UPCOMING_RIDES_REQUEST,
    payload: data
  };
}

export function fetchUpcomingRidesSuccess(data): IAction {
  return {
    type: FETCH_UPCOMING_RIDES_SUCCESS,
    payload: data
  };
}

export function fetchUpcomingRidesFailure(err): IAction {
  return {
    type: FETCH_UPCOMING_RIDES_FAILURE,
    payload: err
  };
}

export function handleFetchUpcomingRidesRequest(data) {
  return function (dispatch) {
    dispatch(fetchUpcomingRidesRequest(data));
    axios.post('/rides/upcoming', data).then(
      response => {
        if (response.data.err) {
          dispatch(fetchUpcomingRidesFailure(response.data.err));
          console.error("An error occurred: ", response.data.err);
        } else {
          dispatch(fetchUpcomingRidesSuccess(response.data));
        }
      },
      err => {
        dispatch(fetchUpcomingRidesFailure(err));
        console.error("An error occurred: ", err);
      }
    );
  }
}

export function fetchPastRidesRequest(data): IAction {
  return {
    type: FETCH_PAST_RIDES_REQUEST,
    payload: data
  };
}

export function fetchPastRidesSuccess(data): IAction {
  return {
    type: FETCH_PAST_RIDES_SUCCESS,
    payload: data
  };
}

export function fetchPastRidesFailure(err): IAction {
  return {
    type: FETCH_LOCATIONS_FAILURE,
    payload: err
  }
}

export function handleFetchPastRidesRequest(data) {
  return function (dispatch) {
    dispatch(fetchPastRidesRequest(data));
    axios.post('/rides/past', data).then(
      response => {
        if (response.data.err) {
          dispatch(fetchPastRidesFailure(response.data.err));
          console.error("An error occurred: ", response.data.err);
        } else {
          dispatch(fetchPastRidesSuccess(response.data));
        }
      },
      err => {
        dispatch(fetchPastRidesFailure(err));
        console.error("An error occurred: ", err);
      }
    );
  }
}

export function resetRidesState(): IAction {
  return {
    type: RESET_RIDES_STATE
  }
}

export function profileUpdateRequest(data): IAction {
  return {
    type: PROFILE_UPDATE_REQUEST,
    payload: data
  }
}

export function profileUpdateSuccess(data): IAction {
  return {
    type: PROFILE_UPDATE_SUCCESS,
    payload: data
  }
}

export function profileUpdateFailure(err): IAction {
  return {
    type: PROFILE_UPDATE_FAILURE,
    payload: err
  }
}

export function handleProfileUpdateRequest(data) {
  return function (dispatch) {
    dispatch(profileUpdateRequest(data));
    axios.post('/profile/update', data).then(
      response => {
        if (response.data.err) {
          dispatch(profileUpdateFailure(response.data.err));
          console.error("An error occurred: ", response.data.err);
        } else {
          dispatch(profileUpdateSuccess(response.data));
        }
      },
      err => {
        dispatch(profileUpdateFailure(err));
        console.error("An error occurred: ", err);
      }
    );
  }
}

export function fetchDayUpcomingRidesRequest(): IAction {
  return {
    type: FETCH_DAY_UPCOMING_RIDES_REQUEST
  }
}

export function fetchDayUpcomingRidesSuccess(data): IAction {
  return {
    type: FETCH_DAY_UPCOMING_RIDES_SUCCESS,
    payload: data
  }
}

export function fetchDayUpcomingRidesFailure(err): IAction {
  return {
    type: FETCH_DAY_UPCOMING_RIDES_FAILURE,
    payload: err
  }
}

export function handleFetchDayUpcomingRidesRequest() {
  return function (dispatch) {
    dispatch(fetchDayUpcomingRidesRequest());
    axios.post('/rides/allUpcomingForDay', {}).then(
      response => {
        if (response.data.err) {
          dispatch(fetchDayUpcomingRidesFailure(response.data.err));
          console.error("An error occurred: ", response.data.err);
        } else {
          dispatch(fetchDayUpcomingRidesSuccess(response.data));
        }
      },
      err => {
        dispatch(fetchDayUpcomingRidesFailure(err));
      }
    );
  }
}

export function fetchAllRidesForDayRequest(data): IAction {
  return {
    type: FETCH_ALL_RIDES_FOR_DAY_REQUEST,
    payload: data
  };
}

export function fetchAllRidesForDaySuccess(data): IAction {
  return {
    type: FETCH_ALL_RIDES_FOR_DAY_SUCCESS,
    payload: data
  };
}

export function fetchAllRidesForDayFailure(err): IAction {
  return {
    type: FETCH_ALL_RIDES_FOR_DAY_FAILURE,
    payload: err
  }
}

export function handleFetchAllRidesForDayRequest(data) {
  return function (dispatch) {
    dispatch(fetchAllRidesForDayRequest(data));
    axios.post('/rides/allForDay', { requestedDate: data }).then(
      response => {
        if (response.data.err) {
          dispatch(fetchAllRidesForDayFailure(response.data.err));
          console.error("An error occurred: ", response.data.err);
        } else {
          const rides = sortBy(response.data, ['pickupTime', 'pickupLocationString'])
          dispatch(fetchAllRidesForDaySuccess(rides));
        }
      },
      err => {
        dispatch(fetchAllRidesForDayFailure(err));
      }
    );
  }
}

export function fetchAllRequestsForDayRequest(data): IAction {
  return {
    type: FETCH_ALL_REQUESTS_FOR_DAY_REQUEST,
    payload: data
  };
}

export function fetchAllRequestsForDaySuccess(data): IAction {
  return {
    type: FETCH_ALL_REQUESTS_FOR_DAY_SUCCESS,
    payload: data
  };
}

export function fetchAllRequestsForDayFailure(err): IAction {
  return {
    type: FETCH_ALL_REQUESTS_FOR_DAY_FAILURE,
    payload: err
  };
}

export function handleFetchAllRequestsForDayRequest(data) {
  return function (dispatch) {
    dispatch(fetchAllRequestsForDayRequest(data));
    axios.post('/rides/allRequestsForDay', { requestedDate: data }).then(
      response => {
        if (response.data.err) {
          dispatch(fetchAllRequestsForDayFailure(response.data.err));
          console.error("An error occurred: ", response.data.err);
        } else {
          const rides = sortBy(response.data, ['pickupTime', 'pickupLocationString']);
          dispatch(fetchAllRequestsForDaySuccess(rides));
        }
      },
      err => {
        dispatch(fetchAllRequestsForDayFailure(err));
      }
    );
  }
}
