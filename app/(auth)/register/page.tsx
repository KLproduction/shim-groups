import { RegisterForm } from "@/components/forms/RegisterForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

const RegisterPage = async () => {
    const session = await auth()
    if (session) {
        redirect("/setting")
    }
    return (
        <div className="mt-3">
            <RegisterForm />
        </div>
    )
}

export default RegisterPage
