import {
    createAsyncThunk
} from "@reduxjs/toolkit";


export function restApi({ url,requestOptions,history,userManager }){

    return userManager.getUser().then(user=>{
           if(user){
                if (requestOptions.hasOwnProperty("headers")){
                    requestOptions.headers.Authorization =  "Bearer " + user.access_token
                }else{
                    requestOptions.headers={"Authorization":  "Bearer " + user.access_token}
                }
            }


           return fetch(url, requestOptions)
                    .then(async data => {

                            if (data.status && data.status>400){
                                let error = await data.json();
                                history.replace(history.location.pathname, {
                                    errorStatusCode: data.status,
                                    errorDetail: JSON.stringify({url,...error})
                                });
                            }else{

                                return(requestOptions.method==="GET")  ?  data.json() : {}


                            }

                        })


                    .then(({ status, ...apiData}) => {

                        if ( ({...apiData}.hasOwnProperty("error") && {...apiData}.hasOwnProperty("stackTrace"))) {

                            const error = {...apiData};
                            history.replace(history.location.pathname, {
                                errorStatusCode: 500,
                                errorDetail: JSON.stringify({url,...error})
                            });
                           throw Error(JSON.stringify(error))
                        } else {

                            return apiData ;
                        }
                    }).catch(error => {throw Error(error)});



})
}

export const setTicketConfig = createAsyncThunk("request/getTicketConfig",  async ({ id, history,userManager },thunkAPI) => {
    const path = `/config/${id}.json`
    const response = await fetch(path, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    });
    const data = await response.json();
    const ticketConfig = data
    return {ticketConfig}
});

export const saveTicket = createAsyncThunk("request/saveTicket",  async ({ item,fields,ticketConfig,status, history,userManager },thunkAPI) => {


    const response = await restApi(
        {
            url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${ticketConfig.formName}/${item["Entry ID"]}`,
            requestOptions:{method:"PUT",headers:{"content-type":"application/json","X-Requested-By":"SMILEkanban"},
            body:JSON.stringify(
                {
                    values:{...fields,"Status":status}
                }
            )}
    ,userManager,history});

    // thunkAPI.getState().request.values is immutable object. next line creates a mutable object.
    let tickets=JSON.parse(JSON.stringify(thunkAPI.getState().request.tickets));

    tickets = tickets.entries.map(e=>{
        if (e.values["Entry ID"] ===item["Entry ID"]) {
            return {...e,values:{...e.values,...fields,"Status":status}}
        }
       return e

    } )



    return tickets
});
export const createWorklog = createAsyncThunk("request/createWorklog",  async ({ item,wlFields,worklogConfig, history,userManager },thunkAPI) => {

    const form=worklogConfig.form
    const ticketid=item[worklogConfig.idField]
    const constants=worklogConfig.constants
    const relId=worklogConfig.worklogRelId


    const response = await restApi(
        {
            url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${form}`,
            requestOptions:{method:"POST",headers:{"content-type":"application/json","X-Requested-By":"SMILEkanban"},
                body:JSON.stringify(
                    {
                        values:{...wlFields,...constants,[relId]:ticketid}
                    }
                )}
            ,userManager,history});

    let query = encodeURI(`'${relId}'="${ticketid}"`)

    const responseWL = await restApi({url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${form}?q=${query}`,requestOptions:{method:"GET","content-type":"application/json"},userManager,history});

    return responseWL;
    
});
export const getTicketWorklogs = createAsyncThunk("request/getTicketWorklogs",  async ({ item, worklogConfig, history,userManager }) => {


    

    const form=worklogConfig.form
    const ticketid=item[worklogConfig.idField]
    const relId=worklogConfig.worklogRelId
    let query = encodeURI(`'${relId}'="${ticketid}"`)
   
    const response = await restApi({url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${form}?q=${query}`,requestOptions:{method:"GET","content-type":"application/json"},userManager,history});

    return response;
});


export const setQuery = createAsyncThunk("request/getTickets",  async ({ selection, ticketConfig, history,userManager }) => {

    const user = await userManager.getUser()

    let query
    switch (selection){
        case "Assigned to me":
            query= "%27Assignee Login ID%27%20%3D%20%22"+user.profile.name+"%22"
            break;
        case "Assigned to my groups":
            const myGroups = await restApi({url:window._env_.REACT_APP_API_URL+"/api/arsys/v1/entry/CTM:Support Group Association?q=%27Login ID%27%20%3D%20%22"+user.profile.name+"%22",requestOptions:{method:"GET","content-type":"application/json"},userManager,history});

            if (myGroups && myGroups.entries && Array.isArray(myGroups.entries)){

                myGroups.entries.forEach((e,i)=>{

                    if (i===0){
                        query ="%27Assigned Group ID%27%20%3D%20%22"+(e.values["Support Group ID"])+"%22"
                    }else{
                        query = query + " OR %27Assigned Group ID%27%20%3D%20%22"+(e.values["Support Group ID"])+"%22"
                    }
                })
            }
            break;
        default:
            query = "1=2";
            break;
    }
    const response = await restApi({url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${ticketConfig.formName}?q=${query}`,requestOptions:{method:"GET","content-type":"application/json"},userManager,history});

    return {query,response};
});
