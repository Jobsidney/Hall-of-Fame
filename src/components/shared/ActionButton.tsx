type ActionButtonProps = {
  label: string
  ariaLabel?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export function ActionButton({
  label,
  ariaLabel,
  className,
  type = 'button',
  onClick,
}: ActionButtonProps) {
  return (
    <button className={className} type={type} onClick={onClick} aria-label={ariaLabel ?? label}>
      {label}
    </button>
  )
}

