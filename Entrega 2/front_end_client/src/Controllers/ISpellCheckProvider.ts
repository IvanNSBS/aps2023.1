import { TokenInfo } from "../Business/TextEditor/TextEditorTokenizer";
import { GrammarCorrection } from "./SpellCheckProvider";

export class ISpellCheckProvider{
    public async fetchSuggestions(tokens: TokenInfo[]): Promise<GrammarCorrection[]> {
        return [];
    }
}