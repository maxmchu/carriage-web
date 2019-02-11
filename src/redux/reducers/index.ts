import { combineReducers } from 'redux';

import authReducer from './auth';
import dbReducer from './db';

const rootReducer = combineReducers({
  auth: authReducer,
  db: dbReducer
});

export default rootReducer;
