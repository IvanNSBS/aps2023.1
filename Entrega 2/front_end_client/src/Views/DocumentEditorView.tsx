import React, { FC, ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import TextEditor from './TextEditor';

type DocumentEditorView = {

}

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

const DocumentEditorView: FC<DocumentEditorView> = (props: DocumentEditorView): ReactElement => {
    const navigate = useNavigate();
    const { state } = useLocation();

    return (
        <EditorContainer>
            <EditorHeader>
                <p>Edit {state.document_name} View</p>
                <button onClick={() => navigate(-1)}>Voltar</button>
            </EditorHeader>
            <TextEditor></TextEditor>
        </EditorContainer>
    )
}

export default DocumentEditorView;