import {
  FETCH_LOCATIONS_REQUEST,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_LOCATIONS_FAILURE
} from '../actionTypes';

const initialState = {
  fetchingLocations: false,
  fetchingLocationsErr: "",
  locations: []
}

const dbReducer = (state = initialState, action: any) => {
  switch (action.type) {

    case FETCH_LOCATIONS_REQUEST:
      return {
        ...state,
        fetchingLocations: true,
        fetchingLocationsErr: ""
      };

    case FETCH_LOCATIONS_SUCCESS:
      return {
        ...state,
        fetchingLocations: false,
        fetchingLocationsErr: "",
        locations: action.payload
      };

    case FETCH_LOCATIONS_FAILURE:
      return {
        ...state,
        fetchingLocations: false,
        fetchingLocationsErr: action.payload.err
      }

    default:
      return state;
  }
}

export default dbReducer;
