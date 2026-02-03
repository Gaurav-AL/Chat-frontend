import React from 'react';

export default function VideoPlayer() {
  const videoUrl = "/videos/video_to_upload.mp4";

  return (
    <div style={{
      position: 'fixed',      // fixes it to the screen
      top: 0,
      left: 0,
      width: '100vw',         // full viewport width
      height: '100vh',        // full viewport height
      zIndex: -1,             // puts it behind everything
      overflow: 'hidden'
    }}>
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'  // crops video to fill screen without stretching
        }}
      />
    </div>
  );
}