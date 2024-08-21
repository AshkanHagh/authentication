import Button from "../../../../components/ui/Button"
import EmailInput from "../ui/EmailInput"
import GoogleButton from "../ui/GoogleButton"

export const EmailEntry = () => {
    return (
        <>
            <form className="flex flex-col gap-7">
                <h1 className="-mb-2 text-2xl font-bold text-center">
                    Go to the&#160;
                    <span className="font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                        Genius&#160;
                    </span>
                    Gate
                </h1>
                <EmailInput />
                <Button className="tracking-widest uppercase">
                    continue
                </Button>
            </form>
            <div className="divider">OR</div>
            <div className="flex justify-center -mt-3">
                <GoogleButton />
            </div>
        </>
    )
}
