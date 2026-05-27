import cetiLogo from "@/assets/logo.svg";

function Header() {
    return (
        <header className="flex items-center justify-between gap-4 w-full">
            <img src={cetiLogo} alt="CETI" className="h-20 w-auto" />

            <span className="font-display text-3xl">Field Trip Explorer</span>
        </header>
    );
}

export default Header;
