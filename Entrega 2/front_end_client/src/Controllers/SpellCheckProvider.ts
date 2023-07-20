import axios from "axios";
import { ChangeState, TokenChanges, TokenInfo } from "../Business/TextEditor/TextEditorTokenizer";

type ProcessedWord = {
    change: TokenChanges,
    index: number,
    newOffset: number 
}

type SuggestedChanges = {
    oldToken: string,
    processedOffset: number,
    suggestion: string
}

export class SpellCheckProvider
{
    private apiKey: string;
    private url = "https://api.bing.microsoft.com/v7.0/spellcheck?text=";

    constructor() {
        this.apiKey = import.meta.env.VITE_BING_API_KEY;
    }

    public async fetchSuggestions(changes: TokenChanges[]): Promise<TokenChanges[]> {
        if(changes.length === 0)
            return [];

        let words = "";
        let offset = 0;
        const processedWords: ProcessedWord[] = []

        console.log("spell checker will process those tokens:")
        console.log(changes);

        for(let i = 0; i < changes.length; i++)
        {
            const change = changes[i];
            if(change.change_state === ChangeState.DELETED)
                continue;
            if(!change.new_token)
                continue;

            words = words + change.new_token.word + " ";
            processedWords.push({
                change: change,
                index: i,
                newOffset: offset
            });

            offset += change.new_token.word.length + 1;
        }

        const endpoint = `${this.url}${words}`;
        console.log("endpoint: " + endpoint);

        const response = await axios.get(endpoint, { headers: {
            "Ocp-Apim-Subscription-Key": this.apiKey
        }});
    
        const json = JSON.parse(response.request.responseText);
        const flaggedTokens = json.flaggedTokens;
        console.log(json);
        console.log(flaggedTokens);

        let suggestions: SuggestedChanges[] = []

        for(let i = 0; i < flaggedTokens.length; i++)
        {
            const oldToken = flaggedTokens[i].token;
            const stringOffset = flaggedTokens[i].offset;
            const suggestion = flaggedTokens[i].suggestions[0].suggestion;

            const data: SuggestedChanges = {
                oldToken: oldToken,
                processedOffset: stringOffset,
                suggestion: suggestion
            }

            suggestions.push(data);
        }

        const result: TokenChanges[] = [];
        for(let i = 0; i < suggestions.length; i++)
        {
            const suggestion = suggestions[i];
            const word = processedWords.find(x => x.newOffset === suggestion.processedOffset);
            if(!word) {
                console.log(suggestion);
                console.log("Tried to process above suggestion but couldn't find equivalent processed word");
                continue;
            }

            const newToken = word.change.new_token;
            if(!newToken) {
                console.error("Found word but new token was null. This should be impossible");
                continue;
            }

            const newInfo: TokenInfo = {
                uuid: newToken.uuid,
                word: suggestion.suggestion,
                row: newToken.row,
                range_start: newToken.range_start,
                range_end: newToken.range_start + suggestion.suggestion.length
            }

            const out: TokenChanges = {
                change_state: ChangeState.CHANGED,
                prev_token: word?.change.new_token,
                new_token: newInfo
            }

            result.push(out);
        }

        console.log(result);
        return result;
    }
}