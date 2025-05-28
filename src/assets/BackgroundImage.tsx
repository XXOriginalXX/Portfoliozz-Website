import React, { useRef, useEffect } from "react";

interface BackgroundImageProps {
  imageUrl?: string;
  playbackSpeed?: number; // optional prop to control speed
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  imageUrl = "https://cdn.pixabay.com/video/2024/11/10/240752.mp4",
  playbackSpeed = 0.4, // default slow speed 0.5x
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <video
        ref={videoRef}
        src={imageUrl}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
        }}
      />
    </div>
  );
};
