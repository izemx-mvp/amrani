import { Link } from "@tanstack/react-router";

export function Lotus({ className = "h-8 w-8", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* center petal */}
        <path d="M32 12 C 28 22, 28 34, 32 46 C 36 34, 36 22, 32 12 Z" />
        {/* inner petals */}
        <path d="M32 46 C 22 42, 18 32, 20 22 C 26 26, 30 34, 32 46 Z" />
        <path d="M32 46 C 42 42, 46 32, 44 22 C 38 26, 34 34, 32 46 Z" />
        {/* outer petals */}
        <path d="M32 46 C 18 48, 10 40, 8 30 C 16 30, 24 36, 32 46 Z" />
        <path d="M32 46 C 46 48, 54 40, 56 30 C 48 30, 40 36, 32 46 Z" />
        {/* base line */}
        <path d="M12 48 Q 32 54, 52 48" opacity="0.5" />
      </g>
    </svg>
  );
}

export function Logo({ variant = "full", className = "" }: { variant?: "full" | "mark"; className?: string }) {
  if (variant === "mark") {
    return <Lotus className={className || "h-8 w-8"} color="var(--forest)" />;
  }
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <Lotus className="h-9 w-9" color="var(--forest)" />
      <span className="font-serif text-2xl font-medium tracking-wide text-[color:var(--forest)]" style={{ fontFamily: "var(--font-serif)" }}>
        Amrani
      </span>
    </Link>
  );
}
