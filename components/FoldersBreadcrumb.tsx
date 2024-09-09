import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

const FoldersBreadcrumb = ({ path = [] }: { path?: string[] }) => {
    (path = path.map((p) => `/${p}`)).unshift("");

    const pathItemArray = path.map((p, i) => {
        const linkHref = i == 0 ? "/" : path.slice(0, i + 1).join("");

        return (
            <React.Fragment key={linkHref}>
                {i !== 0 && <BreadcrumbSeparator key={linkHref} />}
                <BreadcrumbItem key={linkHref}>
                    <BreadcrumbLink asChild>
                        <Link href={linkHref}>
                            {i == 0 ? "Home" : p.replace("/", "")}
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </React.Fragment>
        );
    });
    return (
        <Breadcrumb>
            <BreadcrumbList>{pathItemArray}</BreadcrumbList>
        </Breadcrumb>
    );
};

export default FoldersBreadcrumb;
