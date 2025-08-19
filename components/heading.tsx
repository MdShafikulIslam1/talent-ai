import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

const Heading = ({
  title,
  description,
  icon: Icon,
  bgColor,
  iconColor,
}: HeadingProps) => {
  return (
    <div className="px-4 lg:px-8 flex items-center gap-x-4 mb-8">
      <div className={cn("p-2 w-fit rounded-md", bgColor)}>
        <Icon className={cn("w-10 h-10", iconColor)} />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Heading;
