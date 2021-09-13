import React from "react";
import { AuthConsumer } from "./AuthProvider";
import {Spin} from "antd";

export const LogoutCallback = () => (
    <AuthConsumer>
        {({ signoutRedirectCallback }) => {
            signoutRedirectCallback();
            return <div className="loginSpin">
                <Spin />
            </div>;
        }}
    </AuthConsumer>
);
