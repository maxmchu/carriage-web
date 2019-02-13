import { REQUEST_RIDE_REQUEST, REQUEST_RIDE_SUCCESS, REQUEST_RIDE_FAILURE } from '../actionTypes';

const initialState = {
  rideSubmitted: false,
  requestingRide: false,
  rideSubmitErrMsg: ""
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
        rideSubmitErrMsg: ""
      }

    default:
      return state;

  }
}

export default ridesReducer;
