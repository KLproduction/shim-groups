import { RegisterForm } from "@/components/forms/RegisterForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

const RegisterPage = async () => {
    const session = await auth()
    if (session) {
        redirect("/setting")
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center flex-col relative">
            <div className="absolute top-[20%] right-[50%] translate-x-[50%] mb-10 pb-10">
                <RegisterForm />
            </div>
        </div>
    )
}

export default RegisterPage
