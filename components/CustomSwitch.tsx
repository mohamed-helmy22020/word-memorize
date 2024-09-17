import { Switch } from "@/components/ui/switch";

const CustomSwitch = ({
    title,
    id,
    checked,
    onCheckedChange: onCheckedChange,
}: {
    title: string;
    id?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}) => {
    return (
        <div className="flex justify-center items-center gap-2">
            <label htmlFor={id} className="mb-1 select-none">
                {title}
            </label>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
        </div>
    );
};

export default CustomSwitch;
