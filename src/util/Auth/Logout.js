import React from "react";
import { AuthConsumer } from "./AuthProvider";
import {Spin} from "antd";

export const Logout = () => (
    <AuthConsumer>
        {({ logout }) => {
            logout();
            return <div className="loginSpin">
                <Spin />
            </div>;
        }}
    </AuthConsumer>
);
