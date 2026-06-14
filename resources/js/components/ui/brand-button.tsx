import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'brand' | 'black-pill' | 'white' | 'link';

export interface BrandButtonProps {
    variant?: ButtonVariant;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    children: React.ReactNode;
    showArrow?: boolean;
    target?: string;
    rel?: string;
}

export default function BrandButton({
    variant = 'primary',
    href,
    onClick,
    disabled,
    type = 'button',
    className,
    children,
    showArrow,
    target,
    rel,
    ...props
}: BrandButtonProps & Omit<React.HTMLAttributes<HTMLElement>, 'onClick'>) {
    const isLink = !!href;

    // Default showArrow behavior per variant
    const shouldShowArrow = showArrow ?? (variant === 'primary' || variant === 'secondary' || variant === 'black-pill' || variant === 'link' || variant === 'white');

    // Base styling
    const baseClasses = "group inline-flex items-center justify-center font-semibold transition-all duration-300 select-none disabled:opacity-70 disabled:pointer-events-none";

    // Variant-specific styling
    let variantClasses = "";
    let arrowContainerClasses = "";
    let arrowIconClasses = "";

    switch (variant) {
        case 'primary':
            variantClasses = "rounded-full bg-accent-brand text-white shadow-lg shadow-accent-brand/20 hover:bg-accent-brand/90 pl-6 pr-2 py-2 text-sm gap-4";
            arrowContainerClasses = "flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition-transform duration-200 group-hover:translate-x-0.5";
            arrowIconClasses = "h-4 w-4";
            break;
        case 'secondary':
            variantClasses = "rounded-full bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand/95 pl-6 pr-2 py-2 text-sm gap-4";
            arrowContainerClasses = "flex h-8 w-8 items-center justify-center rounded-full bg-accent-brand text-white transition-transform duration-200 group-hover:translate-x-0.5";
            arrowIconClasses = "h-4 w-4";
            break;
        case 'outline':
            variantClasses = "rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 text-sm";
            break;
        case 'brand':
            variantClasses = "rounded-full bg-brand text-white shadow-md shadow-brand/10 hover:bg-brand/90 px-8 py-3 text-sm";
            break;
        case 'black-pill':
            variantClasses = "rounded-full bg-black text-white hover:bg-slate-900 py-3 pl-6 pr-3 text-sm font-bold gap-6 shadow-lg hover:scale-[1.02] active:scale-[0.98]";
            arrowContainerClasses = "relative flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-b from-white via-slate-100 to-slate-400 shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.3),0_2px_5px_rgba(0,0,0,0.4)] ring-1 ring-white/20";
            arrowIconClasses = "h-5 w-5 text-slate-800 transition-transform duration-300 group-hover:translate-x-0.5";
            break;
        case 'white':
            if (shouldShowArrow) {
                variantClasses = "rounded-full bg-white text-brand shadow-lg hover:bg-gray-50 pl-6 pr-2 py-2 text-sm gap-4";
                arrowContainerClasses = "flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition-transform duration-200 group-hover:translate-x-0.5";
                arrowIconClasses = "h-4 w-4";
            } else {
                variantClasses = "rounded-full bg-white text-brand hover:bg-gray-50 px-8 py-3 text-sm border border-transparent shadow-md";
            }
            break;
        case 'link':
            variantClasses = "text-sm font-bold text-gray-900 transition hover:text-accent-brand gap-3";
            arrowContainerClasses = "flex h-8 w-8 items-center justify-center rounded-full bg-accent-brand text-white transition-transform duration-200 group-hover:translate-x-0.5";
            arrowIconClasses = "h-4 w-4";
            break;
    }

    const combinedClasses = cn(baseClasses, variantClasses, className);

    const content = (
        <>
            <span className="inline-flex items-center gap-2">{children}</span>
            {shouldShowArrow && (
                <span className={arrowContainerClasses}>
                    <ArrowRight className={arrowIconClasses} />
                </span>
            )}
        </>
    );

    if (isLink) {
        return (
            <a
                href={href}
                onClick={onClick}
                className={combinedClasses}
                target={target}
                rel={rel}
                {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedClasses}
            {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {content}
        </button>
    );
}
