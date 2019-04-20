import {
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,
  FETCH_ALL_DRIVERS_REQUEST,
  FETCH_ALL_DRIVERS_SUCCESS,
  FETCH_ALL_DRIVERS_FAILURE
} from '../actionTypes';

import { UserProfile } from '../../types';

interface ProfileState {
  updatingProfile: boolean;
  updateErrorMsg: string;
  updateSuccessMsg: string;
  fetchingAllDrivers: boolean;
  allDrivers: UserProfile[];
  fetchingAllDriversErrMsg: string;
}

const initialState: ProfileState = {
  updatingProfile: false,
  updateErrorMsg: "",
  updateSuccessMsg: "",
  fetchingAllDrivers: false,
  allDrivers: [],
  fetchingAllDriversErrMsg: ""
};

const profileReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case PROFILE_UPDATE_REQUEST:
      return {
        ...state,
        updatingProfile: true,
        updateErrorMsg: "",
        updateSuccessMsg: ""
      }
    case PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        updatingProfile: false,
        updateErrorMsg: "",
        updateSuccessMsg: "Successfully updated profile."
      }
    case PROFILE_UPDATE_FAILURE:
      return {
        ...state,
        updatingProfile: false,
        updateErrorMsg: action.payload.err.message
      }
    case FETCH_ALL_DRIVERS_REQUEST:
      return {
        ...state,
        fetchingAllDrivers: true,
        fetchingAllDriversErrMsg: ""
      }
    case FETCH_ALL_DRIVERS_SUCCESS:
      return {
        ...state,
        fetchingAllDrivers: false,
        allDrivers: action.payload,
        fetchingAllDriversErrMsg: ""
      }
    case FETCH_ALL_DRIVERS_FAILURE:
      return {
        ...state,
        fetchingAllDrivers: false,
        fetchingAllDriversErrMsg: action.payload
      }
    default:
      return state;
  }
}

export default profileReducer;