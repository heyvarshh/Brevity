import React, { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';

const VideoPlayer = () => {
  const { currentSession, setVideoTime, setIsPlaying } = useStore();
  const playerRef = useRef(null);
  const frameRef = useRef(null);

  const stopTimeTracking = useCallback(() => {
    if (frameRef.current) {
      clearInterval(frameRef.current);
    }
  }, []);

  const startTimeTracking = useCallback(() => {
    stopTimeTracking(); // Ensure no duplicates
    frameRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setVideoTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  }, [setVideoTime, stopTimeTracking]);

  const initPlayer = useCallback(() => {
    if (!currentSession?.source_url) return;
    
    // Extract video ID
    const videoId = currentSession.source_url.split('v=')[1]?.split('&')[0];
    if (!videoId) return;

    if (!window.YT || !window.YT.Player) return;

    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            startTimeTracking();
          } else {
            setIsPlaying(false);
            stopTimeTracking();
          }
        },
      },
    });
  }, [currentSession, setIsPlaying, startTimeTracking, stopTimeTracking]);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const checkAPI = setInterval(() => {
      if (window.YT && window.YT.Player) {
        initPlayer();
        clearInterval(checkAPI);
      }
    }, 100);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      stopTimeTracking();
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      clearInterval(checkAPI);
    };
  }, [initPlayer, stopTimeTracking]);

  return (
    <div className="w-full h-full bg-black relative">
      <div id="youtube-player" className="w-full h-full"></div>
      {!currentSession && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          No video active
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
