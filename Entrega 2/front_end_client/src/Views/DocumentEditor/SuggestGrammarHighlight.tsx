import React, { FC, ReactElement, useState, useRef } from 'react';
import { styled } from 'styled-components';

type SuggestHighlightProps = {
    rect: DOMRect
}

const HighLightDiv = styled.div<SuggestHighlightProps>`
    position: absolute;

    left: ${props => props.rect.x}px;
    top: ${props => props.rect.y}px;
    /* right: ${props => props.rect.y}px; */
    /* bottom: ${props => props.rect.bottom}px; */

    min-width: ${props => props.rect.width}px;
    min-height: ${props => props.rect.height}px;
    border-bottom-style: dashed;
    border-bottom-width: 2px;
    border-bottom-color: #ac1616c5; 
`

const SuggestGrammarHighlight: FC<SuggestHighlightProps> = (props: SuggestHighlightProps): ReactElement => {


    return (
        <HighLightDiv rect={props.rect}></HighLightDiv>
    );
}

export default SuggestGrammarHighlight;