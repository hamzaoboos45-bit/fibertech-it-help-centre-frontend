import Image from "next/image";

export default function Logo() {
    return (
        <Image
            src="/FIBERTECH-LOGO/LOGO FIBERTECH.png"
            alt="Fibertech Logo"
            width={220}
            height={100}
            priority
            className="h-auto w-32 md:w-40"
        />
    );
}