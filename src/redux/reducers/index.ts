import { combineReducers } from 'redux';

import authReducer from './auth';
import dbReducer from './db';
import ridesReducer from './rides';
import profileReducer from './profile';
import dispatcherRidesReducer from './dispatcherRides';
import schedulerReducer from './scheduler';

const rootReducer = combineReducers({
  auth: authReducer,
  db: dbReducer,
  rides: ridesReducer,
  profile: profileReducer,
  dispatcherRides: dispatcherRidesReducer,
  scheduler: schedulerReducer
});

export default rootReducer;
