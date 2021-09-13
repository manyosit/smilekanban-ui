import React from "react";
import { AuthConsumer } from "./AuthProvider";
import {Spin} from "antd";

export const Callback = () => (
    <AuthConsumer>
        {({ signinRedirectCallback }) => {



            try{
                signinRedirectCallback();
            }catch(e){
                console.log(e);
            }

            return <div className="loginSpin">
                <Spin />
            </div>;
        }}
    </AuthConsumer>
);
