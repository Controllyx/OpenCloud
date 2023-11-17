import React from "react";
import type { Route } from "next";
import Link from "next/link";
import { FolderClosed } from "lucide-react";

import { getServerSession } from "@/components/auth/server-session";

export default async function Navbar() {
    const session = await getServerSession();

    if (session.status === "error") {
        return <></>;
    }

    return (
        <>
            <div className="h-full w-full border-r border-zinc-300 dark:border-zinc-700">
                {/* Main Subsections */}
                <div className="px-4 py-4 text-left text-2xl font-normal">
                    <div className="flex flex-col">
                        <NavbarLinkComponent
                            LinkDestination={`/folder/${session.data.user.rootFolderId}`}
                            SectionTitle="My Files"
                        >
                            <FolderClosed className="mr-4 mt-1 h-6" />
                        </NavbarLinkComponent>
                    </div>
                </div>
            </div>
        </>
    );
}

function NavbarLinkComponent<T extends string>({
    children,
    LinkDestination,
    SectionTitle,
}: {
    children: React.ReactNode;
    LinkDestination: Route<T>;
    SectionTitle: string;
}) {
    return (
        <Link
            href={LinkDestination}
            className="flex items-center rounded-xl px-4 pb-3 pt-2.5 hover:bg-black/10 dark:hover:bg-white/20"
        >
            {children}
            <span className="items-center self-center whitespace-nowrap">{SectionTitle}</span>
        </Link>
    );
}
