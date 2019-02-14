import { REQUEST_RIDE_REQUEST, REQUEST_RIDE_SUCCESS, REQUEST_RIDE_FAILURE, RESET_REQUEST_RIDE_FORM, FETCH_UPCOMING_RIDES_REQUEST, FETCH_UPCOMING_RIDES_SUCCESS, FETCH_UPCOMING_RIDES_FAILURE } from '../actionTypes';

const initialState = {
  rideSubmitted: false,
  requestingRide: false,
  rideSubmitErrMsg: "",
  upcomingRides: [],
  fetchingUpcomingRides: false,
  fetchingUpcomingRidesErrMsg: ""
};

const ridesReducer = (state = initialState, action) => {
  switch (action.type) {

    case REQUEST_RIDE_REQUEST:
      return {
        ...state,
        requestingRide: true,
        rideSubmitErrMsg: ""
      };

    case REQUEST_RIDE_SUCCESS:
      return {
        ...state,
        requestingRide: false,
        rideSubmitted: true,
        rideSubmitErrMsg: ""
      }

    case REQUEST_RIDE_FAILURE:
      return {
        ...state,
        requestingRide: false,
        rideSubmitted: false,
        rideSubmitErrMsg: action.payload.err
      }

    case RESET_REQUEST_RIDE_FORM:
      return {
        ...state,
        requestingRide: false,
        rideSubmitted: false,
        rideSubmitErrMsg: ""
      }

    case FETCH_UPCOMING_RIDES_REQUEST:
      return {
        ...state,
        upcomingRides: [],
        fetchingUpcomingRides: true,
        fetchingUpcomingRidesErrMsg: ""
      }

    case FETCH_UPCOMING_RIDES_SUCCESS:
      return {
        ...state,
        upcomingRides: action.payload,
        fetchingUpcomingRides: false,
        fetchingUpcomingRidesErrMsg: ""
      }

    case FETCH_UPCOMING_RIDES_FAILURE:
      return {
        ...state,
        upcomingRides: [],
        fetchingUpcomingRides: false,
        fetchingUpcomingRidesErrMsg: action.payload.err
      }

    default:
      return state;

  }
}

export default ridesReducer;
