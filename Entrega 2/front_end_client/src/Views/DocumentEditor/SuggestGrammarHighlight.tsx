import React, { FC, ReactElement, useState, useRef } from 'react';
import { styled } from 'styled-components';
import SuggestGrammarPopup from './SuggestGrammarPopup';

export type SuggestGrammarProps = {
    rect: DOMRect;
    word_suggestion: string;
}

const HighLightDiv = styled.div<SuggestGrammarProps>`
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

    const handleClick = function() {
        console.log("aiojasoidjshauidsa")
        setShowSuggestGrammar(!showSuggestGrammar);
    }

    let popup = <></>;
    if(showSuggestGrammar)
        popup = <SuggestGrammarPopup rect={props.rect} word_suggestion={props.word_suggestion}></SuggestGrammarPopup>

    return (
        <HighLightDiv rect={props.rect} onClick={handleClick} word_suggestion={props.word_suggestion}>
            {popup}
        </HighLightDiv>
    );
}

export default SuggestGrammarHighlight;