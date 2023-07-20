import axios from "axios";
import { ChangeState, TokenChanges, TokenInfo } from "../Business/TextEditor/TextEditorTokenizer";

type ProcessedWord = {
    prevToken: TokenInfo,
    index: number,
    newOffset: number 
}

type SuggestedChanges = {
    oldToken: string,
    processedOffset: number,
    suggestion: string
}

export type GrammarCorrection = {
    token: TokenInfo,
    suggestion: string,
}

export class SpellCheckProvider
{
    private apiKey: string;
    private url = "https://api.bing.microsoft.com/v7.0/spellcheck?text=";

    constructor() {
        this.apiKey = import.meta.env.VITE_BING_API_KEY;
    }

    public async fetchSuggestions(tokens: TokenInfo[]): Promise<GrammarCorrection[]> {
        if(tokens.length === 0)
            return [];

        let words = "";
        let offset = 0;
        const processedWords: ProcessedWord[] = []

        console.log("spell checker will process those tokens:")
        console.log(tokens);

        for(let i = 0; i < tokens.length; i++)
        {
            const tk = tokens[i];
            if(!tk)
                continue;

            words = words + tk.word + " ";
            processedWords.push({
                prevToken: tk,
                index: i,
                newOffset: offset
            });

            offset += tk.word.length + 1;
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

        const result: GrammarCorrection[] = [];
        for(let i = 0; i < suggestions.length; i++)
        {
            const suggestion = suggestions[i];
            const word = processedWords.find(x => x.newOffset === suggestion.processedOffset);
            if(!word) {
                console.log(suggestion);
                console.log("Tried to process above suggestion but couldn't find equivalent processed word");
                continue;
            }

            const out: GrammarCorrection = {
                token: word.prevToken,
                suggestion: suggestion.suggestion
            }

            result.push(out);
        }

        console.log(result);
        return result;
    }
}