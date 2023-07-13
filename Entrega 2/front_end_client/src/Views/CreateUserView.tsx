import React, { FC, ReactElement } from 'react';
import { useNavigate } from "react-router-dom";

import { styled } from 'styled-components';
import AppRoutes from '../AppRoutes';

type CreateUserProps = {

}

const RegisterForms = styled.form`
    justify-content: start;
    align-content: start;
    display: grid;
`

const CreateUserView: FC<CreateUserProps> = (props: CreateUserProps): ReactElement => {
    let navigate = useNavigate();

    const redirect_to_login = () => {
        navigate(AppRoutes.login);
    }

    return (
        <>
            <p>Register User View</p>
            <RegisterForms onSubmit={redirect_to_login}>
                <label>
                    Username: 
                    <input type='text'></input>
                </label>
                <label>
                    Password: 
                    <input type='password'></input>
                </label>
                <input type="submit" value="Criar Conta" />
            </RegisterForms>
            <a href={AppRoutes.login}>Voltar</a>
        </>
    )
}

export default CreateUserView;