import { Image, ImageIcon, LucideIcon } from "lucide-react";

import { useEffect, useState } from "react";

export async function loadIcon(iconName: string): Promise<LucideIcon> {
  try {
    const icons = await import("lucide-react");

    function isValidIcon(key: string): key is keyof typeof icons {
      return key in icons;
    }

    if (isValidIcon(iconName)) {
      return icons[iconName] as LucideIcon;
    }

    return Image;
  } catch {
    return Image;
  }
}

interface DynamicIconProps {
  iconName: string | null;
  className?: string;
  fallbackClassName?: string;
}

export const DynamicIcon = ({
  iconName,
  className = "h-6 w-6",
  fallbackClassName = "h-6 w-6 text-gray-500",
}: DynamicIconProps) => {
  const { IconComponent, loading } = useDynamicIcon(iconName);

  if (loading) {
    return <div className={`${className} animate-pulse rounded bg-gray-200`} />;
  }

  return <IconComponent className={iconName ? className : fallbackClassName} />;
};

const useDynamicIcon = (iconName: string | null) => {
  const [IconComponent, setIconComponent] = useState<LucideIcon>(ImageIcon);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!iconName) {
      setIconComponent(ImageIcon);
      return;
    }

    setLoading(true);
    loadIcon(iconName)
      .then(setIconComponent)
      .finally(() => setLoading(false));
  }, [iconName]);

  return { IconComponent, loading };
};
