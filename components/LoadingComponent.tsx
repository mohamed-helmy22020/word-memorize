import { Loader2 } from "lucide-react";

const LoadingComponent = () => {
    return (
        <div className="flex-1 min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin" size={64} />
        </div>
    );
};

export default LoadingComponent;
