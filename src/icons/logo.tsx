type Props = {
    size: "small" | "large"
}

const Logo = ({ size }: Props) => {
    switch (size) {
        case "small":
            return (
                <div>
                    <p className="relative font-black text-2xl text-zinc-200 before:absolute before:top-[-30%] before:left-[-30%] before:text-xl before:text-orange-400 before:content-['shimg'] before:z-[-1]">
                        Groups.
                    </p>
                </div>
            )
        case "large":
            return (
                <div>
                    <p className="relative font-black text-6xl text-zinc-200 before:absolute before:top-[-30%] before:left-[-20%] before:text-4xl before:text-orange-400 before:content-['shimg'] before:z-[-1]">
                        Groups.
                    </p>
                </div>
            )
    }
}

export default Logo
