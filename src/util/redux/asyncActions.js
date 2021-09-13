import {
    createAsyncThunk
} from "@reduxjs/toolkit";






export function smileConnectAPIcall({ url,requestOptions,history }){


           /*
                if (requestOptions.hasOwnProperty("headers")){
                    requestOptions.headers.Authorization =  "Bearer " + user.access_token
                }else{
                    requestOptions.headers={"Authorization":  "Bearer " + user.access_token}
                }
            }*/

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



}


function genUserSession({url,headers,body,history}){
    const requestOptions = { method: 'POST',
        headers,
        body:JSON.stringify(body),


    };

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

}

export const getClient = createAsyncThunk("request/getClient",  async ({ history }) => {
    const response = genUserSession({url:window._env_.REACT_APP_SSO_URL,requestOptions:{method:"POST","content-type":"application/json"},history})
    //const response = await smileConnectAPIcall({url:window._env_.REACT_APP_API_URL+"v1/AppConfig/clients/"+clientId,requestOptions:{method:"GET","content-type":"application/json"},userManager,history});
    console.log(response);
    return response;
});

