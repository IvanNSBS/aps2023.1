import React, { FC, ReactElement, useContext, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { styled } from 'styled-components';
import { AppContext } from '../AppContext';
import { UserController } from '../Controllers/UserController';

type UserSettingsProps = {
    userController: UserController;
}

const DeleteUserContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 150px;

    &:button
    {
        height: 30px;
    }
`

const UpdateUserInfoForms = styled.form`
    justify-content: start;
    align-content: start;
    display: grid;
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

const ErrorMsg = styled.div`
    color: red;
`

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const UserSettingsView: FC<UserSettingsProps> = (props: UserSettingsProps): ReactElement => {
    const navigate = useNavigate();
    const forms = useRef<HTMLFormElement>(null);
    const appCtx = useContext(AppContext);
    const userController: UserController = props.userController;

    const [emailWasEmpty, setEmailWasEmpty] = useState<boolean>(false);
    const [usernameWasEmpty, setUsernameWasEmpty] = useState<boolean>(false);
    const [passwordWasEmpty, setPasswordWasEmpty] = useState<boolean>(false);

    const handleSubmitUpdateUserInfo = async function(event: any) {
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

        const updated = await userController.updateUserData(email, username, password);
        if(updated)
            alert("Os dados do usuário foram atualizados");
    }

    const handleDeleteUser = async function()
    {
        if(await confirm(
            "Essa ação é irreversível.\n" +
            "Você perderá todos os seus projetos e documentos. " + 
            "Tem certeza de que quer fazer isso?")
        )
        {
        }
    }

    const missingFieldMsg = "Este campo não pode ser vazio";
    const requiredEmailMsg = emailWasEmpty ? <ErrorMsg>{missingFieldMsg}</ErrorMsg> : undefined;
    const requiredUsernameMsg = usernameWasEmpty ? <ErrorMsg>{missingFieldMsg}</ErrorMsg> : undefined;
    const requiredPasswordMsg = passwordWasEmpty ? <ErrorMsg>{missingFieldMsg}</ErrorMsg> : undefined;

    return (
        <div>
            <Header>
                <p>User Settings</p>
                <button onClick={() => navigate(-1)} >Voltar</button>
            </Header>
            <UpdateUserInfoForms onSubmit={handleSubmitUpdateUserInfo} ref={forms}>
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
            </UpdateUserInfoForms>
            <DeleteUserContainer>
                <span></span>
                <button onClick={handleDeleteUser}>Deletar Usuario</button>
            </DeleteUserContainer>
        </div>
    )
}

export default UserSettingsView;