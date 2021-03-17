import React, { useRef, useEffect } from 'react'
import { useResizeReRender } from '../../hooks/useResizeReRender'
import './SVG.css'
import { renderTree } from '../../lib/tree'

const SVG = () => {
    const wrapperRef = useRef(null);

    const refresh = useResizeReRender();

    useEffect(() => {
        //
        const removeFunc = renderTree(wrapperRef);

        //
        return () => {
            // removeFunc();
        }
    }, [refresh]);

    return (
        <div ref={wrapperRef} className="svg"></div>
    );
};

export default SVG;