import React, { FC, ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppRoutes from '../AppRoutes';
import { styled } from 'styled-components';

type DocumentEditorView = {

}

const TextInput = styled.div`
    width: 100%;
    height: 90%;
    resize: none;
    background: white;
    color: black;

    overflow: auto;
    padding: 10px;
    margin-bottom: 30px;
`

const TextContainer = styled.div`

    height: max(90vh, 350px);
    width: 750px;

    display: flex;
    align-items: center;
    justify-content: center;
`

const EditorContainer = styled.div`
    display: flex;
    flex-flow: row;
    flex-direction: column;

    justify-content: space-between;
    align-items: center;
`

const EditorHeader = styled.div`
    width: 100%;
    display: flex;
    align-content: space-between;
    justify-content: space-between;
    margin-bottom: 20px;
`

const TextInputttt: FC<DocumentEditorView> = (props: DocumentEditorView): ReactElement => {
    return (
        <></>
    )
}

const DocumentEditorView: FC<DocumentEditorView> = (props: DocumentEditorView): ReactElement => {
    const navigate = useNavigate();
    const { state } = useLocation();

    return (
        <EditorContainer>
            <EditorHeader>
                <p>Edit {state.document_name} View</p>
                <button onClick={() => navigate(-1)}>Voltar</button>
            </EditorHeader>
            <TextContainer contentEditable='true'>
                <TextInput spellCheck='false'></TextInput>
            </TextContainer>
        </EditorContainer>
    )
}

export default DocumentEditorView;