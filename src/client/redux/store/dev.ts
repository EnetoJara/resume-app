import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { AppState } from "../../../types/types";
import { rootReducer } from "../reducers";

export function configureStore (initialState: AppState) {
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [sagaMiddleware];

    return {
        ...createStore(
            rootReducer,
            initialState,
            composeWithDevTools(applyMiddleware(...middleware))
        ),
        runSaga: sagaMiddleware.run,
    };
}
