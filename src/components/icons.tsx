export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
    <path d="M15.5 8.5 18 11l-2.5 2.5" />
    <path d="M4 14h14" />
    <path d="M6 10h4" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2" />
    <path d="M22 12v4a2 2 0 0 1-2 2h-2" />
  </svg>
);
