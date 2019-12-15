import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { AppState } from "../types/types";
import { App as RootComponent } from "./components/app/index";
import rootSagas from "./modules/sagas";
import { configureStore } from "./redux/store/dev";
import { unregister } from "./serviceWorker";
import "./styles/index.scss";

const initialState: AppState = {
    user: {
        id: "",
        email: "",
        name: "",
        lastName: "",
        token: "",
        success: false,
    },
};
const root = document.getElementById("root");
const store = configureStore(initialState);
store.runSaga(rootSagas);
function init (D: any) {
    render(
        <AppContainer>
            <Provider store={store}>
                <D />
            </Provider>
        </AppContainer>,
        root
    );
}
init(RootComponent);

if ((module as any).hot) {
    (module as any).hot.accept("./components/app/app.component", () => {
        const { App } = require("./components/app/app.component");
        init(App);
    });
}
unregister();
