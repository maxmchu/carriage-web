import {
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE
} from '../actionTypes';

const initialState = {
  updatingProfile: false,
  updateErrorMsg: "",
  updateSuccessMsg: ""
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
    default:
      return state;
  }
}

export default profileReducer;