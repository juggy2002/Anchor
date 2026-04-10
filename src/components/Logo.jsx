export default function Logo({ className = "h-8" }) {
  return (
    <svg
      viewBox="0 0 220 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Anchor"
    >
      <text
        x="0"
        y="48"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="52"
        fill="#047857"
        fontWeight="400"
        letterSpacing="-1"
      >
        anchor
      </text>
      <line x1="0" y1="56" x2="200" y2="56" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="204" cy="56" r="3" fill="#6ee7b7"/>
    </svg>
  )
}