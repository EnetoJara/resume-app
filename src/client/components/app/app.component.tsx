import React, { ReactElement } from "react";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import {
    HOME_ROUTE,
    LOGIN_ROUTE,
    REGISTER_ROUTE,
} from "../../../utils/constants";
import { Home, Login, Register } from "../../containers";
import { Header, Layout } from "../../hoc";

export function App (): ReactElement {
    return (
        <Layout>
            <BrowserRouter>
                <Header>
                    <nav>
                        <Link to={LOGIN_ROUTE}>Login</Link>
                        <Link to={REGISTER_ROUTE}>Register</Link>
                    </nav>
                </Header>
                <Switch>
                    <Route exact path={REGISTER_ROUTE} component={Register} />
                    <Route exact path={LOGIN_ROUTE} component={Login} />
                    <Route exact path={HOME_ROUTE} component={Home} />
                    <Redirect from="*" to={HOME_ROUTE} />
                </Switch>
            </BrowserRouter>
        </Layout>
    );
}
