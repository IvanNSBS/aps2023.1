import React, { FC, ReactElement } from 'react';
import { styled } from 'styled-components';
import { SuggestGrammarProps } from './SuggestGrammarHighlight';

const PopupDiv = styled.div<SuggestGrammarProps>`
    position: absolute;
    top: ${props => -props.rect.height-10}px;
    left: ${props => -7}px;
    min-width: ${props => props.rect.width + 5}px;
    min-height: ${props => props.rect.height + 5}px;

    background-color: white;
    color: black;
    border-radius: 3px;
    border: 1px solid black;
    padding: 2px 5px 2px 5px;

    display: flex;
    justify-content: space-between;
    align-items: center;
`

const SuggestGrammarPopup: FC<SuggestGrammarProps> = (props: SuggestGrammarProps): ReactElement => {
    return (
        <PopupDiv rect={props.rect} word_suggestion={props.word_suggestion}>
            {props.word_suggestion}
            <button>x</button>
        </PopupDiv>
    );
}

export default SuggestGrammarPopup;