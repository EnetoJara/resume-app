import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { AppState } from "../types/types";
import { App } from "./components/app/index";
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

render(
    <Provider store={store}>
        <App />
    </Provider>,
    root
);
unregister();
