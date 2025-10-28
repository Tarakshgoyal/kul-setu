interface RamSetuIconProps {
  className?: string;
  size?: number;
}

const RamSetuIcon = ({ className = "", size = 24 }: RamSetuIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Water waves at bottom */}
      <path
        d="M2 18C3 17 4 17 5 18C6 19 7 19 8 18C9 17 10 17 11 18C12 19 13 19 14 18C15 17 16 17 17 18C18 19 19 19 20 18C21 17 22 17 23 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      
      {/* Stone bridge path - curved stones forming a bridge */}
      {/* Row 1 - Bottom stones */}
      <ellipse cx="4" cy="15" rx="1.2" ry="1" fill="currentColor" opacity="0.9" />
      <ellipse cx="7" cy="14.5" rx="1.3" ry="1" fill="currentColor" opacity="0.85" />
      <ellipse cx="10" cy="14" rx="1.2" ry="1" fill="currentColor" opacity="0.9" />
      <ellipse cx="13" cy="13.5" rx="1.3" ry="1" fill="currentColor" opacity="0.85" />
      <ellipse cx="16" cy="14" rx="1.2" ry="1" fill="currentColor" opacity="0.9" />
      <ellipse cx="19" cy="14.5" rx="1.3" ry="1" fill="currentColor" opacity="0.85" />
      
      {/* Row 2 - Middle stones */}
      <ellipse cx="5.5" cy="12" rx="1.1" ry="0.9" fill="currentColor" opacity="0.8" />
      <ellipse cx="8.5" cy="11.5" rx="1.2" ry="0.9" fill="currentColor" opacity="0.75" />
      <ellipse cx="11.5" cy="11" rx="1.1" ry="0.9" fill="currentColor" opacity="0.8" />
      <ellipse cx="14.5" cy="10.5" rx="1.2" ry="0.9" fill="currentColor" opacity="0.75" />
      <ellipse cx="17.5" cy="11" rx="1.1" ry="0.9" fill="currentColor" opacity="0.8" />
      <ellipse cx="20" cy="11.5" rx="1.2" ry="0.9" fill="currentColor" opacity="0.75" />
      
      {/* Row 3 - Top stones */}
      <ellipse cx="7" cy="9" rx="1" ry="0.8" fill="currentColor" opacity="0.7" />
      <ellipse cx="10" cy="8.5" rx="1.1" ry="0.8" fill="currentColor" opacity="0.65" />
      <ellipse cx="13" cy="8" rx="1" ry="0.8" fill="currentColor" opacity="0.7" />
      <ellipse cx="16" cy="8.5" rx="1.1" ry="0.8" fill="currentColor" opacity="0.65" />
      <ellipse cx="19" cy="9" rx="1" ry="0.8" fill="currentColor" opacity="0.7" />
      
      {/* Few stones at the peak */}
      <ellipse cx="8.5" cy="6.5" rx="0.9" ry="0.7" fill="currentColor" opacity="0.6" />
      <ellipse cx="11.5" cy="6" rx="1" ry="0.7" fill="currentColor" opacity="0.55" />
      <ellipse cx="14.5" cy="6.5" rx="0.9" ry="0.7" fill="currentColor" opacity="0.6" />
      <ellipse cx="17.5" cy="7" rx="1" ry="0.7" fill="currentColor" opacity="0.55" />
      
      {/* Top accent stones */}
      <ellipse cx="12" cy="4" rx="0.8" ry="0.6" fill="currentColor" opacity="0.5" />
      <ellipse cx="15" cy="4.5" rx="0.9" ry="0.6" fill="currentColor" opacity="0.45" />
    </svg>
  );
};

export default RamSetuIcon;
