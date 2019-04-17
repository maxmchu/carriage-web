import {
  FETCH_DAY_UPCOMING_RIDES_REQUEST,
  FETCH_DAY_UPCOMING_RIDES_SUCCESS,
  FETCH_DAY_UPCOMING_RIDES_FAILURE,
  FETCH_ALL_RIDES_FOR_DAY_REQUEST,
  FETCH_ALL_RIDES_FOR_DAY_SUCCESS,
  FETCH_ALL_RIDES_FOR_DAY_FAILURE,
  FETCH_ALL_REQUESTS_FOR_DAY_REQUEST,
  FETCH_ALL_REQUESTS_FOR_DAY_SUCCESS,
  FETCH_ALL_REQUESTS_FOR_DAY_FAILURE,
  UPDATE_RIDES_REQUEST,
  UPDATE_RIDES_SUCCESS,
  UPDATE_RIDES_FAILURE
} from '../actionTypes';
import { Ride } from '../../types';
import { string } from 'prop-types';

interface IDispatcherRidesState {
  upcomingRidesForDay: Ride[];
  fetchingUpcomingRidesForDay: boolean;
  upcomingRidesForDayErrMsg: string;
  allRidesForDay: Ride[];
  fetchingAllRidesForDay: boolean;
  allRidesForDayErrMsg: string;
  allRequestsForDay: Ride[];
  fetchingAllRequestsForDay: boolean;
  allRequestsForDayErrMsg: string;
  updatingRide: boolean;
  updatingRideErrMsg: string;
}

const initialState: IDispatcherRidesState = {
  upcomingRidesForDay: [],
  fetchingUpcomingRidesForDay: false,
  upcomingRidesForDayErrMsg: "",
  allRidesForDay: [],
  fetchingAllRidesForDay: false,
  allRidesForDayErrMsg: "",
  allRequestsForDay: [],
  fetchingAllRequestsForDay: false,
  allRequestsForDayErrMsg: "",
  updatingRide: false,
  updatingRideErrMsg: ""
}

const dispatcherRidesReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_DAY_UPCOMING_RIDES_REQUEST:
      return {
        ...state,
        fetchingUpcomingRidesForDay: true,
        upcomingRidesForDayErrMsg: ""
      };

    case FETCH_DAY_UPCOMING_RIDES_SUCCESS:
      return {
        ...state,
        fetchingUpcomingRidesForDay: false,
        upcomingRidesForDay: action.payload,
        upcomingRidesForDayErrMsg: ""
      };

    case FETCH_DAY_UPCOMING_RIDES_FAILURE:
      return {
        ...state,
        fetchingUpcomingRidesForDay: false,
        upcomingRidesForDayErrMsg: action.payload
      };

    case FETCH_ALL_RIDES_FOR_DAY_REQUEST:
      return {
        ...state,
        fetchingAllRidesForDay: true,
        allRidesForDayErrMsg: ""
      };

    case FETCH_ALL_RIDES_FOR_DAY_SUCCESS:
      return {
        ...state,
        fetchingAllRidesForDay: false,
        allRidesForDay: action.payload,
        allRidesForDayErrMsg: ""
      };

    case FETCH_ALL_RIDES_FOR_DAY_FAILURE:
      return {
        ...state,
        fetchingAllRidesForDay: false,
        allRidesForDayErrMsg: action.payload
      };

    case FETCH_ALL_REQUESTS_FOR_DAY_REQUEST:
      return {
        ...state,
        fetchingAllRequestsForDay: true,
        allRequestsForDayErrMsg: ""
      };

    case FETCH_ALL_REQUESTS_FOR_DAY_SUCCESS:
      return {
        ...state,
        fetchingAllRequestsForDay: false,
        allRequestsForDay: action.payload,
        allRequestsForDayErrMsg: ""
      };

    case FETCH_ALL_REQUESTS_FOR_DAY_FAILURE:
      return {
        ...state,
        fetchingAllRequestsForDay: false,
        allRequestsForDayErrMsg: action.payload
      };

    case UPDATE_RIDES_REQUEST:
      return {
        ...state,
        updatingRide: true,
        updatingRideErrMsg: ""
      };

    case UPDATE_RIDES_SUCCESS:
      return {
        ...state,
        updatingRide: false,
        updatingRideErrMsg: ""
      };

    case UPDATE_RIDES_FAILURE:
      return {
        ...state,
        updatingRide: false,
        updatingRideErrMsg: action.payload
      };

    default:
      return state;
  }
}

export default dispatcherRidesReducer;