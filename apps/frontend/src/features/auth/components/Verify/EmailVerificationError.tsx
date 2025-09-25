import { Link } from "react-router-dom"
import Button from "../../../../components/ui/Button"

const EmailVerificationError = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl text-error">Verification Failed</h1>
      <Link to="/auth" replace tabIndex={-1}>
        <Button variant="btn-link" className="text-xl text-warning">
          Try again
        </Button>
      </Link>
    </div>
  )
}

export default EmailVerificationError
