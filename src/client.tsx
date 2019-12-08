import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { AppState } from "resume-client";
import { App } from "./client/components/app";
import rootSagas from "./client/modules/sagas";
import { configureStore } from "./client/redux/store/dev";
import * as serviceWorker from "./client/serviceWorker";
import "./client/styles/index.scss";

const initialState: AppState = {
    user: {
        id: "",
        email: "",
        name: "",
        lastName: "",
        token: ""
    }
};
const root = document.getElementById("root");
const store = configureStore(initialState);
store.runSaga(rootSagas);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    root
);

serviceWorker.unregister();
