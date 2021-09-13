import React from "react";
import { Route } from "react-router-dom";
import { AuthConsumer } from "./AuthProvider";
import {Spin} from "antd";


export const AdminRoute = ({ component, ...rest }) => {

    const renderFn = (Component) =>  (props) => (
        <AuthConsumer>
            {({ isAdmin,signinRedirect,isAuthenticated }) => {


                if (!!Component && isAdmin()) {
                    return <Component {...props} />;
                } else {
                    if (!(isAuthenticated())){
                        signinRedirect();
                        return <div className="loginSpin"><Spin/></div>
                    }else{
                        window.location.href='/';
                    }

                }
            }}
        </AuthConsumer>
    );

    return <Route {...rest} render={renderFn(component)} />;
};
