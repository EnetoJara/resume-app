import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { AppState } from "../../../types/resume-client";
import { rootReducer } from "../reducers";

function configureStore (initialState: AppState) {
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
export { configureStore };
