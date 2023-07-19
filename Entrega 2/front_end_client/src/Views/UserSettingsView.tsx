import React, { FC, ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { styled } from 'styled-components';
import { AppContext } from '../AppContext';
import { UserAccount, UserController } from '../Controllers/UserController';

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

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
    const [userInfo, setUserInfo] = useState<UserAccount|undefined>(undefined);
    const [emailWasEmpty, setEmailWasEmpty] = useState<boolean>(false);
    const [usernameWasEmpty, setUsernameWasEmpty] = useState<boolean>(false);
    const [passwordWasEmpty, setPasswordWasEmpty] = useState<boolean>(false);

    const [emailField, setEmailField] = useState<string>("");
    const [usernameField, setUsernameField] = useState<string>("");
    const [passwordField, setPasswordField] = useState<string>("");

    useEffect(() => {
        const fetchUserData = async function(){
            const userId = appCtx?.getUserId();
            if(!userId)
                return;

            const info = await userController.getUserAccountInfo(userId);
            if(!info){
                alert("something went wrong when fetching user info");
                return;
            }
            
            setUserInfo(info);
            setEmailField(info.email);
            setUsernameField(info.username);
            setPasswordField(info.password); 
        }

        fetchUserData();
    }, []);

    const handleToggleShowPassword = function(evt: any) {
        evt.preventDefault();
        setShowPassword(!showPassword);
    }

    const handleUpdateEmail = function(evt: any) {
        const newEmail = evt.target.value;
        setEmailField(newEmail);

        const newUserInfo = {
            email: newEmail,
            username: usernameField,
            password: passwordField
        }
        activateChangesCondition(newUserInfo);
    }

    const handleUpdateUsername = function(evt: any) {
        const newUsername = evt.target.value;
        setUsernameField(newUsername);

        const newUserInfo = {
            email: emailField,
            username: newUsername,
            password: passwordField
        }
        activateChangesCondition(newUserInfo);
    }

    const handleUpdatePassword = function(evt: any) {
        const newPassword = evt.target.value;
        setPasswordField(newPassword);

        const newUserInfo = {
            email: emailField,
            username: usernameField,
            password: newPassword
        }
        activateChangesCondition(newUserInfo);
    }

    const activateChangesCondition = function(newInfo: UserAccount) {
        if(!userInfo){
            setDisableSubmit(false);
            return;
        }

        const isEnabled: boolean = ( 
            newInfo.email != userInfo.email || 
            newInfo.username != userInfo.username ||
            newInfo.password != userInfo.password
        );

        setDisableSubmit(!isEnabled);
    }

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
        {
            alert("Os dados do usuário foram atualizados");
            const newUserInfo = {
                email: emailField,
                username: usernameField,
                password: passwordField
            }
            setUserInfo(newUserInfo);
        }
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
                        <input 
                            type='email' 
                            id="email" 
                            name="email" 
                            defaultValue={userInfo?.email}
                            onChange={handleUpdateEmail}
                        />
                        {requiredEmailMsg}
                    </InputContainer>
                </InputLabel>
                <InputLabel>
                    Username:
                    <InputContainer>
                        <input 
                            type='text' 
                            id="username" 
                            name="username" 
                            defaultValue={userInfo?.username}
                            onChange={handleUpdateUsername}
                        />
                        {requiredUsernameMsg}
                    </InputContainer>
                </InputLabel>
                <InputLabel>
                    Password:
                    <InputContainer>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            name="password"
                            defaultValue={userInfo?.password}
                            onChange={handleUpdatePassword}
                        />
                        <button onClick={handleToggleShowPassword}>Show</button>
                        {requiredPasswordMsg}
                    </InputContainer>
                </InputLabel>
                <input 
                    type="submit" 
                    value="Atualizar Dados"
                    disabled={disableSubmit}
                >
                </input>
            </UpdateUserInfoForms>
            <DeleteUserContainer>
                <span></span>
                <button onClick={handleDeleteUser}>Deletar Usuario</button>
            </DeleteUserContainer>
        </div>
    )
}

export default UserSettingsView;