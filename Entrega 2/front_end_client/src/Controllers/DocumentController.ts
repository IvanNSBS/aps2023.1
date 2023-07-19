import axios from "axios"

export class DocumentController
{
    private url: string = "http://127.0.0.1:5000/documents";

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
}
