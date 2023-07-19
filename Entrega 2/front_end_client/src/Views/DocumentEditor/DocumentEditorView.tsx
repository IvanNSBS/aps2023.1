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
const DocumentNameInput = styled.input`
    border: 0px;
    font-size: 18px;
    margin-bottom: 10px;
`

const DeleteBtnContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
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

    const deleteDocument = async function(evt: any){
        const docInfo = appCtx?.getCurrentDocumentInfo();
        if(!docInfo)
            return;

        if(await confirm("Você tem certeza de que quer fazer isso? Esta ação é irreversível"))
        {
            const deleted = await controller.deleteDocument(docInfo.id);
            if(deleted)
                navigate(-1);
            else
                alert("Não foi possível deletar o documento.")
        }
    }

    return (
        <EditorContainer>
            <EditorHeader>
                <form onSubmit={changeDocumentName}>
                    <DocumentNameInput
                        spellCheck={false}
                        defaultValue={docName}
                        name="document_name"
                        onBlur={changeDocumentName}>
                    </DocumentNameInput>
                </form>
                <button onClick={goToPreviousPage}>Voltar</button>
            </EditorHeader>
            <TextEditor></TextEditor>
            <DeleteBtnContainer>
                <div></div>
                <button onClick={deleteDocument}>Deletar</button>
            </DeleteBtnContainer>
        </EditorContainer>
    )
}

export default DocumentEditorView;