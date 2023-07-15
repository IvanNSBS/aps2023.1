import React, { FC, ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppRoutes from '../AppRoutes';

type DocumentEditorView = {

}

const DocumentEditorView: FC<DocumentEditorView> = (props: DocumentEditorView): ReactElement => {
    const navigate = useNavigate();
    const { state } = useLocation();

    return (
        <div>
            <p>Edit {state.document_name} View</p>
            <textarea></textarea>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
    )
}

export default DocumentEditorView;