import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Keycloak from 'keycloak-js'

let initOptions = {
  url: 'http://localhost:8080', realm: 'TestRealm', clientId: 'React-App', onLoad: 'login-required'
}
let keycloak = new Keycloak(initOptions);
try {
keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {

    if (!auth) {
        window.location.reload();
    } else {
        console.info("Authenticated");
    }

    //React Render
    // ReactDOM.render(<App />, document.getElementById('root'));
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    localStorage.setItem("react-token", keycloak.token);
    localStorage.setItem("react-refresh-token", keycloak.refreshToken);

    setTimeout(() => {
        keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
                console.debug('Token refreshed' + refreshed);
            } else {
                console.warn('Token not refreshed, valid for '
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).error(() => {
            console.error('Failed to refresh token');
        });


    }, 60000)

})
}catch(e) {
  console.error("Authenticated Failed");
  console.log(e);
};