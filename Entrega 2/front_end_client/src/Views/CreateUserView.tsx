import React, { FC, ReactElement, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { styled } from 'styled-components';
import AppRoutes from '../AppRoutes';
import { CreateUserStatus, LoginPresenter } from '../Controllers/LoginController';

type CreateUserProps = {
    loginController: LoginPresenter;
}

const RegisterForms = styled.form`
    justify-content: start;
    align-content: start;
    display: grid;
`

const ErrorMsg = styled.div`
    color: red;
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`

const InputLabel = styled.label`
    display: flex;
    flex-direction: row;
`

const CreateUserView: FC<CreateUserProps> = (props: CreateUserProps): ReactElement => {
    let navigate = useNavigate();
    const controller = props.loginController;
    const forms = useRef<HTMLFormElement>(null);
    const [emailError, setEmailError] = useState<boolean>(false);

    const [emailWasEmpty, setEmailWasEmpty] = useState<boolean>(false);
    const [usernameWasEmpty, setUsernameWasEmpty] = useState<boolean>(false);
    const [passwordWasEmpty, setPasswordWasEmpty] = useState<boolean>(false);

    const handleSubmitForms = async (event: any) => {
        event.preventDefault();

        const email: string = event.target.email.value;
        const username: string = event.target.username.value;
        const password: string = event.target.password.value;

        const emptyEmail = !email || email.length === 0; 
        const emptyUsername = !username || username.length === 0; 
        const emptyPassword = !password || password.length === 0; 
        setEmailWasEmpty(emptyEmail);
        setUsernameWasEmpty(emptyUsername);
        setPasswordWasEmpty(emptyPassword);
        if(emptyEmail || emptyUsername || emptyPassword)
            return;

        const output = await controller.attempt_create_user(email, username, password);
        if(output == CreateUserStatus.SUCCESS) {
            navigate(AppRoutes.login);
            alert("Usuário criado com sucesso!");
        }
        else {
            forms.current?.reset();
            if(output === CreateUserStatus.EMAIL_ALREADY_REGISTERED)
                setEmailError(true);
            else
                alert("Erro desconhecido ao tentar criar uma nova conta");
        }
    }

    const missingFieldMsg = "Este campo é obrigatório"
    const emailErrorMsg = emailError ? <ErrorMsg>Este email já está cadastrado.</ErrorMsg> : undefined;
    const requiredEmailMsg = emailWasEmpty ? <ErrorMsg>{missingFieldMsg}</ErrorMsg> : undefined;
    const requiredUsernameMsg = usernameWasEmpty ? <ErrorMsg>{missingFieldMsg}</ErrorMsg> : undefined;
    const requiredPasswordMsg = passwordWasEmpty ? <ErrorMsg>{missingFieldMsg}</ErrorMsg> : undefined;

    return (
        <>
            <p>Register User View</p>
            <RegisterForms onSubmit={handleSubmitForms} ref={forms}>
                <InputLabel>
                    Email:
                    <InputContainer>
                        <input type='email' id="email" name="email"/>
                        {requiredEmailMsg}
                    </InputContainer>
                </InputLabel>
                <InputLabel>
                    Username:
                    <InputContainer>
                        <input type='text' id="username" name="username"/>
                        {requiredUsernameMsg}
                    </InputContainer>
                </InputLabel>
                <InputLabel>
                    Password:
                    <InputContainer>
                        <input type='password' id="password" name="password"/>
                        {requiredPasswordMsg}
                    </InputContainer>
                </InputLabel>
                <input type="submit" value="Criar Conta"/>
            </RegisterForms>
            {emailErrorMsg}
            <a href={AppRoutes.login}>Voltar</a>
        </>
    )
}

export default CreateUserView;