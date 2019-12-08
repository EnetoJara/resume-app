import { connect } from "react-redux";
import { Register } from "../components/register/register.component";
import { registerUser } from "../modules/user/user.actions";

const toState = null;

const toDispatch = {
    register: registerUser
};

export default connect(toState, toDispatch)(Register);
