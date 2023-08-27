import React, { FC, ReactElement, useContext, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { styled } from 'styled-components';
import AppRoutes from '../AppRoutes';
import { LoginPresenter, LoginOutput, LoginStatus } from '../Controllers/LoginController';
import { AppContext } from '../AppContext';

type LoginProps = {
    loginController: LoginPresenter;
}

const LoginForms = styled.form`
    justify-content: start;
    align-content: start;
    display: grid;
`

const WrongInfoMsg = styled.div`
    color: red;
`

const LoginView: FC<LoginProps> = (props: LoginProps): ReactElement => {
    let navigate = useNavigate();
    const forms = useRef<HTMLFormElement>(null);
    const appCtx = useContext(AppContext);
    const [wasWrongInput, setWasWrongInput] = useState<boolean>(false);
    const loginController: LoginPresenter = props.loginController;

    const redirectToProjects = () => {
        navigate(AppRoutes.projects);
    }

    const onSubmitForms = async function(event: any) {
        event.preventDefault();

        const email: string = event.target.email.value;
        const password: string = event.target.password.value;

        const output: LoginOutput = await loginController.attempt_login(email, password);
        console.log(output);
        if(output.loginStatus === LoginStatus.WRONG_USER_NAME_OR_PASSWORD){
            setWasWrongInput(true);
            forms.current?.reset();
        }
        else
        {
            appCtx?.setSession(output.session);
            console.log(output.output)
            redirectToProjects();
        }
    }

    let loginErrorMsg = <></>
    if(wasWrongInput)
        loginErrorMsg = <WrongInfoMsg>Wrong username or password</WrongInfoMsg>

    return (
        <div>
            <p>LoginView</p>
            <LoginForms onSubmit={onSubmitForms} ref={forms}>
                <label>
                    Email: 
                    <input type='email' id="email" name="email"></input>
                </label>
                <label>
                    Password: 
                    <input type='password' id="password" name="password"></input>
                </label>
                <input type="submit" value="Login"/>
            </LoginForms>
            {loginErrorMsg}
            <a href={AppRoutes.register}>Não é cadastrado? Registrar-se</a>
        </div>
    )
}

export default LoginView;