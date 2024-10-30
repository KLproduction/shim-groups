type Props = {
    size: "small" | "large"
}

const Logo = ({ size }: Props) => {
    switch (size) {
        case "small":
            return (
                <div className="relative">
                    <p className=" absolute text-orange-500 top-[-10%] left-[-10%] opacity-0">
                        Shim
                    </p>
                    <h1 className="text-3xl font-bold">Groups</h1>
                </div>
            )
        case "large":
            return (
                <div>
                    <p className="relative font-black text-6xl text-zinc-200 before:absolute before:top-[-30%] before:left-[-20%] before:text-4xl before:text-orange-400 before:content-['shimg'] before:z-[-1]">
                        SHIM-Groups.
                    </p>
                </div>
            )
    }
}

export default Logo
