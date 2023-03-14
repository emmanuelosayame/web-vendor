import { UserIcon } from "@heroicons/react/24/solid";
import * as RadixAvatar from "@radix-ui/react-avatar";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: string;
  fallbackStyle?: string;
}

const Avatar = ({
  src,
  alt,
  className,
  fallback,
  fallbackStyle,
}: AvatarProps) => {
  const fallbackInitials = fallback
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join(" ");
  return (
    <RadixAvatar.Root
      className={`inline-flex items-center select-none overflow-hidden shadow-md ${className}`}
    >
      <RadixAvatar.Image
        className="AvatarImage w-full h-full object-cover"
        src={src || undefined}
        alt={alt}
      />
      <RadixAvatar.Fallback
        className="w-full h-full bg-gray-500 p-1 flex text-[whitesmoke] items-center justify-center"
        delayMs={200}
      >
        {!fallback ? (
          <UserIcon width={"100%"} />
        ) : (
          <p className={fallbackStyle}>{fallbackInitials}</p>
        )}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
};

export default Avatar;
