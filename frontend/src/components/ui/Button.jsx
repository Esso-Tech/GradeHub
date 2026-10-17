export default function Button({
  variant = 'primary', loading = false, disabled, children, type = 'button', className = '', ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? 'Veuillez patienter…' : children}
    </button>
  )
}
