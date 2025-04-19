import { cn } from "@/lib/utils";

interface VmpLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function VmpLogo({ className, ...props }: VmpLogoProps) {
  return (
    <img
      src="/images/vmp-logo-whitebg.png"
      alt="VMP+ Logo"
      className={cn("h-auto w-auto", className)}
      {...props}
    />
  );
} 