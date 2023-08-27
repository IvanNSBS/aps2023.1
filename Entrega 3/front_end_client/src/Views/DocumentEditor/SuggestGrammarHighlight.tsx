import React, { FC, ReactElement, useState, useRef, useContext } from 'react';
import { styled } from 'styled-components';
import SuggestGrammarPopup from './SuggestGrammarPopup';
import { TokenInfo } from '../../Business/TextEditor/TextEditorTokenizer';
import { getTextWidth } from '../../Business/TextEditor/TextTokenSelector';
import { AppContext } from '../../AppContext';

export type SuggestGrammarProps = {
    rect: DOMRect;
    word_token: TokenInfo;
    word_suggestion: string;
    accept_grammar_suggestion(word_token: TokenInfo, new_word: string): void;
    cancel_suggest_grammar(): void;
};

type HighlightProps = {
    rect: DOMRect;
};

const HighLightDiv = styled.div<HighlightProps>`
    position: absolute;

    left: ${props => props.rect.x}px;
    top: ${props => props.rect.y}px;

    min-width: ${props => props.rect.width}px;
    min-height: ${props => props.rect.height}px;
    border-bottom-style: dashed;
    border-bottom-width: 2px;
    border-bottom-color: #ac1616c5;

    &:hover{
        cursor: pointer;
    }
`

const SuggestGrammarHighlight: FC<SuggestGrammarProps> = (props: SuggestGrammarProps): ReactElement => {
    const [showSuggestGrammar, setShowSuggestGrammar] = useState<boolean>(false);
    const appContext = useContext(AppContext);

    const handleClick = function() {
        setShowSuggestGrammar(!showSuggestGrammar);
    }

    let popup = <></>;
    if(showSuggestGrammar)
    {
        const width = getTextWidth(props.word_suggestion , "12px Helvetica");
        const height = props.rect.height;
        popup = 
        <SuggestGrammarPopup 
            width={width} 
            height={height} 
            word_suggestion={props.word_suggestion}
            accept_grammar_suggestion={props.accept_grammar_suggestion}
            word_token={props.word_token}
            cancel_suggestion={props.cancel_suggest_grammar}
        />
    }

    return (
        <HighLightDiv onClick={handleClick} rect={props.rect}>
            {popup}
        </HighLightDiv>
    );
}

export default SuggestGrammarHighlight;