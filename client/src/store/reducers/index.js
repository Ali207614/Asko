import { combineReducers } from "@reduxjs/toolkit";
import { main } from "../slices/main";

const rootReducer = combineReducers({
  main: main.reducer,
});

export default (state, action) => rootReducer(state, action);
