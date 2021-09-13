import {
    configureStore,
    getDefaultMiddleware,
    createSlice,

} from "@reduxjs/toolkit";



import {getClient} from "./asyncActions";

const middleware = [
    ...getDefaultMiddleware(),
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];




const kanbanState = {
    loading:false,
    error:undefined,
    accessToken:undefined
};



const requestSlice = createSlice({
    name: "kanban",
    initialState: kanbanState,
    reducers: {

        resetState:(state)=> {
            return state = {
                loading:false,
                error:undefined,
                accessToken:undefined
            };

        },


        setCodeView:(state,action)=> {

            if (action.payload.hasOwnProperty("codeView")){
                state.codeView = action.payload.codeView;
            }
            return state;

        },


    },
    extraReducers:{
        [getClient.pending]: state => {
            state.clientConfLoading = true;
        },
        [getClient.rejected]: (state, action) => {
            state.clientConfLoading = false;

            state.error = action.error.message;
        },
        [getClient.fulfilled]: (state, action) => {
            state.clientConfLoading = false;
            state.clientConf = action.payload.data;

        }

    }
});

export const { resetState,setCodeView} = requestSlice.actions;

const requestReducer = requestSlice.reducer;

export default configureStore({
    reducer: {
        request: requestReducer,
    },
    middleware,
});



