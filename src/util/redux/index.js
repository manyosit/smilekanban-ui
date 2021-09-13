import {
    configureStore,
    getDefaultMiddleware,
    createSlice,

} from "@reduxjs/toolkit";



import {getTickets,setQuery} from "./asyncActions";

const middleware = [
    ...getDefaultMiddleware(),
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];




const kanbanState = {
    loading:false,
    error:undefined,
    accessToken:undefined,
    query:"1=2"
};



const requestSlice = createSlice({
    name: "kanban",
    initialState: kanbanState,
    reducers: {

        resetState:(state)=> {
            return state = {
                loading:false,
                error:undefined,
                accessToken:undefined,
                query:"1=2"
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
        [getTickets.pending]: state => {
            state.loading = true;
        },
        [getTickets.rejected]: (state, action) => {
            state.loading = false;

            state.error = action.error.message;
        },
        [getTickets.fulfilled]: (state, action) => {
            state.loading = false;
            state.tickets = action.payload;

        },
        [setQuery.pending]: state => {
            state.loading = true;
        },
        [setQuery.rejected]: (state, action) => {
            state.loading = false;

            state.error = action.error.message;
        },
        [setQuery.fulfilled]: (state, action) => {
            state.loading = false;
            state.query = action.payload.query;
            state.tickets = action.payload.response;
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



