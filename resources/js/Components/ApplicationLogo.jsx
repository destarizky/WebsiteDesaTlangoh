export default function ApplicationLogo({ className = 'h-16 w-auto', ...props }) {
    return (
        <img
            src="/images/logodesatlangoh.png"
            alt="Logo Desa Tlangoh"
            className={className}
            {...props}
        />
    );
}