import {
  CHECK_USER_LOGGED_IN_REQUEST,
  CHECK_USER_LOGGED_IN_SUCCESS,
  CHECK_USER_LOGGED_IN_FAILURE,
  LOCAL_LOGIN_REQUEST,
  LOCAL_LOGIN_SUCCESS,
  LOCAL_LOGIN_FAILURE,
  LOCAL_REGISTER_REQUEST,
  LOCAL_REGISTER_SUCCESS,
  LOCAL_REGISTER_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS
} from "../actionTypes";


const initialState = {
  checkingLogin: true,
  loggingIn: false,
  loggingOut: false,
  loggedIn: false,
  user: null,
  registerErrorMsg: "",
  loginErrorMsg: ""
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
    case LOCAL_LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        loginErrorMsg: ""
      }
    case LOCAL_LOGIN_SUCCESS:
      if (action.payload.message) {
        return {
          ...state,
          loggingIn: false,
          loggedIn: false,
          user: null,
          loginErrorMsg: (action.payload.message == "Missing credentials") ?
            "Missing username or password." : action.payload.message
        }
      } else {
        return {
          ...state,
          loggingIn: false,
          loggedIn: true,
          user: action.payload,
          loginErrorMsg: ""
        }
      }

    case LOCAL_LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loggedIn: false,
        user: null,
        loginErrorMsg: action.payload.err
      }
    case LOCAL_REGISTER_REQUEST:
      return {
        ...state,
        loggingIn: true,
        registerErrorMsg: ""
      }
    case LOCAL_REGISTER_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        user: action.payload,
        registerErrorMsg: ""
      }
    case LOCAL_REGISTER_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loggedIn: false,
        user: null,
        registerErrorMsg: action.payload.err
      }
    case LOGOUT_REQUEST:
      return {
        ...state,
        loggingOut: true,
      }
    case LOGOUT_FAILURE:
      return {
        ...state,
        loggingOut: false,
        loggedIn: false,
        user: null
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        loggedIn: false,
        user: null
      }
    default:
      return state;
  }
}

export default authReducer;