import Image from "next/image";

const Language = ({
    name,
    isCurrentLanguage,
    handleClick,
}: {
    name: string;
    isCurrentLanguage: boolean;
    handleClick: () => void;
}) => {
    return (
        <div className="language group" onClick={handleClick}>
            <span className="text-white group-hover:text-gray-300 group-hover:underline">
                {name}
            </span>
            {isCurrentLanguage && (
                <Image
                    src="/icons/correct.svg"
                    width={24}
                    height={24}
                    alt="Current Language"
                />
            )}
        </div>
    );
};

export default Language;
