
import React, { useEffect, useRef, useState } from 'react';
import './Storybook.css';

// Declare global types for jQuery and Turn.js if needed (for TypeScript)
declare global {
    interface Window {
        jQuery: any;
        $: any;
    }
}

const assetMap: { [key: number]: string } = {
    1: '/storybook/ant_grasshopper/cover.png',
    4: '/storybook/ant_grasshopper/page4.png',
    6: '/storybook/ant_grasshopper/page6.png',
    8: '/storybook/ant_grasshopper/page8.png',
    10: '/storybook/ant_grasshopper/page10.png',
    12: '/storybook/ant_grasshopper/page12.png',
    14: '/storybook/ant_grasshopper/page14.png',
    16: '/storybook/ant_grasshopper/page16.png',
    18: '/storybook/ant_grasshopper/page18.png',
    20: '/storybook/ant_grasshopper/page20.png',
    22: '/storybook/ant_grasshopper/page22.png',
    24: '/storybook/ant_grasshopper/page24.png',
    26: '/storybook/ant_grasshopper/page26.png',
    28: '/storybook/ant_grasshopper/page28.png',
    30: '/storybook/ant_grasshopper/page30.png'
};

// audioMap: flipbook page number -> audio file
// Both pages of each two-page spread map to the same audio,
// so Read works whichever page Turn.js reports as current.
const audioMap: { [key: number]: string } = {
    4: '/storybook/ant_grasshopper/ant-audio/g1.mp3',   // spread: pages 4-5
    5: '/storybook/ant_grasshopper/ant-audio/g1.mp3',
    6: '/storybook/ant_grasshopper/ant-audio/g2.mp3',   // spread: pages 6-7
    7: '/storybook/ant_grasshopper/ant-audio/g2.mp3',
    8: '/storybook/ant_grasshopper/ant-audio/g3.mp3',   // spread: pages 8-9
    9: '/storybook/ant_grasshopper/ant-audio/g3.mp3',
    10: '/storybook/ant_grasshopper/ant-audio/g4.mp3',   // spread: pages 10-11
    11: '/storybook/ant_grasshopper/ant-audio/g4.mp3',
    12: '/storybook/ant_grasshopper/ant-audio/g5.mp3',   // spread: pages 12-13
    13: '/storybook/ant_grasshopper/ant-audio/g5.mp3',
    14: '/storybook/ant_grasshopper/ant-audio/g6.mp3',   // spread: pages 14-15
    15: '/storybook/ant_grasshopper/ant-audio/g6.mp3',
    16: '/storybook/ant_grasshopper/ant-audio/g7.mp3',   // spread: pages 16-17
    17: '/storybook/ant_grasshopper/ant-audio/g7.mp3',
    18: '/storybook/ant_grasshopper/ant-audio/g8.mp3',   // spread: pages 18-19
    19: '/storybook/ant_grasshopper/ant-audio/g8.mp3',
    20: '/storybook/ant_grasshopper/ant-audio/g9.mp3',   // spread: pages 20-21
    21: '/storybook/ant_grasshopper/ant-audio/g9.mp3',
    22: '/storybook/ant_grasshopper/ant-audio/g10.mp3',  // spread: pages 22-23
    23: '/storybook/ant_grasshopper/ant-audio/g10.mp3',
    24: '/storybook/ant_grasshopper/ant-audio/g11.mp3',  // spread: pages 24-25
    25: '/storybook/ant_grasshopper/ant-audio/g11.mp3',
    26: '/storybook/ant_grasshopper/ant-audio/g12.mp3',  // spread: pages 26-27
    27: '/storybook/ant_grasshopper/ant-audio/g12.mp3',
    28: '/storybook/ant_grasshopper/ant-audio/g13.mp3',  // spread: pages 28-29
    29: '/storybook/ant_grasshopper/ant-audio/g13.mp3',
    30: '/storybook/ant_grasshopper/ant-audio/g14.mp3',  // spread: pages 30-31 (The End)
    31: '/storybook/ant_grasshopper/ant-audio/g14.mp3',
};

const TheAntAndTheGrasshopper: React.FC = () => {
    const flipbookRef = useRef<HTMLDivElement>(null);
    const narratorRef = useRef<HTMLAudioElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [bgMusicOn, setBgMusicOn] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);

    const toggleFullscreen = () => {
        const elem = document.querySelector('.storybook-wrapper');
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };
    const [currentFlipbookPage, setCurrentFlipbookPage] = useState(1);
    const [bgVolume, setBgVolume] = useState(0.5);

    // Sync background volume
    useEffect(() => {
        const bgMusic = document.getElementById('bg-music') as HTMLAudioElement;
        if (bgMusic) {
            bgMusic.volume = bgVolume;
        }
    }, [bgVolume]);

    useEffect(() => {
        const loadScripts = async () => {
            try {
                if (!window.jQuery) {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = '/storybook/jquery.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                    });
                }

                if (!window.jQuery.fn.turn) {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = '/storybook/turn.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                    });
                }
                setIsReady(true);
            } catch (error) {
                console.error("Failed to load scripts", error);
            }
        };

        loadScripts();
    }, []);

    useEffect(() => {
        if (isReady && flipbookRef.current && window.jQuery) {
            const $ = window.jQuery;
            const $flipbook = $(flipbookRef.current);

            $flipbook.turn({
                width: 1030,
                height: 488,
                autoCenter: true,
                when: {
                    turning: function (event: any, page: number, view: any) {
                        setCurrentFlipbookPage(page);
                    },
                    turned: function (event: any, page: number, view: any) {
                        setCurrentFlipbookPage(page);

                        // Stop narrator when page turns
                        if (narratorRef.current) {
                            narratorRef.current.pause();
                            narratorRef.current.currentTime = 0;
                            setIsPaused(true);
                        }

                        const internalMedia = document.querySelectorAll('.flipbook video, .flipbook audio');
                        internalMedia.forEach((media: any) => {
                            media.pause();
                            media.currentTime = 0;
                        });

                        setTimeout(function () {
                            const $visiblePages = $('.flipbook .page:visible, .flipbook > div:visible');
                            $visiblePages.find('video').each(function (this: HTMLMediaElement) {
                                this.currentTime = 0;
                                this.play().catch(e => console.log("Video autoplay blocked", e));
                            });

                            const currentOverlays = document.querySelectorAll(`.flipbook [data-page="${page}"] .overlay`);
                            currentOverlays.forEach(overlay => fitTextContent(overlay));

                            updateVideoSources(page);
                        }, 100);
                    }
                }
            });

            setTimeout(() => {
                fitTextContent();
                updateVideoSources(1);
            }, 500);

            const handleFullscreenChange = () => {
                const isFs = !!document.fullscreenElement;
                setIsFullscreen(isFs);

                const $flipbook = $(flipbookRef.current);
                if ($flipbook.turn) {
                    const margin = isFs ? 200 : 40;
                    const availableWidth = window.innerWidth - margin;
                    const availableHeight = isFs ? window.innerHeight : window.innerHeight - 150;
                    const ratio = 2;

                    let newWidth = availableWidth;
                    let newHeight = newWidth / ratio;

                    if (newHeight > availableHeight) {
                        newHeight = availableHeight;
                        newWidth = newHeight * ratio;
                    }

                    if (isFs) {
                        $flipbook.turn('size', newWidth, newHeight);
                        setTimeout(() => {
                            fitTextContent();
                            updateVideoSources(currentFlipbookPage);
                        }, 300);
                    } else {
                        $flipbook.turn('size', 1030, 488);
                        fitTextContent();
                        updateVideoSources(currentFlipbookPage);
                    }
                }
            };

            document.addEventListener('fullscreenchange', handleFullscreenChange);

            return () => {
                const $ = window.jQuery;
                const $flipbook = $(flipbookRef.current);
                if ($flipbook.turn) {
                    $flipbook.turn('destroy');
                }
                document.removeEventListener('fullscreenchange', handleFullscreenChange);
            };
        }
    }, [isReady]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isReady || !flipbookRef.current) return;
            const $ = window.jQuery;

            if (e.key === 'ArrowLeft') {
                $(flipbookRef.current).turn('previous');
            } else if (e.key === 'ArrowRight') {
                $(flipbookRef.current).turn('next');
            } else if (e.code === 'Space') {
                e.preventDefault();
                playPageAudioManual();
            }
        };

        const handleMouseUpGlobal = () => {
            setIsDraggingVolume(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mouseup', handleMouseUpGlobal);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mouseup', handleMouseUpGlobal);
        };
    }, [isReady]);

    const playPageAudioManual = () => {
        const narrator = narratorRef.current;
        if (!narrator) return;

        const src = audioMap[currentFlipbookPage];
        if (!src) return; // no audio for this page (e.g. image pages, cover)

        // Stop and swap source if needed
        narrator.pause();
        narrator.currentTime = 0;
        if (narrator.getAttribute('src') !== src) {
            narrator.src = src;
            narrator.load();
        }
        narrator.play()
            .then(() => setIsPaused(false))
            .catch(e => console.error('Audio play failed', e));
    };

    const toggleBgMusic = () => {
        const bgMusic = document.getElementById('bg-music') as HTMLAudioElement;
        if (!bgMusic) return;

        if (bgMusicOn) {
            bgMusic.pause();
            setBgMusicOn(false);
        } else {
            bgMusic.play().catch(e => console.log("Bg music play failed", e));
            setBgMusicOn(true);
        }
    };

    const togglePauseAudio = () => {
        const narrator = narratorRef.current;
        if (!narrator) return;

        if (!isPaused) {
            narrator.pause();
            setIsPaused(true);
        } else {
            if (narrator.src && narrator.currentTime > 0) {
                narrator.play()
                    .then(() => setIsPaused(false))
                    .catch(e => console.log('Resume failed', e));
            } else {
                playPageAudioManual();
            }
        }
    };

    const updateVideoSources = (currentPage: number) => {
        const mediaElements = document.querySelectorAll('.flipbook video, .flipbook img[data-page]');
        const range = 4;

        mediaElements.forEach((el: any) => {
            const pageNum = parseInt(el.getAttribute('data-page') || '0');
            if (pageNum === 0) return;

            const isNearby = pageNum >= currentPage - range && pageNum <= currentPage + range;
            const currentSrc = el.getAttribute('src');
            const targetSrc = assetMap[pageNum] || '';

            if (isNearby) {
                if (currentSrc !== targetSrc) {
                    el.setAttribute('src', targetSrc);
                    if (el.tagName === 'VIDEO') {
                        el.load();
                    } else if (el.tagName === 'IMG') {
                        el.style.display = 'block';
                    }
                }
            } else {
                if (currentSrc && currentSrc !== '') {
                    el.setAttribute('src', '');
                    if (el.tagName === 'VIDEO') {
                        el.load();
                    } else if (el.tagName === 'IMG') {
                        el.style.display = 'none';
                    }
                }
            }
        });
    };

    const fitTextContent = (targetElement?: Element) => {
        const overlays = targetElement ? [targetElement] : document.querySelectorAll('.overlay');

        overlays.forEach((overlay: any) => {
            let fontSize = 2.2;
            overlay.style.fontSize = fontSize + 'rem';
            while (overlay.scrollHeight > overlay.clientHeight && fontSize > 0.5) {
                fontSize -= 0.05;
                overlay.style.fontSize = fontSize + 'rem';
            }
        });
    };

    const previousPage = () => {
        if (isReady && flipbookRef.current) {
            window.jQuery(flipbookRef.current).turn('previous');
        }
    }

    const nextPage = () => {
        if (isReady && flipbookRef.current) {
            window.jQuery(flipbookRef.current).turn('next');
        }
    }

    return (
        <div className="storybook-wrapper">
            {isFullscreen && (
                <button className="fullscreen-close-btn" onClick={toggleFullscreen} title="Exit Fullscreen">
                    &times;
                </button>
            )}
            <div className="container" style={{ position: 'relative', zIndex: 20 }}>
                <button className="nav-button prev" onClick={previousPage}>←</button>
                <button className="nav-button next" onClick={nextPage}>→</button>

                <div className="flipbook" ref={flipbookRef}>
                    <div className="hard" style={{ position: 'relative' }}>
                        <img data-page="1" width="100%" height="auto" alt="Cover" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div className="hard">
                        {/* Physical Page 2: Inside Cover with theme background */}
                    </div>

                    {/* Page 3: Credits */}
                    <div>
                        <div className="credits-page small-font">
                            <h2>The Ant and the Grasshopper</h2>
                            <p className="subtitle">A Classic Fable</p>
                            <div className="author-name">
                                Author: Shikkhok Bondhu
                            </div>
                        </div>
                    </div>

                    {/* STORY PAGES START */}
                    {/* Page 4 & 5 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="4" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            An ant and a grasshopper are two good friends. They live in a grassy field.
                        </div>
                        <div className="page-indicator">Page 1</div>
                        <audio id="audio-page-5" src="/storybook/ant_grasshopper/ant-audio/g1.mp3" preload="none"></audio>
                    </div>

                    {/* Page 6 & 7 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="6" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            It is a sunny summer morning. The grasshopper is enjoying the sun.
                        </div>
                        <div className="page-indicator">Page 2</div>
                        <audio id="audio-page-7" src="/storybook/ant_grasshopper/ant-audio/g2.mp3" preload="none"></audio>
                    </div>

                    {/* Page 8 & 9 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="8" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            He is dancing and singing happily. He does not usually like to work.
                        </div>
                        <div className="page-indicator">Page 3</div>
                        <audio id="audio-page-9" src="/storybook/ant_grasshopper/ant-audio/g3.mp3" preload="none"></audio>
                    </div>

                    {/* Page 10 & 11 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="10" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            Now the ant is passing by the grasshopper. She is carrying an ear of corn to her house.
                        </div>
                        <div className="page-indicator">Page 4</div>
                        <audio id="audio-page-11" src="/storybook/ant_grasshopper/ant-audio/g4.mp3" preload="none"></audio>
                    </div>

                    {/* Page 12 & 13 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="12" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            She is storing food for the winter. The grasshopper laughs at her.
                        </div>
                        <div className="page-indicator">Page 5</div>
                        <audio id="audio-page-13" src="/storybook/ant_grasshopper/ant-audio/g5.mp3" preload="none"></audio>
                    </div>

                    {/* Page 14 & 15 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="14" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            He says, “Hey Ant! Why do you work hard all the time? Come and join me. Let’s enjoy the sun.”
                        </div>
                        <div className="page-indicator">Page 6</div>
                        <audio id="audio-page-15" src="/storybook/ant_grasshopper/ant-audio/g6.mp3" preload="none"></audio>
                    </div>

                    {/* Page 16 & 17 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="16" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            The ant replies, “Oh Grasshopper! Winter is coming. Let’s collect some corns together.”
                        </div>
                        <div className="page-indicator">Page 7</div>
                        <audio id="audio-page-17" src="/storybook/ant_grasshopper/ant-audio/g7.mp3" preload="none"></audio>
                    </div>

                    {/* Page 18 & 19 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="18" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            The grasshopper does not listen to her. So, the ant goes her way and continues her work.
                        </div>
                        <div className="page-indicator">Page 8</div>
                        <audio id="audio-page-19" src="/storybook/ant_grasshopper/ant-audio/g8.mp3" preload="none"></audio>
                    </div>

                    {/* Page 20 & 21 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="20" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            After the summer, the winter begins. The days become very cold.
                        </div>
                        <div className="page-indicator">Page 9</div>
                        <audio id="audio-page-21" src="/storybook/ant_grasshopper/ant-audio/g9.mp3" preload="none"></audio>
                    </div>

                    {/* Page 22 & 23 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="22" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            The leaves start to fall everywhere. The grasshopper finds no food to eat.
                        </div>
                        <div className="page-indicator">Page 10</div>
                        <audio id="audio-page-23" src="/storybook/ant_grasshopper/ant-audio/g10.mp3" preload="none"></audio>
                    </div>

                    {/* Page 24 & 25 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="24" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            He starves, and he becomes sad.
                        </div>
                        <div className="page-indicator">Page 11</div>
                        <audio id="audio-page-25" src="/storybook/ant_grasshopper/ant-audio/g11.mp3" preload="none"></audio>
                    </div>

                    {/* Page 26 & 27 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="26" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            On the other hand, the ant has plenty of food.
                        </div>
                        <div className="page-indicator">Page 12</div>
                        <audio id="audio-page-27" src="/storybook/ant_grasshopper/ant-audio/g12.mp3" preload="none"></audio>
                    </div>

                    {/* Page 28 & 29 */}
                    <div style={{ position: 'relative' }}>
                        <img data-page="28" width="100%" height="auto" alt="Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            She is passing her time happily at her cozy home.
                        </div>
                        <div className="page-indicator">Page 13</div>
                        <audio id="audio-page-29" src="/storybook/ant_grasshopper/ant-audio/g13.mp3" preload="none"></audio>
                    </div>

                    {/* END PAGES */}
                    <div className="hard" style={{ position: 'relative' }}>
                        <img data-page="30" width="100%" height="auto" alt="Final Scene" />
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            The End
                        </div>
                        <div className="page-indicator">The End</div>
                        <audio id="audio-page-31" src="/storybook/ant_grasshopper/ant-audio/g14.mp3" preload="none"></audio>
                    </div>

                    <div className="hard">
                        <img src="/storybook/ant_grasshopper/back_cover.png" alt="" style={{ width: '100%', borderRadius: '12px' }} />
                    </div>
                </div>
            </div>

            <div className="btn-flex">
                <button onClick={() => window.location.reload()} className="modern-btn rose-btn">⟳ Reload</button>
                <button
                    onClick={toggleFullscreen}
                    className={`modern-btn ${isFullscreen ? 'glass-btn' : 'amethyst-btn'}`}
                    style={{ minWidth: '160px' }}
                >
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
                <button id="play-audio-btn" onClick={playPageAudioManual} className="modern-btn amethyst-btn">Read</button>
                <button id="pause-audio-btn" onClick={togglePauseAudio} className="modern-btn glass-btn">{isPaused ? 'Play' : 'Pause'}</button>
                <div className="volume-control-wrapper">
                    <button id="bg-music-btn" onClick={toggleBgMusic} className="modern-btn glass-btn">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        {bgMusicOn ? 'Music Off' : 'Music On'}
                    </button>
                    <div className={`volume-slider-container ${isDraggingVolume ? 'active' : ''}`}>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={bgVolume}
                            onInput={(e) => setBgVolume(parseFloat((e.target as HTMLInputElement).value))}
                            onMouseDown={() => setIsDraggingVolume(true)}
                            onMouseUp={() => setIsDraggingVolume(false)}
                            className="volume-slider"
                        />
                    </div>
                </div>
            </div>

            <audio id="bg-music" src="/storybook/audio/bg.mp3" preload="auto" autoPlay loop></audio>
            <audio ref={narratorRef} preload="none"></audio>
        </div>
    );
};

export default TheAntAndTheGrasshopper;
