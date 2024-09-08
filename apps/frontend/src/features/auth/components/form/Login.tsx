import { useSearchParams } from "react-router-dom"
import Button from "../../../../components/ui/Button"
import FromInput from "../ui/FormInput"
import EditEmail from "../ui/EditEmail"
import { SubmitHandler, useForm } from "react-hook-form"
import { loginSchema, FormLoginSchema } from "../../schema/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useLoginMutation } from "../../slice/authApiSlice"
import { useAppDispatch } from "../../../../app/hook/useAppStore"
import { setCredential } from "../../slice/authSlice"
import VerificationCodeModal from "../Verify/VerificationCodeModal"
import { useState } from "react"

export const Login = () => {
    const [searchParams] = useSearchParams()
    const [login, { isLoading }] = useLoginMutation()
    const dispatch = useAppDispatch()

    // Verification code activation token
    const [activationToken, setActivationToken] = useState<string | undefined | null>(undefined)

    // React-hook-form Validation
    const { register, handleSubmit, formState: { errors } } = useForm<FormLoginSchema>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit: SubmitHandler<FormLoginSchema> = async (data) => {
        const loginData = { ...data, email }
        const response = await login(loginData).unwrap()

        if (!response.success) return;

        if (response.state !== "loggedIn") {
            // Need Verify with Code
            return setActivationToken(response.activationToken)
        }

        // Login Successfully
        dispatch(setCredential(response))
        toast.success('Login successfully')

    }

    const email = searchParams.get('email') || ''
    errors.password && toast.error(errors.password.message)

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <h1 className="text-2xl font-bold text-center">
                    I'm glad you're back
                </h1>
                <div className="space-y-2">
                    <EditEmail email={email} />
                    <FromInput<FormLoginSchema>
                        register={register}
                        variant="password"
                        type="password"
                        label="password" />
                </div>
                <Button disabled={isLoading} className="tracking-widest uppercase" type="submit">
                    {isLoading ? (<span className="loading loading-ring loading-lg"></span>) : 'Login'}
                </Button>
            </form>
            {activationToken && <VerificationCodeModal
                token={activationToken}
                setActivationToken={setActivationToken}
            />}
        </>
    )
}