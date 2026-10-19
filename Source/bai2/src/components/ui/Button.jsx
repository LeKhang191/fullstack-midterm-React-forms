/** One shared button for submit, reset and secondary actions.
 * Default type=button avoids accidental submissions inside forms.
 */
export default function Button({
  children, type = 'button', variant = 'primary', loading = false,
  loadingText = 'Đang xử lý...', disabled = false, className = '', ...props
}) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      className={`button button-${variant} ${className}`.trim()}
    >
      {loading ? loadingText : children}
    </button>
  );
}
