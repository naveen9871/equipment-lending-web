// components/ui/spinner.tsx - Enhanced version
interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4", 
    lg: "h-16 w-16 border-4"
  }

  return (
    <div className="inline-block">
      <div className={`
        ${sizeClasses[size]}
        animate-spin rounded-full border-border border-t-primary
        ${className}
      `}></div>
    </div>
  )
}