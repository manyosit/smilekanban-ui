import React from "react";

import {Button,Result,Alert,Row,Col} from "antd"
import {useLocation} from "react-router-dom";
import { get } from "lodash";




const ErrorHandler = ({ children }) => {
    const location = useLocation();

    const [open,setOpen] = React.useState(false);
    const [errDetails,setErrDetails] = React.useState(null);

    React.useEffect(()=>{
        if(open){
            const eD=get(location.state,'errorDetail');


            try {

                const jError=JSON.parse(eD);
                if (jError && Object.keys(jError).length>0){
                    setErrDetails(jError);
                }
                console.log(jError);
            }catch(e){
                console.log(e);
            }


        }

    },[open]);


    const code=get(location.state, 'errorStatusCode')

    if(code>400) {



        return (<Result
            status={"500"}
            title={code}
            subTitle={(
                <>
                    <Row gutter={[16,16]}>
                        <Col span={12} offset={6}>

                            Sorry, something went wrong. <a onClick={()=>{setOpen(true)}}>Details</a>
                        </Col>

                    </Row>
                    {
                        (open && errDetails)
                        && (
                            <Row gutter={[16,16]}>

                                <Alert
                                    className="sc-error-alert"
                                    message="Error Details"
                                    style={{marginLeft:"auto",marginRight:"auto"}}
                                    showIcon
                                    description={
                                        Object.keys(errDetails).map(e => {
                                            console.log(typeof errDetails[e]);
                                            if (typeof errDetails[e] === "string" ){
                                                return <p>{`${e}:${errDetails[e]}`}</p>
                                            }else{
                                                return(
                                                    <>
                                                        {
                                                            Object.keys(errDetails[e]).map(errD => (
                                                                <p>{`${errD}:${errDetails[e][errD]}`}</p>
                                                            ))
                                                        }
                                                    </>

                                                )
                                            }

                                        })



                                    }
                                    type="error"
                                    closable
                                    onClose={()=>{setOpen(false)}}
                                />
                            </Row>
                        )
                    }

                </>
            )}
            extra={<Button type="primary" onClick={()=>{window.location.href="/"}}>Back Home</Button>}
        />)

    } else{
        return children;
    }

};

export default ErrorHandler;
