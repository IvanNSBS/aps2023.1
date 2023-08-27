import { TokenInfo } from "../Business/TextEditor/TextEditorTokenizer";
import { GrammarCorrection } from "./BingSpellCheckProvider";

export class ISpellCheckProvider{
    public async fetchSuggestions(tokens: TokenInfo[]): Promise<GrammarCorrection[]> {
        return [];
    }
}