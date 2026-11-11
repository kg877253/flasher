import { Link } from "react-router-dom";

// Sliced play button: purple body + light tip separated by a diagonal "flash" cut
export function LogoMark({ size = 32 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="flasher-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b266ff" />
          <stop offset="1" stopColor="#7a2be0" />
        </linearGradient>
        <clipPath id="flasher-clip-left">
          <polygon points="0,0 40,0 28,64 0,64" />
        </clipPath>
        <clipPath id="flasher-clip-right">
          <polygon points="43,0 64,0 64,64 31,64" />
        </clipPath>
      </defs>
      <g clipPath="url(#flasher-clip-left)">
        <path
          d="M19 11 L19 53 L54 32 Z"
          fill="url(#flasher-grad)"
          stroke="url(#flasher-grad)"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </g>
      <g clipPath="url(#flasher-clip-right)" transform="translate(1.5 -3)">
        <path
          d="M19 11 L19 53 L54 32 Z"
          fill="#f0e1ff"
          stroke="#f0e1ff"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function Logo({ size = 32, textClassName = "hidden sm:block" }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <LogoMark size={size} />
      <span className={`${textClassName} text-xl font-extrabold tracking-tight`}>
        Flasher
      </span>
    </Link>
  );
}