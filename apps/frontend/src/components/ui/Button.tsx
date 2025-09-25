import { twMerge } from "tailwind-merge"
import type { Button } from "../../types/types"

const Button: React.FC<Button> = ({
  children,
  className,
  type = "button",
  variant = "btn-primary",
  size,
  outline,
  active,
  disabled,
  onClick
}) => {
  const isOutline = outline ? "btn-outline" : ""
  const isActive = active ? "btn-active" : ""

  return (
    <button
      type={type}
      className={twMerge("btn", className, variant, size, isOutline, isActive)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
