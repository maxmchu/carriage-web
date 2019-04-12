import {
  FETCH_DAY_UPCOMING_RIDES_REQUEST,
  FETCH_DAY_UPCOMING_RIDES_SUCCESS,
  FETCH_DAY_UPCOMING_RIDES_FAILURE,
  FETCH_ALL_RIDES_FOR_DAY_REQUEST,
  FETCH_ALL_RIDES_FOR_DAY_SUCCESS,
  FETCH_ALL_RIDES_FOR_DAY_FAILURE
} from '../actionTypes';
import { Ride } from '../../types';

interface IDispatcherRidesState {
  upcomingRidesForDay: Ride[];
  fetchingUpcomingRidesForDay: boolean;
  upcomingRidesForDayErrMsg: string;
  allRidesForDay: Ride[];
  fetchingAllRidesForDay: boolean;
  allRidesForDayErrMsg: string;
}

const initialState: IDispatcherRidesState = {
  upcomingRidesForDay: [],
  fetchingUpcomingRidesForDay: false,
  upcomingRidesForDayErrMsg: "",
  allRidesForDay: [],
  fetchingAllRidesForDay: false,
  allRidesForDayErrMsg: ""
}

const dispatcherRidesReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_DAY_UPCOMING_RIDES_REQUEST:
      return {
        ...state,
        fetchingUpcomingRidesForDay: true
      };

    case FETCH_DAY_UPCOMING_RIDES_SUCCESS:
      return {
        ...state,
        fetchingUpcomingRidesForDay: false,
        upcomingRidesForDay: action.payload
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
        fetchingAllRidesForDay: true
      };

    case FETCH_ALL_RIDES_FOR_DAY_SUCCESS:
      return {
        ...state,
        fetchingAllRidesForDay: false,
        allRidesForDay: action.payload
      };

    case FETCH_ALL_RIDES_FOR_DAY_FAILURE:
      return {
        ...state,
        fetchingAllRidesForDay: false,
        allRidesForDayErrMsg: ""
      };

    default:
      return state;
  }
}

export default dispatcherRidesReducer;