import {
  SCHEDULE_RIDES_REQUEST,
  SCHEDULE_RIDES_SUCCESS,
  SCHEDULE_RIDES_FAILURE
} from '../actionTypes';

interface ISchedulerState {
  schedulingRides: boolean;
  schedulingRidesErrMsg: string;
  schedulingRidesResponse: any;
  schedulingRidesSuccess: boolean;
}

const initialState: ISchedulerState = {
  schedulingRides: false,
  schedulingRidesErrMsg: "",
  schedulingRidesResponse: null,
  schedulingRidesSuccess: false
}

const schedulerReducer = (state = initialState, action) => {
  switch (action.type) {

    case SCHEDULE_RIDES_REQUEST:
      return {
        ...state,
        schedulingRides: true,
        schedulingRidesResponse: null,
        schedulingRidesSuccess: false
      };

    case SCHEDULE_RIDES_SUCCESS:
      return {
        ...state,
        schedulingRides: false,
        schedulingRidesResponse: action.payload,
        schedulingRidesSuccess: true
      }

    case SCHEDULE_RIDES_FAILURE:
      return {
        ...state,
        schedulingRides: false,
        schedulingRidesErrMsg: action.payload.err,
        schedulingRidesSuccess: false
      }

    default:
      return state;
  }
}

export default schedulerReducer;