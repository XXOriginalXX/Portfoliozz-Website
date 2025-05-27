import React from "react";

export const AthleteIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <g clipPath="url(#clip0_1_2)">
        {/* Background splash effect */}
        <path
          d="M550 300C550 439.71 436.71 553 297 553C157.29 553 44 439.71 44 300C44 160.29 157.29 47 297 47C436.71 47 550 160.29 550 300Z"
          fill="#f1f1f1"
          opacity="0.7"
        />

        {/* Basketball player body */}
        <path
          d="M350 180C375.4 180 396 159.4 396 134C396 108.6 375.4 88 350 88C324.6 88 304 108.6 304 134C304 159.4 324.6 180 350 180Z"
          fill="#000000"
        />

        {/* Basketball jersey */}
        <path
          d="M304 200C304 200 290 250 304 330C318 410 304 480 304 480H396C396 480 382 410 396 330C410 250 396 200 396 200H304Z"
          fill="#EF4444"
        />

        {/* Basketball shorts */}
        <path
          d="M324 330C324 330 290 380 304 450C318 520 334 540 334 540H366C366 540 382 520 396 450C410 380 376 330 376 330H324Z"
          fill="#000000"
        />

        {/* Basketball shoes */}
        <path
          d="M304 540C304 540 290 560 304 580C318 600 364 600 396 580C428 560 420 540 420 540H304Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="4"
        />

        {/* Shoe details */}
        <path
          d="M320 560C320 560 350 570 380 560"
          stroke="#EF4444"
          strokeWidth="6"
        />

        {/* Arms in motion */}
        <path
          d="M304 200C304 200 240 220 220 250C200 280 180 320 180 320"
          fill="#000000"
        />
        <path
          d="M396 200C396 200 450 190 480 250C510 310 540 340 540 340"
          fill="#000000"
        />

        {/* Swoosh logo on jersey */}
        <path
          d="M350 300C350 300 360 310 370 300"
          stroke="#ffffff"
          strokeWidth="3"
        />

        {/* Motion lines */}
        <path
          d="M480 250C480 250 490 240 500 250"
          stroke="#000000"
          strokeWidth="2"
        />
        <path
          d="M500 280C500 280 510 270 520 280"
          stroke="#000000"
          strokeWidth="2"
        />
        <path
          d="M520 310C520 310 530 300 540 310"
          stroke="#000000"
          strokeWidth="2"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <rect width="600" height="600" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
