import axios from "axios"
import { GrammarCorrection } from "./BingSpellCheckProvider";
import { TokenInfo } from "../Business/TextEditor/TextEditorTokenizer";
import { ISpellCheckProvider } from "./ISpellCheckProvider";

export class DocumentController
{
    private url: string = "http://127.0.0.1:5000/documents";
    private spellChecker: ISpellCheckProvider;

    constructor(spellcheckProvider: ISpellCheckProvider){
        this.spellChecker = spellcheckProvider;
    }

    public async changeDocumentName(documentId: string, newName: string): Promise<boolean> 
    {
        try
        {
            const endpoint = `${this.url}/set_document_name`;
            const jsonData = {
                "document_id": documentId,
                "new_name": newName
            }
            const {data} = await axios.put(endpoint, jsonData);
            return data;
        }
        catch
        {
            return false;
        }
    }

    public async getDocumentConcent(documentId: string): Promise<string | undefined> { 
        try
        {
            const endpoint = `${this.url}/get_doc_content/${documentId}`;
            const {data} = await axios.get(endpoint);
            return data;
        }
        catch
        {
            return undefined;
        }
    }

    public async saveDocument(documentId: string, docContent: string) : Promise<boolean>{
        try
        {
            const endpoint = `${this.url}/save_doc_content`;
            const jsonData = {
                "document_id": documentId,
                "doc_content": docContent
            }
            await axios.put(endpoint, jsonData);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async deleteDocument(documentId: string) : Promise<boolean> 
    {
        try
        {
            const endpoint = `${this.url}/delete_document/${documentId}`;
            const {data} = await axios.delete(endpoint);
            return data;
        }
        catch
        {
            return false;
        }
    }

    public async getGrammarSuggestions(changes: TokenInfo[]): Promise<GrammarCorrection[]> {
        const result = await this.spellChecker.fetchSuggestions(changes);
        return result;
    }
}
