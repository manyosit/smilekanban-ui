import React from "react";
import { Route } from "react-router-dom";
import { AuthConsumer } from "./AuthProvider";
import {Spin} from "antd";

export const PrivateRoute = ({ component, ...rest }) => {
    const renderFn = (Component) => (props) => (
        <AuthConsumer>
            {({ isAuthenticated, signinRedirect }) => {


                if (!!Component && isAuthenticated()) {
                    return <Component {...props} />;
                } else {

                    signinRedirect();
                    return <div className="loginSpin">
                        <Spin />
                    </div>;
                }
            }}
        </AuthConsumer>
    );

    return <Route {...rest} render={renderFn(component)} />;
};
