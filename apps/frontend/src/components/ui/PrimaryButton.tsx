import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type PrimaryButton = {
    children: ReactNode,
    className?: string
    type?: 'submit' | 'reset' | 'button'
}

const PrimaryButton: React.FC<PrimaryButton> = ({ children, className, type }) => {
    return (
        <button type={type} className={twMerge("btn btn-primary focus:outline-none", className)}>
            {children}
        </button>
    )
}

export default PrimaryButton