import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';

interface ArtPlayerProps {
    option: any;
    getInstance?: (art: Artplayer) => void;
    className?: string;
    style?: React.CSSProperties;
}

const ArtPlayer: React.FC<ArtPlayerProps> = ({ option, getInstance, className, style, ...rest }) => {
    const artRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const art = new Artplayer({
            ...option,
            container: artRef.current!,
        });

        if (getInstance && typeof getInstance === 'function') {
            getInstance(art);
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, []);

    return <div ref={artRef} className={className} style={style} {...rest}></div>;
};

export default ArtPlayer;
