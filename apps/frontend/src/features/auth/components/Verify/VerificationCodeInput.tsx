import { forwardRef, InputHTMLAttributes } from "react"

type VerificationCodeInputProps = InputHTMLAttributes<HTMLInputElement>

const VerificationCodeInput = forwardRef<HTMLInputElement, VerificationCodeInputProps>(
    ({ onChange, onKeyDown, value, disabled }, ref) => {
        return (
            <input
                disabled={disabled}
                type="text"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={value}
                ref={ref}
                className="input-bordered input rounded-xl  text-center focus:outline-none uppercase max-w-9 xs:max-w-12 p-0"
                maxLength={1}
            />
        )
    })

export default VerificationCodeInput