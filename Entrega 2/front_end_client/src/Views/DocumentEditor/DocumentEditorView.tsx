import React, { FC, ReactElement, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import TextEditor from './TextEditor';
import { AppContext } from '../../AppContext';

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
    const appCtx = useContext(AppContext);

    const goToPreviousPage = function(){
        appCtx?.setCurrentDocumentInfo(undefined);
        navigate(-1);
    }

    return (
        <EditorContainer>
            <EditorHeader>
                <p>Edit {appCtx?.getCurrentDocumentInfo()?.name} View</p>
                <button onClick={goToPreviousPage}>Voltar</button>
            </EditorHeader>
            <TextEditor></TextEditor>
        </EditorContainer>
    )
}

export default DocumentEditorView;