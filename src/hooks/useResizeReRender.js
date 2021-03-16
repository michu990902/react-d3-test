import { useState, useEffect } from 'react'

export const useResizeReRender = () => {
    const [refresh, setRefresh] = useState(false);
    const handleResize = () => {
        setRefresh(prev => !prev);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return refresh;
}

