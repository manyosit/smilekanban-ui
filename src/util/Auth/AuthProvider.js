import React, {Component} from "react";
import AuthService from "./AuthService";

export const AuthContext = React.createContext({
    signinRedirectCallback: () => ({}),
    logout: () => ({}),
    signoutRedirectCallback: () => ({}),
    isAuthenticated: () => ({}),
    signinRedirect: () => ({}),
    signinSilentCallback: () => ({}),
    createSigninRequest: () => ({}),
    getUser: ()=> ({}),
});

export const AuthConsumer = AuthContext.Consumer;

export class AuthProvider extends Component {
    AuthService;
    constructor(props) {
        super(props);
        this.AuthService = new AuthService();

      

    }

    render() {
        return <AuthContext.Provider value={this.AuthService}>{this.props.children}</AuthContext.Provider>;
    }
}
