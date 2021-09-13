import React from "react";
import { AuthConsumer } from "./AuthProvider";
import {Spin} from "antd";
export const SilentRenew = () => (
    <AuthConsumer>
        {({ signinSilentCallback }) => {
            signinSilentCallback();
            return <div className="loginSpin">
                <Spin />
            </div>;
        }}
    </AuthConsumer>
);
