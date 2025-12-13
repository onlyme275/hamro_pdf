// src/components/ui/Button.jsx
// NO CSS MODULE IMPORTS - Using Tailwind classes directly

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  // Define variant styles with dark mode support
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200',
    outline: 'bg-transparent border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  }

  // Define size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  }

  // Combine all classes
  const buttonClasses = `
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    font-medium
    rounded-md
    transition-all
    duration-200
    inline-flex
    items-center
    justify-center
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-blue-500
    dark:focus:ring-blue-400
    dark:focus:ring-offset-gray-900
    disabled:opacity-50
    disabled:cursor-not-allowed
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Example usage:
// <Button variant="primary" size="lg">Click me</Button>
// <Button variant="outline" size="sm">Small outline</Button>
// <Button variant="danger">Delete</Button>