import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../slice/loginSlice"



const store = configureStore({
    reducer: {
        auth: authReducer,
    }
});

export default store;

