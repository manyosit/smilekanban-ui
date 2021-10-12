import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';
import {AuthContext} from './Auth/AuthProvider'






const useQuery = ({ url,requestOptions },reload,run) => {
    const history = useHistory();
    const [apiData, setApiData] = React.useState({});
    const userManager = useContext(AuthContext);

    React.useEffect(() => {


        userManager.getUser().then(user=>{
            if (user){
                if (requestOptions.hasOwnProperty("headers")){
                    requestOptions.headers.Authorization =  "Bearer " + user.access_token
                }else{
                    requestOptions.headers={"Authorization":  "Bearer " + user.access_token}
                }
            }


            if (run) {
                fetch(url, requestOptions)
                    .then(async data => {

                            if (data.status && data.status>400){
                                let errData = await data.json();

                                history.replace(history.location.pathname, {
                                    errorStatusCode: data.status,
                                    errorDetail: JSON.stringify({url,...errData})
                                });
                            }else{
                                return data.json()
                            }

                        }






                    ).catch(error=>
                {
                    console.log(error);
                    history.replace(history.location.pathname, {
                        errorStatusCode: 500,
                        errorDetail: JSON.stringify({url,...error})
                    });
                })
                    .then(({code, status, ...apiData}) => {

                        if ((code && code > 400) || ({...apiData}.hasOwnProperty("error") && {...apiData}.hasOwnProperty("stackTrace"))) {
                            if (!(code)) {
                                code = 500
                            }
                            const errorDetails = {...apiData};
                            /* history.replace(history.location.pathname, {
                                 errorStatusCode: code,
                                 errorDetail: JSON.stringify(errorDetails, 0, 2)
                             });*/
                        } else {

                            setApiData(apiData);
                        }
                    }).catch(error => {
                    /*history.replace(history.location.pathname, {
                        errorStatusCode: 500,
                        errorDetail: error
                    });*/
                });
            }
        }).catch(error=>
        {
            console.log(error);
            history.replace(history.location.pathname, {
                errorStatusCode: 401,
                errorDetail: JSON.stringify({url,...error})
            });
        })





    }, reload);



    return   apiData ;
}



export default useQuery;
