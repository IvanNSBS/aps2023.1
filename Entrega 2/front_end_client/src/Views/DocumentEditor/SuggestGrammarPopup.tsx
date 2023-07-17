import React, { FC, ReactElement } from 'react';
import { styled } from 'styled-components';

export type SuggestPopupProps = {
    width: number;
    height: number;
    word_suggestion: string;
}

type PopupDivProps = {
    width: number;
    height: number;
}

const reject_btn_width = 15;
const reject_btn_height = 5;

const PopupDiv = styled.div<PopupDivProps>`
    position: absolute;
    top: ${props => -props.height-10}px;
    left: ${props => -reject_btn_width * 0.5}px;
    min-width: ${props => props.width + reject_btn_width + 10}px;
    min-height: ${props => props.height + reject_btn_height}px;

    background-color: white;
    color: black;
    border-radius: 3px;
    border: 1px solid black;
    padding: 2px 5px 2px 5px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    font: 12px Helvetica;
`

const RejectSuggestionBtn = styled.button`
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: ${reject_btn_width}px;
    height: ${reject_btn_width}px;

    padding: 0;
    margin: 0;
`

const SuggestGrammarPopup: FC<SuggestPopupProps> = (props: SuggestPopupProps): ReactElement => {
    return (
        <PopupDiv width={props.width} height={props.height}>
            {props.word_suggestion}
            <RejectSuggestionBtn>x</RejectSuggestionBtn>
        </PopupDiv>
    );
}

export default SuggestGrammarPopup;