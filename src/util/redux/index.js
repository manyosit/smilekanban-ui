import {
    configureStore,
    getDefaultMiddleware,
    createSlice,

} from "@reduxjs/toolkit";



import {setQuery, setTicketConfig,saveTicket, createWorklog,getTicketWorklogs,getConfigs} from "./asyncActions";

const middleware = [
    ...getDefaultMiddleware(),
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];




const kanbanState = {
    loading:true,
    error:undefined,
    accessToken:undefined,
    query:"1=2",
    tickets:[],
    worklogs:[],
    configs:[]
};



const requestSlice = createSlice({
    name: "request",
    initialState: kanbanState,
    reducers: {

        resetState:(state)=> {
            return state = {
                loading:true,
                error:undefined,
                accessToken:undefined,
                query:"1=2",
                tickets:[],
                worklogs:[],
                configs:[]
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
        },
        [saveTicket.pending]: state => {
            state.loading = true;
        },
        [saveTicket.rejected]: (state, action) => {
            state.loading = false;

            state.error = action.error.message;
        },
        [saveTicket.fulfilled]: (state, action) => {
            state.loading = false;

            state.tickets.entries = action.payload;
        },
        [createWorklog.pending]: state => {
            state.loading = true;
        },
        [createWorklog.rejected]: (state, action) => {
            state.loading = false;

            state.error = action.error.message;
        },
        [createWorklog.fulfilled]: (state, action) => {
            state.loading = false;
            state.worklogs=action.payload.entries

        },
        [getTicketWorklogs.pending]: state => {
            state.loading = true;
        },
        [getTicketWorklogs.rejected]: (state, action) => {
            state.loading = false;

            state.error = action.error.message;
        },
        [getTicketWorklogs.fulfilled]: (state, action) => {
            state.loading = false;
            state.worklogs=action.payload.entries


        },
        [setTicketConfig.pending]: state => {
            state.loading = true;
        },
        [setTicketConfig.rejected]: (state, action) => {
            state.loading = false;

            state.error = action.error.message;
        },
        [setTicketConfig.fulfilled]: (state, action) => {
            state.loading = false;
            state.ticketConfig = action.payload.ticketConfig;
        },
        [getConfigs.pending]: state => {
            state.loading = true;
        },
        [getConfigs.rejected]: (state, action) => {
            state.loading = false;

            state.error = action.error.message;
        },
        [getConfigs.fulfilled]: (state, action) => {
            state.loading = false;
            state.configs = action.payload;
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



