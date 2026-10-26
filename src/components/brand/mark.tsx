export function RubricMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="4" width="20" height="2.4" fill="currentColor" />
      <rect x="2" y="10.8" width="14" height="2.4" fill="currentColor" />
      <rect x="2" y="17.6" width="9" height="2.4" fill="currentColor" />
      <circle
        cx="19.4"
        cy="18.8"
        r="2.6"
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}
