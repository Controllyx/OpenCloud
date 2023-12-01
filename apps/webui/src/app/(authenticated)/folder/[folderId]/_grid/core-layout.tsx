"use client";

import { useQuery } from "@tanstack/react-query";
import { Upload, ArrowDownUp } from "lucide-react";

import { env } from "@/env/env.mjs";
import { parseFolderDetails, parseFolderContents } from "../folder-fetch";
import { Breadcrumb } from "../breadcrumb";
import { FolderGridCell, FileGridCell } from "./grid-cell";

export function GridLayout({ folderId }: { folderId: string }) {
    const detailsQuery = useQuery({
        queryKey: ["folder-details", folderId],
        queryFn: () => getFolderDetails(folderId),
    });

    const contentsQuery = useQuery({
        queryKey: ["folder-contents", folderId],
        queryFn: () => getFolderContents(folderId),
    });

    if (!detailsQuery.data || !contentsQuery.data) {
        throw new Error("Failed to load folder");
    }

    return (
        <div className="h-full w-full px-6 py-6">
            <div className="mb-5 flex flex-row items-center justify-between rounded-2xl border-2 border-zinc-300 p-1 dark:border-zinc-800">
                <button className="flex items-center rounded-xl px-5 py-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-900">
                    <Upload className="mr-4 h-6" />
                    <span className="items-center self-center whitespace-nowrap text-lg font-semibold">Upload</span>
                </button>

                <div></div>

                <button className="flex items-center rounded-xl px-5 py-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-900">
                    <ArrowDownUp className="mr-4 h-6" />
                    <span className="items-center self-center whitespace-nowrap text-lg font-semibold">Sort</span>
                </button>
            </div>

            <div className="mx-0.5">
                <div className="mb-6">
                    <Breadcrumb folderDetails={detailsQuery.data.data} />
                </div>

                <div className="mb-2 text-xl font-medium">Folders</div>
                <div className="mb-6 grid grid-cols-fs-grid-view gap-4">
                    {contentsQuery.data.data.folders.map((folder) => {
                        return (
                            <div key={folder.id}>
                                <FolderGridCell folderId={folder.id} folderName={folder.folderName} />
                            </div>
                        );
                    })}
                </div>

                <div className="mb-2 text-xl font-medium">Files</div>
                <div className="mb-6 grid grid-cols-fs-grid-view gap-4">
                    {contentsQuery.data.data.files.map((file) => {
                        return (
                            <div key={file.id}>
                                <FileGridCell fileId={file.id} fileName={file.fileName} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

async function getFolderDetails(folderId: string) {
    const response = await fetch(`${env.NEXT_PUBLIC_OPENCLOUD_SERVER_URL}/v1/folder/get-details?folderId=${folderId}`, {
        credentials: "include",
    });

    return parseFolderDetails(response);
}

async function getFolderContents(folderId: string) {
    const response = await fetch(
        `${env.NEXT_PUBLIC_OPENCLOUD_SERVER_URL}/v1/folder/get-contents?folderId=${folderId}`,
        {
            credentials: "include",
        },
    );

    return parseFolderContents(response);
}
