import {
  FETCH_DAY_UPCOMING_RIDES_REQUEST,
  FETCH_DAY_UPCOMING_RIDES_SUCCESS,
  FETCH_DAY_UPCOMING_RIDES_FAILURE
} from '../actionTypes';
import { Ride } from '../../types';

interface IDispatcherRidesState {
  upcomingRidesForDay: Ride[];
  fetchingUpcomingRidesForDay: boolean;
  upcomingRidesForDayErrMsg: string;
}

const initialState: IDispatcherRidesState = {
  upcomingRidesForDay: [],
  fetchingUpcomingRidesForDay: false,
  upcomingRidesForDayErrMsg: ""
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
      }

    case FETCH_DAY_UPCOMING_RIDES_FAILURE:
      return {
        ...state,
        fetchingUpcomingRidesForDay: false,
        upcomingRidesForDayErrMsg: action.payload
      }

    default:
      return state;
  }
}

export default dispatcherRidesReducer;