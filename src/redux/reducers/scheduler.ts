import { } from '../actionTypes';

interface ISchedulerState {
  schedulingRides: boolean;
  schedulingRidesErrMsg: string;
  schedulingRidesResponse: string;
}

const initialState: ISchedulerState = {
  schedulingRides: false,
  schedulingRidesErrMsg: "",
  schedulingRidesResponse: ""
}

const schedulerReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

export default schedulerReducer;