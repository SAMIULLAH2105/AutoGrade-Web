export function DoodleBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Layer 1: big strokes */}
      <svg
        className="absolute -top-24 -left-24 h-[520px] w-[520px] text-primary/10"
        viewBox="0 0 520 520"
        fill="none"
      >
        <path
          d="M62 214c56-84 164-126 260-102 98 24 170 116 156 214-12 86-86 154-172 166-106 14-218-46-252-148-18-54-10-98 8-130z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M116 120c22 10 46 28 58 54 20 46-2 108-56 120-44 10-86-14-102-56"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M350 92c-8 46 18 98 64 116 40 16 86 4 112-28"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      {/* Layer 2: dots and small curls */}
      <svg
        className="absolute -bottom-28 -right-28 h-[560px] w-[560px] text-muted-foreground/10"
        viewBox="0 0 560 560"
        fill="none"
      >
        <path
          d="M112 372c52-18 94-64 102-118 10-72-40-142-112-154"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M248 462c-10-42 12-88 54-104 46-18 98 8 114 54"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M402 468c42-12 70-50 68-92-2-40-30-74-68-82"
          stroke="currentColor"
          strokeWidth="2"
        />

        {[
          [92, 470],
          [140, 510],
          [190, 486],
          [420, 120],
          [470, 168],
          [510, 120],
          [484, 220],
          [340, 60],
          [300, 92],
          [84, 112],
          [120, 160],
        ].map(([cx, cy], idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={idx % 3 === 0 ? 4 : 2.5}
            fill="currentColor"
          />
        ))}
      </svg>

      {/* Subtle vignette to keep readability */}
      <div className="absolute inset-0 bg-background/40" />
    </div>
  );
}
