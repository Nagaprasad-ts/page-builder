import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Stylized layout building blocks representing the page builder and EVP HQ brand colors */}
            <rect x="3" y="3" width="7" height="9" rx="1.5" className="fill-accent-brand stroke-accent-brand" />
            <rect x="14" y="3" width="7" height="5" rx="1" className="fill-brand stroke-brand" />
            <rect x="3" y="16" width="7" height="5" rx="1" className="fill-brand stroke-brand" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" className="fill-accent-brand stroke-accent-brand" />
        </svg>
    );
}
