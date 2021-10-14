import {
    createAsyncThunk
} from "@reduxjs/toolkit";

import {translateQuery} from '../componentUtils'


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
    }).catch(error=>{

        history.replace(history.location.pathname, {
            errorStatusCode: 500,
            errorDetail: JSON.stringify({path,error:""+error})
        });
    }).then(response=>response.json()).catch(error=>{

        history.replace(history.location.pathname, {
            errorStatusCode: 500,
            errorDetail: JSON.stringify({path,error:""+error})
        });
    }).then(data=>{
        const ticketConfig = data
        return {ticketConfig}
    });

    return response

});
export const getConfigs = createAsyncThunk("request/getConfig",  async ({  history,userManager },thunkAPI) => {
    const path = `/config/meta.json`
    const response = await fetch(path, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    }).catch(error=>{

        history.replace(history.location.pathname, {
            errorStatusCode: 500,
            errorDetail: JSON.stringify({path,error})
        });
    }).then(response=>response.json()).catch(error=>{

        history.replace(history.location.pathname, {
            errorStatusCode: 500,
            errorDetail: JSON.stringify({path,error})
        });
    }).then(data=>{

        
        return Object.keys(data[0]).map(c=>({label:c,value:data[0][c].file}))


    }).catch(error=> {

        history.replace(history.location.pathname, {
            errorStatusCode: 500,
            errorDetail: JSON.stringify({path, error})
        });
        ;

    })

    return response



    
});

export const saveTicket = createAsyncThunk("request/saveTicket",  async ({ item,fields,ticketConfig,status, history,userManager },thunkAPI) => {


    const response = await restApi(
        {
            url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${ticketConfig.formName}/${item[ticketConfig.requestID]}`,
            requestOptions:{method:"PUT",headers:{"content-type":"application/json","X-Requested-By":"SMILEkanban"},
            body:JSON.stringify(
                {
                    values:{...fields,"Status":status}
                }
            )}
    ,userManager,history});
    const ticket = await restApi(
        {
            url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${ticketConfig.formName}/${item[ticketConfig.requestID]}`,
            requestOptions:{method:"GET",headers:{"content-type":"application/json","X-Requested-By":"SMILEkanban"}}

            ,userManager,history});


    // thunkAPI.getState().request.values is immutable object. next line creates a mutable object.
    let tickets=JSON.parse(JSON.stringify(thunkAPI.getState().request.tickets));

    tickets = tickets.entries.map(e=>{
        if (e.values[ticketConfig.requestID] ===item[ticketConfig.requestID]) {
            return {...e,values:ticket.values}
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
    let values={
        "user.profile.name":user.profile.name
    }

    let query

    let words = ticketConfig.keywords && await Promise.all(Object.keys(ticketConfig.keywords).map(async keyword=>{
        const conf = ticketConfig.keywords[keyword]

        if (conf.form && conf.formQuery ){
            const translatedQuery=encodeURI(translateQuery(conf.formQuery,values))
            const keywordResponse=await restApi({url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${conf.form}?q=${translatedQuery}`,requestOptions:{method:"GET","content-type":"application/json"},userManager,history})
                if (keywordResponse && keywordResponse.entries && Array.isArray(keywordResponse.entries)){

                    return {[keyword]:{values:keywordResponse.entries.map(e=>e.values[conf.formField]),joinOperator:conf.joinOperator}}
                }



        }else{
           return {
                [keyword]:translateQuery(conf.query,values)
            }

        }



    }))

   words.forEach(w=>{

       values={...values,...w}
   })
    const filterConf=ticketConfig.filter && ticketConfig.filter.find(e=>e.name===selection)


    query = translateQuery(filterConf.query,values)



    const response = await restApi({url:`${window._env_.REACT_APP_API_URL}/api/arsys/v1/entry/${ticketConfig.formName}?q=${query}`,requestOptions:{method:"GET","content-type":"application/json"},userManager,history});

    return {query,response};
});
