const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" h-full flex items-center justify-center bg-black">
      <div className="my-12">{children}</div>
    </div>
  )
}

export default AuthLayout
