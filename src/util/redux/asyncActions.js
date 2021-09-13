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

                                return data.json()
                            }

                        }).catch(error=>{

                   history.replace(history.location.pathname, {
                       errorStatusCode: '500',
                       errorDetail: JSON.stringify({url,error:""+ error})
                   })})

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





export const getTickets = createAsyncThunk("request/getTickets",  async ({ history,userManager },thunkAPI) => {

    const query = thunkAPI.getState().kanban.query;

    const response = await restApi({url:window._env_.REACT_APP_API_URL+"/api/arsys/v1/entry/HPD:Help Desk?q="+query,requestOptions:{method:"GET","content-type":"application/json"},userManager,history});
    return response;
});


export const setQuery = createAsyncThunk("request/getTickets",  async ({ selection,history,userManager }) => {

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

                    if (i==0){
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
    const response = await restApi({url:window._env_.REACT_APP_API_URL+"/api/arsys/v1/entry/HPD:Help Desk?q="+query,requestOptions:{method:"GET","content-type":"application/json"},userManager,history});




    return {query,response};
});
