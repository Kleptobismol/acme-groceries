import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const LOAD = 'LOAD';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const SET_VIEW = 'SET_VIEW'

const initialState = {
  groceries: [],
  view: ''
};

const groceryReducer = (( state = [], action ) => {
  if(action.type === LOAD){
    state = action.groceries;
  }
  if(action.type === UPDATE){
    state = state.map( grocery => grocery.id === action.updated.id ? action.updated : grocery );
  }
  if(action.type === CREATE){
    state = [...state, action.grocery]
  }
  return state
});

const viewReducer = (( state = '', action) => {
  if(action.type === SET_VIEW){
    state = action.view;
  }
  return state
})

const reducer = combineReducers({
  groceries: groceryReducer,
  view: viewReducer
})

const store = createStore(reducer, applyMiddleware(thunk, logger))

const _loadGroceries = (groceries) => {
  return {
    type: LOAD,
    groceries
  }
}

const loadGroceries = () => {
  return async(dispatch) => {
    const groceries = ( await axios.get('/api/groceries')).data
    dispatch(_loadGroceries(groceries))
}
};

const _updateGroceries = (updated) => {
  return {
    type: UPDATE,
    updated
  }
}

const updateGroceries = ( grocery ) => {
  return async(dispatch) => {
    const updated = (await axios.put(`/api/groceries/${grocery.id}`, { purchased: !grocery.purchased })).data;
    dispatch(_updateGroceries(updated));
  }
};

const _createGroceries = ( grocery ) => {
  return {
    type: CREATE,
    grocery
  }
}

const createGroceries = ( name ) => {
  return async(dispatch) => {
    const grocery = (await axios.post('/api/groceries', { name })).data;
    dispatch(_createGroceries(grocery));   
  }
};

const createRandom = () => {
  return async(dispatch) => {
    const grocery = (await axios.post('/api/groceries/random')).data;
    dispatch(_createGroceries(grocery));   
  }
};

const setView = ( view ) => {
  return {
    type: SET_VIEW,
    view
  }
};


export default store;
export { loadGroceries, updateGroceries, createGroceries, createRandom, setView };


