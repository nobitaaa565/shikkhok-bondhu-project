
import React, { useEffect, useRef, useState } from 'react';
import './Storybook.css';

// Declare global types for jQuery and Turn.js if needed (for TypeScript)
declare global {
    interface Window {
        jQuery: any;
        $: any;
    }
}

const videoSourceMap: { [key: number]: string } = {
    1: '/storybook/images/cover.mp4',
    4: '/storybook/images/page4.mp4',
    6: '/storybook/images/page6.mp4',
    8: '/storybook/images/page8.mp4',
    10: '/storybook/images/page10.mp4',
    12: '/storybook/images/page12.mp4',
    14: '/storybook/images/page14.mp4',
    16: '/storybook/images/page16.mp4',
    18: '/storybook/images/page18.mp4',
    20: '/storybook/images/page20.mp4',
    22: '/storybook/images/page22.mp4',
    24: '/storybook/images/page24.mp4',
    26: '/storybook/images/page26.mp4',
    28: '/storybook/images/page28.mp4',
    30: '/storybook/images/page30.mp4',
    32: '/storybook/images/page32.mp4',
    34: '/storybook/images/page34.mp4',
    36: '/storybook/images/page36.mp4',
    38: '/storybook/images/page38.mp4',
    40: '/storybook/images/last_cover.mp4' // Assuming last cover is roughly page 40
};

const Storybook: React.FC = () => {
    const flipbookRef = useRef<HTMLDivElement>(null);
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
    const [pausedAudio, setPausedAudio] = useState<HTMLAudioElement | null>(null);

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
                        console.log("Page turned to:", page);

                        // Stop all page-specific audios when turning
                        const audios = document.querySelectorAll('audio[id^="audio-page-"]');
                        audios.forEach((audio: any) => {
                            audio.pause();
                            audio.currentTime = 0;
                        });

                        // Also pause any videos/audio inside the flipbook itself
                        const internalMedia = document.querySelectorAll('.flipbook video, .flipbook audio');
                        internalMedia.forEach((media: any) => {
                            media.pause();
                            media.currentTime = 0;
                        });

                        // Play only media in the NEWLY visible page (if they have internal media)
                        setTimeout(function () {
                            const $visiblePages = $('.flipbook .page:visible, .flipbook > div:visible');
                            $visiblePages.find('video').each(function (this: HTMLMediaElement) {
                                this.currentTime = 0;
                                this.play().catch(e => console.log("Video autoplay blocked", e));
                            });

                            // Optimized localized text fitting
                            const currentOverlays = document.querySelectorAll(`.flipbook [data-page="${page}"] .overlay`);
                            currentOverlays.forEach(overlay => fitTextContent(overlay));

                            // Lazy load videos based on current page
                            updateVideoSources(page);
                        }, 100);
                    }
                }
            });

            // Initial full pre-fit and video source setup
            setTimeout(() => {
                fitTextContent(); // Global fit once on init
                updateVideoSources(1);
            }, 500);

            const handleFullscreenChange = () => {
                const isFs = !!document.fullscreenElement;
                setIsFullscreen(isFs);

                // Dynamically resize the flipbook based on screen resolution
                const $flipbook = $(flipbookRef.current);
                if ($flipbook.turn) {
                    const margin = isFs ? 200 : 40; // accounted for 100px each side in FS
                    const availableWidth = window.innerWidth - margin;
                    const availableHeight = isFs ? window.innerHeight : window.innerHeight - 150;

                    const ratio = 2; // Strict 2:1 ratio everywhere

                    let newWidth = availableWidth;
                    let newHeight = newWidth / ratio;

                    if (newHeight > availableHeight) {
                        newHeight = availableHeight;
                        newWidth = newHeight * ratio;
                    }

                    // Strict snapping logic
                    if (isFs) {
                        $flipbook.turn('size', newWidth, newHeight);
                        // Re-calculate layouts after a short delay for FS resolution settling
                        setTimeout(() => {
                            fitTextContent();
                            updateVideoSources(currentFlipbookPage);
                        }, 300);
                    } else {
                        // Instant for normal exit
                        $flipbook.turn('size', 1030, 488);
                        fitTextContent();
                        updateVideoSources(currentFlipbookPage);
                    }
                }
            };

            document.addEventListener('fullscreenchange', handleFullscreenChange);

            // Cleanup
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

    // Keydown listener for navigation
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
        // Stop all page audios first
        const audios = document.querySelectorAll('audio[id^="audio-page-"]');
        audios.forEach((audio: any) => {
            audio.pause();
            audio.currentTime = 0;
        });

        console.log("Attempting to play audio for page:", currentFlipbookPage);

        // Play audio for the current page
        const audioId = 'audio-page-' + currentFlipbookPage;
        const audioCurrent = document.getElementById(audioId) as HTMLAudioElement;

        if (audioCurrent) {
            console.log("Playing audio from:", audioCurrent.src);
            audioCurrent.play()
                .then(() => setIsPaused(false))
                .catch(e => {
                    console.error("Audio play failed for " + audioId + ":", e);
                    // If it's a 404, we'll see it in network tab, but we can log it here
                    if (e.name === 'NotSupportedError') {
                        console.warn("Format not supported or file missing.");
                    }
                });
        } else {
            console.warn("No audio element found with ID:", audioId);
        }
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
        let playing: HTMLAudioElement | null = null;

        if (!isPaused) {
            // Find currently playing page audio
            document.querySelectorAll('audio').forEach((audio) => {
                if (!audio.paused && !audio.ended && audio.currentTime > 0 && audio.id !== 'bg-music') {
                    playing = audio;
                }
            });

            if (playing) {
                playing.pause();
                setPausedAudio(playing);
                setIsPaused(true);
                console.log("Paused audio:", playing.id);
            }
        } else {
            if (pausedAudio) {
                pausedAudio.play()
                    .then(() => {
                        setIsPaused(false);
                        setPausedAudio(null);
                        console.log("Resumed audio:", pausedAudio.id);
                    })
                    .catch(e => console.log("Resume failed", e));
            } else {
                // If nothing was tracked as paused, try playing current page audio
                playPageAudioManual();
            }
        }
    };

    const updateVideoSources = (currentPage: number) => {
        const mediaElements = document.querySelectorAll('.flipbook video, .flipbook img[data-page]');
        const range = 4; // Number of pages to keep loaded around the current page

        mediaElements.forEach((el: any) => {
            const pageNum = parseInt(el.getAttribute('data-page') || '0');
            if (pageNum === 0) return;

            const isNearby = pageNum >= currentPage - range && pageNum <= currentPage + range;
            const currentSrc = el.getAttribute('src');
            const targetSrc = videoSourceMap[pageNum] || '';

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
        // If targetElement is provided, fit only that one; otherwise fit all overlays (for initialization)
        const overlays = targetElement ? [targetElement] : document.querySelectorAll('.overlay');

        overlays.forEach((overlay: any) => {
            let fontSize = 2.2; // Matches the new increased default in Storybook.css
            overlay.style.fontSize = fontSize + 'rem';

            // Decrease font size until it fits the container height
            while (overlay.scrollHeight > overlay.clientHeight && fontSize > 0.5) {
                fontSize -= 0.05; // Finer precision for smoother fitting
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
                {/* Navigation Buttons - Adjusted positioning */}
                {/* Navigation Buttons */}
                <button className="nav-button prev" onClick={previousPage}>←</button>
                <button className="nav-button next" onClick={nextPage}>→</button>

                <div className="flipbook" ref={flipbookRef}>
                    <div className="hard" style={{ position: 'relative' }}>
                        <video id="pikachu-video" data-page="1" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    <div className="hard">
                        <img src="/storybook/images/last_cover.png" alt="Logo" style={{ width: '100%', borderRadius: '12px' }} />
                    </div>

                    {/* Page 3: Credits */}
                    <div>
                        <h3>Made by:</h3>
                        <p>Ratri</p>
                        <p>Sunny</p>
                        <p>Tahmina</p>
                    </div>

                    {/* Page 4 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="4" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 5 */}
                    <div>
                        <div className="overlay">
                            In a quiet village, surrounded by golden fields and gentle winds, lived a kind father and his only beautiful and intelligent daughter, Lily.
                        </div>
                        <div className="page-indicator">Page 1</div>
                    </div>

                    {/* Page 6 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="6" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 7 */}
                    <div>
                        <div className="overlay">
                            One day, change arrived at their door. Lily's father couldn't pay the huge debt of the village master. Therefore, the son of the village master wished to marry Lily as an exchange.
                        </div>
                        <div className="page-indicator">Page 2</div>
                    </div>

                    {/* Page 8 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="8" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 9 */}
                    <div>
                        <div className="overlay">
                            But Lily refused kindly, for her heart longed to choose its own path and so the master's son got furious.
                        </div>
                        <div className="page-indicator">Page 3</div>
                    </div>

                    {/* Page 10 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="10" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 11 */}
                    <div>
                        <div className="overlay">
                            Not even that, the master also got furious and hearing the rejection , he called all the villagers and Lily also. And he gave her a test as a punishment to Lily.
                        </div>
                        <div className="page-indicator">Page 4</div>
                    </div>

                    {/* Page 12 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="12" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 13 */}
                    <div>
                        <div className="overlay">
                            Lily got nervous because all the villagers were present there. Thinking of her father's innocent face she was just hearing the master's talks.
                        </div>
                        <div className="page-indicator">Page 5</div>
                    </div>

                    {/* Page 14 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="14" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 15 */}
                    <div>
                        <div className="overlay">
                            The test was like- There will be two bags with two types of stones. A white stone and a black stone defining the luck of Lily. To get rid of it, Lily had to pick the bag with carried white stone.
                        </div>
                        <div className="page-indicator">Page 6</div>
                    </div>

                    {/* Page 16 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="16" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 17 */}
                    <div>
                        <div className="overlay">
                            Hearing all these, Lily just looked mindlessly around.
                        </div>
                        <div className="page-indicator">Page 7</div>
                    </div>

                    {/* Page 18 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="18" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 19 */}
                    <div>
                        <div className="overlay">
                            Lily's sharp eyes caught something others didn't see.
                            The master's son put black stones into both bags .Not a single white stone could be found!
                            The game was a trap.
                        </div>
                        <div className="page-indicator">Page 8</div>
                    </div>

                    {/* Page 20 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="20" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 21 */}
                    <div>
                        <div className="overlay">
                            The villagers got closer, hearts pounding.
                            No one could guess what would happen next. Lily's father was also very tensed and felt guilty. But Lily remained so relaxed.
                        </div>
                        <div className="page-indicator">Page 9</div>
                    </div>

                    {/* Page 22 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="22" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 23 */}
                    <div>
                        <div className="overlay">
                            The bags were handovered to Lily.
                        </div>
                        <div className="page-indicator">Page 10</div>
                    </div>

                    {/* Page 24 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="24" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 25 */}
                    <div>
                        <div className="overlay">
                            So as the rules, she chose one of them and got ready to open it. But she was ready to implement her intelligence and get out of it.
                        </div>
                        <div className="page-indicator">Page 11</div>
                    </div>

                    {/* Page 26 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="26" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 27 */}
                    <div>
                        <div className="overlay">
                            To not get questionable, she made a pissed face about the test.
                        </div>
                        <div className="page-indicator">Page 12</div>
                    </div>

                    {/* Page 28 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="28" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 29 */}
                    <div>
                        <div className="overlay">
                            When she took out the stone, it unfortunately slipped out of hand. The stone got lost in the crowd.
                        </div>
                        <div className="page-indicator">Page 13</div>
                    </div>

                    {/* Page 30 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="30" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 31 */}
                    <div>
                        <div className="overlay">
                            The villagers started to search for the stone but couldn't find it. So, everyone got confused about how to finish the test.
                        </div>
                        <div className="page-indicator">Page 14</div>
                    </div>

                    {/* Page 32 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="32" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 33 */}
                    <div>
                        <div className="overlay">
                            Then Lily told them all, “If the remaining bag has the black stone then the fallen stone was white. And if the remaining bag has the white stone then the fallen stone was black.
                        </div>
                        <div className="page-indicator">Page 15</div>
                    </div>

                    {/* Page 34 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="34" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 35 */}
                    <div>
                        <div className="overlay">
                            As the saying goes, Lily took out the stone and it turned out to be a black stone. According to the rules, Lilly won.
                        </div>
                        <div className="page-indicator">Page 16</div>
                    </div>

                    {/* Page 36 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="36" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 37 */}
                    <div>
                        <div className="overlay">
                            Everyone praised Lily for winning. But only Lily knows how she won it. Her father was very happy and the boy was ashamed.
                        </div>
                        <div className="page-indicator">Page 17</div>
                    </div>

                    {/* Page 38 */}
                    <div style={{ position: 'relative' }}>
                        <video data-page="38" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    {/* Page 39 */}
                    <div>
                        <div className="overlay">
                            The lesson of the story is that, “One has to find the solution by thinking out of the options (Like Lily) and one's bad intentions can never harm others (Like the son of the master).
                        </div>
                        <div className="page-indicator">Page 18</div>
                    </div>

                    {/* Last Pages */}
                    <div className="hard" style={{ position: 'relative' }}>
                        <video data-page="40" width="100%" height="auto" muted preload="metadata"></video>
                        <div className="choppy-effect"></div>
                    </div>
                    <div>
                        <div className="overlay">
                            The End
                        </div>
                        <div className="page-indicator">The End</div>
                    </div>
                    <div className="hard">
                        <img src="/storybook/images/last_cover.png" alt="Logo" style={{ width: '100%', borderRadius: '12px' }} />
                    </div>

                </div>
            </div>

            {/* Controls moved outside and below container */}
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
                            onMouseLeave={() => {
                                // Only stop dragging if mouse is actually up
                                // This handles the edge case of dragging outside the slider
                            }}
                            className="volume-slider"
                        />
                    </div>
                </div>
            </div>

            <audio id="bg-music" src="/storybook/audio/bg.mp3" preload="auto" autoPlay loop></audio>

            {/* Individual Page Audios */}
            <audio id="audio-page-4" src="/storybook/audio/page5.mp3" preload="auto"></audio>
            <audio id="audio-page-5" src="/storybook/audio/page5.mp3" preload="auto"></audio>
            <audio id="audio-page-6" src="/storybook/audio/page7.mp3" preload="auto"></audio>
            <audio id="audio-page-7" src="/storybook/audio/page7.mp3" preload="auto"></audio>
            <audio id="audio-page-8" src="/storybook/audio/page9.mp3" preload="auto"></audio>
            <audio id="audio-page-9" src="/storybook/audio/page9.mp3" preload="auto"></audio>
            <audio id="audio-page-10" src="/storybook/audio/page11.mp3" preload="auto"></audio>
            <audio id="audio-page-11" src="/storybook/audio/page11.mp3" preload="auto"></audio>
            <audio id="audio-page-12" src="/storybook/audio/page13.mp3" preload="auto"></audio>
            <audio id="audio-page-13" src="/storybook/audio/page13.mp3" preload="auto"></audio>
            <audio id="audio-page-14" src="/storybook/audio/page15.mp3" preload="auto"></audio>
            <audio id="audio-page-15" src="/storybook/audio/page15.mp3" preload="auto"></audio>
            <audio id="audio-page-16" src="/storybook/audio/page17.mp3" preload="auto"></audio>
            <audio id="audio-page-17" src="/storybook/audio/page17.mp3" preload="auto"></audio>
            <audio id="audio-page-18" src="/storybook/audio/page19.mp3" preload="auto"></audio>
            <audio id="audio-page-19" src="/storybook/audio/page19.mp3" preload="auto"></audio>
            <audio id="audio-page-20" src="/storybook/audio/page21.mp3" preload="auto"></audio>
            <audio id="audio-page-21" src="/storybook/audio/page21.mp3" preload="auto"></audio>
            <audio id="audio-page-22" src="/storybook/audio/page23.mp3" preload="auto"></audio>
            <audio id="audio-page-23" src="/storybook/audio/page23.mp3" preload="auto"></audio>
            <audio id="audio-page-24" src="/storybook/audio/page25.mp3" preload="auto"></audio>
            <audio id="audio-page-25" src="/storybook/audio/page25.mp3" preload="auto"></audio>
            <audio id="audio-page-26" src="/storybook/audio/page27.mp3" preload="auto"></audio>
            <audio id="audio-page-27" src="/storybook/audio/page27.mp3" preload="auto"></audio>
            <audio id="audio-page-28" src="/storybook/audio/page29.mp3" preload="auto"></audio>
            <audio id="audio-page-29" src="/storybook/audio/page29.mp3" preload="auto"></audio>
            <audio id="audio-page-30" src="/storybook/audio/page31.mp3" preload="auto"></audio>
            <audio id="audio-page-31" src="/storybook/audio/page31.mp3" preload="auto"></audio>
            <audio id="audio-page-32" src="/storybook/audio/page33.mp3" preload="auto"></audio>
            <audio id="audio-page-33" src="/storybook/audio/page33.mp3" preload="auto"></audio>
            <audio id="audio-page-34" src="/storybook/audio/page35.mp3" preload="auto"></audio>
            <audio id="audio-page-35" src="/storybook/audio/page35.mp3" preload="auto"></audio>
            <audio id="audio-page-36" src="/storybook/audio/page37.mp3" preload="auto"></audio>
            <audio id="audio-page-37" src="/storybook/audio/page37.mp3" preload="auto"></audio>
            <audio id="audio-page-38" src="/storybook/audio/page39.mp3" preload="auto"></audio>
            <audio id="audio-page-39" src="/storybook/audio/page39.mp3" preload="auto"></audio>
        </div>
    );
};

export default Storybook;
