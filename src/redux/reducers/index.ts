import { combineReducers } from 'redux';

import authReducer from './auth';
import dbReducer from './db';
import ridesReducer from './rides';

const rootReducer = combineReducers({
  auth: authReducer,
  db: dbReducer,
  rides: ridesReducer
});

export default rootReducer;
