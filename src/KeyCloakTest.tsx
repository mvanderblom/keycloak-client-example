import * as React from "react";
import Keycloak, {KeycloakInstance} from "keycloak-js";


const keycloak = Keycloak({
    url: '',
    realm: '',
    clientId: '',
})

class KeyCloakTest extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            keycloak: null,
            authenticated: false,
            status: undefined,
            response: undefined,
            token: null
        };
    }

    componentDidMount() {
        keycloak
            .init({onLoad: 'check-sso'})
            .then(authenticated => {
                console.log('after init call')
                this.setState({token: keycloak.token, authenticated: keycloak.authenticated})
            })
    }

    login = () => {
        keycloak.login()
    }

    logout = () => {
        keycloak.logout()
    }

    callApi = () => {
        this.setState({status: undefined, response: undefined})

        const req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:3000/api/customer', true);
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Authorization', 'Bearer ' + this.state.token);

        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                console.log(req.status, req.response)
                this.setState({status: req.status, response: req.response})
            }
        }
        req.send();
    }

    render = () => {
        return (
            <>
                <div>
                    <p>token: {this.state.token}</p>
                    <p>authenticated: {this.state.authenticated ? 'yes' : 'no'}</p>
                    <p>status: {this.state.status}</p>
                    <p>response:</p>
                    <pre>{JSON.stringify(this.state.response, null, 2)}</pre>
                </div>
                {/*<button onClick={this.init_keycloak}>init_keycloak</button>*/}
                <button onClick={this.login}>login</button>
                <button onClick={this.logout}>logout</button>
                <button onClick={this.callApi}>callApi</button>
            </>
        );
    }
}

export default KeyCloakTest;