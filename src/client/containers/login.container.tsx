import { connect } from "react-redux";
import { Login } from "../components/login/login.component";
import { loginUser } from "../modules/user/user.actions";

const toState = undefined;

const toDispatch = {
    login: loginUser,
};

export default connect(toState, toDispatch)(Login);
