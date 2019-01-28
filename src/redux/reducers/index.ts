import { EMPTY_ACTION } from "../actionTypes";
import { combineReducers } from 'redux';
import { IAction } from "../actions";

const initialState = {
  userLoggedIn: false,
  user: null
};

const initialReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case EMPTY_ACTION:
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  initialReducer
});

export default rootReducer;
