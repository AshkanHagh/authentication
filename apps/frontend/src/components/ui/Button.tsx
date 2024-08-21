import { twMerge } from "tailwind-merge"
import type { PrimaryButton } from "../../types"

const Button: React.FC<Partial<PrimaryButton>> = ({
    children,
    className,
    type = 'button',
    variant = 'btn-primary',
    size,
    outline,
    active
}) => {
    console.log(outline)
    const isOutline = outline ? 'btn-outline' : ''
    const isActive = active ? 'btn-active' : ''
    console.log('How tot change this pe')

    return (
        <button type={type} className={twMerge("btn",
            className,
            variant,
            size,
            isOutline,
            isActive)}
        >
            {children}
        </button>
    )
}

export default Button