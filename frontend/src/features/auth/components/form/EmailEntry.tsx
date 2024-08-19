import PrimaryButton from "../../../../components/ui/PrimaryButton"
import EmailInput from "../ui/EmailInput"
import GoogleButton from "../ui/GoogleButton"
import multiRectangle from '../../../../assets/svg/multi-rectangle.svg'

const EmailEntry = () => {
    return (
        <>
            <form className="flex flex-col gap-7">
                <h1 className="text-2xl font-bold text-center">
                    Go to the&#160;
                    <span className="font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                        Genius&#160;
                    </span>
                    Gate
                </h1>
                <EmailInput />
                <PrimaryButton className="tracking-widest uppercase" type="button">
                    continue
                </PrimaryButton>
            </form>
            <div className="divider">OR</div>
            <div className="flex justify-center -mt-2">
                <GoogleButton />
            </div>
        </>
    )
}

export default EmailEntry
