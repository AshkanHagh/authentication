import Button from "../../../../components/ui/Button"
import EmailInput from "../ui/EmailInput"
import NameInput from "../ui/NameInput"
import PasswordInput from "../ui/PasswordInput"

export const Register = () => {
    return (
        <form className="flex flex-col gap-7">
            <h1 className="-mb-2 text-2xl font-bold text-center">
                Unlock the&#160;
                <span className="font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                    Genius&#160;
                </span>
                gate
            </h1>
            <NameInput />
            <EmailInput />
            <PasswordInput />
            <Button className="tracking-widest uppercase">
                Register
            </Button>
        </form>
    )
}