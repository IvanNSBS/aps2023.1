import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import TextEditor from './TextEditor';
import { AppContext } from '../../AppContext';
import { DocumentController } from '../../Controllers/DocumentController';

type DocumentEditorView = {
    documentController: DocumentController;
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
    const controller = props.documentController;
    const [docName, setDocName] = useState<string>();

    useEffect(() => {
        const docInfo = appCtx?.getCurrentDocumentInfo();
        if(docInfo)
            setDocName(docInfo.name);
    }, []);

    const goToPreviousPage = function(){
        appCtx?.setCurrentDocumentInfo(undefined);
        navigate(-1);
    }

    const changeDocumentName = async function(evt: any){
        evt.preventDefault();
        const document = appCtx?.getCurrentDocumentInfo();
        if(!document)
            return;

        const value = evt.target.value? evt.target.value : evt.target.document_name.value;
        const didntChange: boolean = value === docName;
        if(didntChange){
            return;
        }

        setDocName(value);
        controller.changeDocumentName(document.id, value);
    }

    return (
        <EditorContainer>
            <EditorHeader>
                <form onSubmit={changeDocumentName}>
                    <input
                        spellCheck={false}
                        defaultValue={docName}
                        name="document_name"
                        onBlur={changeDocumentName}>
                    </input>
                </form>
                <button onClick={goToPreviousPage}>Voltar</button>
            </EditorHeader>
            <TextEditor></TextEditor>
        </EditorContainer>
    )
}

export default DocumentEditorView;