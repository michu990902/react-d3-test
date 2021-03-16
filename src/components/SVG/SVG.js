import React, { useRef, useEffect } from 'react'
import { useResizeReRender } from '../../hooks/useResizeReRender'
import './SVG.css'
import * as d3 from 'd3'

const SVG = () => {
    const wrapperRef = useRef(null);

    const refresh = useResizeReRender();

    useEffect(() => {
        const wrapper = d3.select(wrapperRef.current);        
        const bcr = wrapperRef.current.getBoundingClientRect();
        const svg = wrapper
            .append('svg')
            .attr('width', bcr.width)
            .attr('height', bcr.height);

        return () => {
            wrapper.remove();
        }
    }, [refresh]);

    return (
        <div ref={wrapperRef} className="svg"></div>
    );
};

export default SVG;