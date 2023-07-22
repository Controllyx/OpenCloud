import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({
    folderDetails,
}: {
    folderDetails: { id: string; name: string; type: string; hierarchy: { id: string; name: string; type: string }[] };
}) {
    return (
        <div className="-mx-3 flex items-center text-3xl font-semibold">
            {folderDetails.hierarchy.reverse().map((folder) => {
                return (
                    <div key={folder.id} className="flex items-center">
                        <BreadcrumbFolder folderName={folder.name} folderId={folder.id} />
                        <div className="block">
                            <ChevronRight className="mt-0.5 h-6" />
                        </div>
                    </div>
                );
            })}

            <BreadcrumbFolder folderName={folderDetails.name} folderId={folderDetails.id} />
        </div>
    );
}

function BreadcrumbFolder({ folderName, folderId }: { folderName: string; folderId: string }) {
    return (
        <Link
            href={`/folder/${folderId}`}
            className="cursor-pointer rounded-xl px-3 pb-1 pt-0.5 hover:bg-black/10 dark:hover:bg-white/20"
        >
            {folderName}
        </Link>
    );
}
