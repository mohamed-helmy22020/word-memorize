import FoldersBreadcrumb from "@/components/FoldersBreadcrumb";

const Layout = async ({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: { path?: string[] };
}>) => {
    return (
        <>
            <div className="flex flex-col flex-wrap flex-1 h-fit overflow-auto p-5 gap-7 ">
                <FoldersBreadcrumb path={params.path} />
                {children}
            </div>
        </>
    );
};

export default Layout;
