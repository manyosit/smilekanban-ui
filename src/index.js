import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';
import {Provider} from "react-redux";
import store from "./util/redux/index";
import {BrowserRouter as Router, Redirect, Route, Switch, useHistory} from 'react-router-dom';
import { Callback } from "./util/Auth/Callback";
import { Logout } from "./util/Auth/Logout";
import { LogoutCallback } from "./util/Auth/LogoutCallback";
import { PrivateRoute } from "./util/Auth/PrivateRoute";
import { SilentRenew } from "./util/Auth/SilentRenew";


import {AuthProvider} from "./util/Auth/AuthProvider";

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <AuthProvider>
          <Router>
              <Switch>

                  <Route exact={true} path="/signin-oidc" component={Callback} />
                  <Route exact={true} path="/logout" component={Logout} />
                  <Route exact={true} path="/logout/callback" component={LogoutCallback} />
                  <Route exact={true} path="/silentrenew" component={SilentRenew} />
                  <PrivateRoute path="/kanban/:id"  component={ App } />
                  <Redirect from="/kanban" to="/kanban/incident"/>
                  <Redirect from="/" to="/kanban/incident"/>

              </Switch>

          </Router>

          </AuthProvider>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
