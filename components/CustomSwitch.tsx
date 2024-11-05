import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface switchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    id?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
}
const CustomSwitch: React.FC<switchProps> = ({
    title,
    id,
    checked,
    onCheckedChange: onCheckedChange,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                "flex justify-center items-center gap-2 cursor-pointer",
                className
            )}
        >
            <label htmlFor={id} className="mb-1 select-none cursor-pointer">
                {title}
            </label>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                {...props}
            />
        </div>
    );
};

export default CustomSwitch;
