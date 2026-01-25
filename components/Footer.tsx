export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-6 text-center text-sm text-gray-500">
            <p>
                &copy; {currentYear} - Made with Love by{" "}
                <a
                    href="https://youtube.com/@kelaswfa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                >
                    KelasWFA
                </a>
            </p>
        </footer>
    );
}
