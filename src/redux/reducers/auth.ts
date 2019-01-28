import {
  CHECK_USER_LOGGED_IN_REQUEST,
  CHECK_USER_LOGGED_IN_SUCCESS,
  CHECK_USER_LOGGED_IN_FAILURE
} from "../actionTypes";


const initialState = {
  checkingLogin: false,
  loggedIn: false,
  user: null
}

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {

    case CHECK_USER_LOGGED_IN_REQUEST:
      return {
        ...state,
        checkingLogin: true
      };
    case CHECK_USER_LOGGED_IN_SUCCESS: {
      if (!!action.payload.user) {
        return {
          ...state,
          checkingLogin: false,
          loggedIn: true,
          user: action.payload.user
        }
      } else {
        return {
          ...state,
          checkingLogin: false
        }
      }
    }
    case CHECK_USER_LOGGED_IN_FAILURE:
      return {
        ...state,
        checkingLogin: false
      }
    default:
      return state;
  }
}

export default authReducer;