import { twMerge } from "tailwind-merge"
import { FormInputProps, FormInputVariant } from "../../type/types"
import { FieldValues } from "react-hook-form"
import EmailIcon from "../inputIcon/EmailIcon"
import PasswordIcon from "../inputIcon/PasswordIcon"
import NameIcon from "../inputIcon/NameIcon"
import { useState } from "react"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const FromInput = <T extends FieldValues,>({
    className,
    type = 'text',
    register,
    label,
    variant,
    placeholder = label }: FormInputProps<T>) => {

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const getSVG = (SVGType: FormInputVariant | undefined) => {
        switch (SVGType) {
            case 'email':
                return <EmailIcon />
            case 'password':
                return <PasswordIcon />
            case 'name':
                return <NameIcon />
        }
    }

    return (
        <label className={twMerge('flex items-center gap-2 input input-bordered', className)}>
            {getSVG(variant)}
            <input
                {...register(label)}
                type={showPassword ? 'text' : type}
                className="placeholder:capitalize grow"
                placeholder={placeholder} />

            {/* Show Password */}
            {type === 'password' &&
                <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <FaEye size='18' /> : <FaEyeSlash size='19' />}
                </button>}
        </label>
    )
}

export default FromInput