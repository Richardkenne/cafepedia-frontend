import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  textClassName?: string;
  showText?: boolean;
}

/**
 * Cafepedia logo — single source of truth.
 * To update: replace /public/logo.svg (or logo.png) with the final logo.
 */
export default function Logo({ size = 22, textClassName = "text-xl font-extrabold tracking-tight text-[var(--foreground)]", showText = true }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
      <Image
        src="/logo.svg"
        alt="Cafepedia"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      {showText && (
        <span className={textClassName}>
          Cafepedia
        </span>
      )}
    </Link>
  );
}
