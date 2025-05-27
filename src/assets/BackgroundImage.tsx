import React from "react";

interface BackgroundImageProps {
  imageUrl?: string;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({ 
  imageUrl = "https://images.unsplash.com/photo-1640459958548-56c1c6717a40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img 
        src={imageUrl} 
        alt="Sports background"
        className="h-full w-full object-cover"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0
        }}
      />
    </div>
  );
};
