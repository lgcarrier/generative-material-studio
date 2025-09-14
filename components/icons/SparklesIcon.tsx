
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <path d="M18 6L19 7" />
    <path d="M12 21v-1" />
    <path d="M6 18l-1-1" />
    <path d="M3 12H2" />
    <path d="M18 18l-1-1" />
    <path d="M6 6l-1 1" />
  </svg>
);
