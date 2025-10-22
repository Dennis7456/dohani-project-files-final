
const badgeVariants = {
    default: "inline-flex items-center rounded-full border border-transparent bg-blue-600 text-white px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-blue-700",
    secondary: "inline-flex items-center rounded-full border border-transparent bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-gray-200",
    destructive: "inline-flex items-center rounded-full border border-transparent bg-red-100 text-red-800 px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-red-200",
    outline: "inline-flex items-center rounded-full border border-gray-300 text-gray-700 px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-gray-50",
}

function Badge({ className = "", variant = "default", children, ...props }) {
    const baseClasses = badgeVariants[variant] || badgeVariants.default
    const combinedClasses = `${baseClasses} ${className}`.trim()

    return (
        <span className={combinedClasses} {...props}>
            {children}
        </span>
    )
}

export { Badge }