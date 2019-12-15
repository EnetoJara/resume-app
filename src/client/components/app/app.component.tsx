import React, { ReactElement } from "react";
import { hot } from "react-hot-loader/root";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { Home, Login, Register } from "../../containers";
import { Header, Layout } from "../../hoc";

function Main (): ReactElement {
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

export const App = hot(Main);
