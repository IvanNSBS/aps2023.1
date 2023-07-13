import React, { FC, ReactElement } from 'react';
import { useNavigate } from "react-router-dom";
import { styled } from 'styled-components';
import AppRoutes from '../AppRoutes';

type LoginProps = {

}

const LoginForms = styled.form`
    justify-content: start;
    align-content: start;
    display: grid;
`

const LoginView: FC<LoginProps> = (props: LoginProps): ReactElement => {
    let navigate = useNavigate();

    const redirect_to_projects = () => {
        navigate(AppRoutes.projects);
    }

    return (
        <div>
            <p>LoginView</p>
            <LoginForms onSubmit={redirect_to_projects}>
                <label>
                    Username: 
                    <input type='text'></input>
                </label>
                <label>
                    Password: 
                    <input type='password'></input>
                </label>
                <input type="submit" value="Login"/>
            </LoginForms>
            <a href={AppRoutes.register}>Não é cadastrado? Registrar-se</a>
        </div>
    )
}

export default LoginView;