import { FieldErrors, SubmitHandler, useForm } from "react-hook-form"
import Button from "../../../../components/ui/Button"
import FromInput from "../ui/FormInput"
import { registerSchema, FormRegisterSchema } from "../../schema/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import EditEmail from "../ui/EditEmail"
import { useSearchParams } from "react-router-dom"
import { useRegisterMutation } from "../../slice/authApiSlice"

export const Register = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || ""
  const [userRegister, { isLoading }] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormRegisterSchema>({
    // Form Validation
    resolver: zodResolver(registerSchema)
  })

  const onSubmit: SubmitHandler<FormRegisterSchema> = async (data) => {
    const response = await userRegister({ ...data, email }).unwrap()

    response.success && toast.success(response.message)
  }

  // handle form error
  const handleError = (error: FieldErrors<FormRegisterSchema>) => {
    if (error.name) return toast.error(error.name.message)
    if (error.password) toast.error(error.password.message)
  }

  errors && handleError(errors)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <h1 className="text-2xl text-center font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
        Create Account&#160;
      </h1>
      <div className="space-y-2">
        <EditEmail email={email} />
        <FromInput register={register} label="name" variant="name" />
      </div>
      <FromInput
        register={register}
        label="password"
        variant="password"
        type="password"
      />
      <Button
        disabled={isLoading}
        type="submit"
        className="tracking-widest uppercase"
      >
        {isLoading ? (
          <span className="loading loading-ring loading-lg"></span>
        ) : (
          "Register"
        )}
      </Button>
    </form>
  )
}
