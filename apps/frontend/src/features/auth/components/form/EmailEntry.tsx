import { useSearchParams } from "react-router-dom"
import Button from "../../../../components/ui/Button"
import GoogleButton from "../ui/GoogleButton"
import { SubmitHandler, useForm } from "react-hook-form"
import { EmailCheckSchema, emailCheckSchema } from "../../../../../../types"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useLazyCheckEmailQuery } from "../../slice/authApiSlice"
import FromInput from "../ui/FormInput"
import { useState } from "react"

export const EmailEntry = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [checkEmail] = useLazyCheckEmailQuery()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailCheckSchema>({
    defaultValues: {
      email: searchParams.get("email") || ""
    },
    resolver: zodResolver(emailCheckSchema)
  })

  const onSubmit: SubmitHandler<EmailCheckSchema> = async (data) => {
    setIsLoading(true)
    const { data: response, error } = await checkEmail(data.email)

    if (error) {
      console.log(response)
      setIsLoading(false)
      return
    }

    // Change Query Params
    setSearchParams((params) => {
      params.set("email", data.email)
      response && response.success
        ? params.set("status", "login")
        : params.set("status", "register")

      return params
    })
    setIsLoading(false)
  }

  // Email Validation Error
  errors.email && toast.error(errors.email.message)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
        <h1 className="-mb-2 text-2xl font-bold text-center">
          Submit your&#160;
          <span className="font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
            Email&#160;
          </span>
          below
        </h1>

        <FromInput<EmailCheckSchema>
          label="email"
          register={register}
          variant="email"
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="tracking-widest uppercase"
        >
          {isLoading ? (
            <span className="loading loading-ring loading-lg"></span>
          ) : (
            "continue"
          )}
        </Button>
      </form>
      <div className="divider">OR</div>
      <div className="flex justify-center -mt-3">
        <GoogleButton />
      </div>
    </>
  )
}
