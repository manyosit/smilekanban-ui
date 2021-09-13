

export const OidcSettings = {

    authority: window._env_.REACT_APP_SSO_URL,
    client_id: window._env_.REACT_APP_CLIENT_ID,
    client_secret:window._env_.REACT_APP_CLIENT_SECRET,
    redirect_uri: window._env_.REACT_APP_GUI_URL+"signin-oidc",
    response_type: 'code',
    scope:  'openid',
    monitorSession: false,
    silent_redirect_uri:window._env_.REACT_APP_GUI_URL+"silentRenewFrame.html",
    automaticSilentRenew:true,
    extraQueryParams:{checkLoginIframe:false},
    accessTokenExpiringNotificationTime:window._env_.REACT_APP_TOKEN_REFRESHTIME,
    post_logout_redirect_uri:window._env_.REACT_APP_GUI_URL+"logout/callback",
    webAuthResponseType:'id_token token'

};
export const  METADATA_OIDC = {
    issuer: window._env_.REACT_APP_SSO_URL,
    jwks_uri: window._env_.REACT_APP_SSO_URL  + "/oauth2/jwks",
    authorization_endpoint: window._env_.REACT_APP_SSO_URL + "/oauth2/authorize",
    token_endpoint:  window._env_.REACT_APP_SSO_URL+"/oauth2/token", //"http://localhost:3000/rsso/oauth2/token",
    userinfo_endpoint: window._env_.REACT_APP_SSO_URL + "/oauth2/userinfo",
    end_session_endpoint: window._env_.REACT_APP_SSO_URL + "/oauth2/revoke",
    introspection_endpoint:window._env_.REACT_APP_SSO_URL + "/oauth2/introspect",

};
