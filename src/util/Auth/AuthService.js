import React from "react"
import {OidcSettings,METADATA_OIDC} from '../../oidcsettings';
import { UserManager, WebStorageStateStore, Log } from "oidc-client";
import {  Modal } from 'antd';







export default class AuthService {
    UserManager

    constructor() {

        this.UserManager=new UserManager({
            ...OidcSettings,
            userStore: new WebStorageStateStore({ store: window.sessionStorage }),
            metadata: {
                ...METADATA_OIDC
            }
        });
        // Logger
        Log.logger = console;
        Log.level = window._env_.REACT_APP_OIDC_LOGLEVEL
        this.UserManager.events.addUserLoaded((user) => {

            if (window.location.href.indexOf("signin-oidc") !== -1) {

                this.navigateToScreen();
            }
        });
        this.UserManager.events.addSilentRenewError((e) => {
            console.log("silent renew error", e.message);
            this.openNotificationWithIcon(e.message);

        });

        this.UserManager.events.addAccessTokenExpiring(() => {
            console.log("token expiring");

            this.signinSilent();

        });
        this.UserManager.events.addAccessTokenExpired(() => {
            console.log("token expired");


            this.openNotificationWithIcon("token expired");
            this.signinSilent();

        });
    }

    signinRedirectCallback = () => {

        this.UserManager.signinRedirectCallback().then((e)=>{
            window.location.replace(localStorage.getItem("redirectUri"));
        }).catch(e=>{alert(e)});
    };

     openNotificationWithIcon = (e) => {
        Modal.warning({
            title: 'Session expired!',
            content:
                ( <>
                        {`Sorry there was an issue while renewing your session. Please re-login! `}
                        <p>
                            {`Error: ${e}`}
                        </p>
                    </>),
            onOk: ()=>{
                this.signinRedirect()

            },
            okText: "Re-Login"
        }
        );
    };

    getUser = async () => {

        const user = await this.UserManager.getUser();
        if (!user) {
            return await this.UserManager.signinRedirectCallback();
        }
        return user;
    };

    parseJwt = (token) => {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    };


    signinRedirect = () => {

        localStorage.setItem("redirectUri", window.location.pathname+window.location.search);
        this.UserManager.signinRedirect({});
    };


    navigateToScreen = () => {

        window.location.replace(localStorage.getItem("redirectUri"));
    };


    isAuthenticated = () => {


        Object.keys(localStorage).filter(i => {

            return i.indexOf("oidc.")>=0}).forEach(key=>{

            localStorage.removeItem(key);
            }
        )


        const oidcStorage = JSON.parse(sessionStorage.getItem(`oidc.user:${window._env_.REACT_APP_SSO_URL}:${window._env_.REACT_APP_CLIENT_ID}`))
        return (!!oidcStorage && !!oidcStorage.access_token)
    };



    signinSilent = () => {
        this.UserManager.signinSilent()
            .then((user) => {
                console.log("signed in", user);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    signinSilentCallback = () => {

        this.UserManager.signinSilentCallback()


    };

    createSigninRequest = () => {
        return this.UserManager.createSigninRequest();
    };

    logout = () => {
        this.UserManager.signoutRedirect({
            id_token_hint: localStorage.getItem("access_token")
        });
        this.UserManager.clearStaleState();
    };

    signoutRedirectCallback = () => {
        this.UserManager.signoutRedirectCallback().then(() => {
            localStorage.clear();

            window.location.replace(window._env_.REACT_APP_GUI_URL);
        })
        this.UserManager.clearStaleState();
    };
}
