import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseClasses =
    "btn transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
  };

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
