import { twMerge } from "tailwind-merge"
import { FormInputProps, FormInputVariant } from "../../type/types"
import { FieldValues } from "react-hook-form"
import EmailIcon from "../inputIcon/EmailIcon"
import PasswordIcon from "../inputIcon/PasswordIcon"
import NameIcon from "../inputIcon/NameIcon"

const FromInput = <T extends FieldValues,>({
    className,
    register,
    label,
    variant,
    placeholder = label }: FormInputProps<T>) => {

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
                type="text"
                className="placeholder:capitalize grow"
                placeholder={placeholder} />
        </label>
    )
}

export default FromInput