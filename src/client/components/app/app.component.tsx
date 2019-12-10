import React, { ReactElement } from "react";
import { Register } from "../../containers";
import { Header, Layout } from "../../hoc";
export function App (): ReactElement {
    return (
        <Layout>
            <Header>
                <nav>
                    <div>Login</div>
                    <div>Register</div>
                </nav>
            </Header>
            <Register />
        </Layout>
    );
}
