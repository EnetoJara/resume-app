import React, { ReactElement } from "react";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { Home, Login, Register } from "../../containers";
import { Header, Layout } from "../../hoc";

export function App (): ReactElement {
    return (
        <Layout>
            <BrowserRouter>
                <Header>
                    <nav>
                        <Link to={process.env.CLIENT_LOGIN_ROUTE || ""}>
                            Login
                        </Link>
                        <Link to={process.env.CLIENT_REGISTER_ROUTE || ""}>
                            Register
                        </Link>
                    </nav>
                </Header>
                <Switch>
                    <Route
                        component={Register}
                        exact
                        path={process.env.CLIENT_REGISTER_ROUTE || ""}
                    />
                    <Route
                        component={Login}
                        exact
                        path={process.env.CLIENT_LOGIN_ROUTE || ""}
                    />
                    <Route
                        component={Home}
                        exact
                        path={process.env.CLIENT_HOME_ROUTE || ""}
                    />
                    <Redirect
                        from="*"
                        to={process.env.CLIENT_HOME_ROUTE || ""}
                    />
                </Switch>
            </BrowserRouter>
        </Layout>
    );
}
