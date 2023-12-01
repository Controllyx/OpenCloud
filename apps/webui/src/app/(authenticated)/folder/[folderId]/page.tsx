import { z } from "zod";

import { cookies } from "next/headers";
import { Upload, ArrowDownUp } from "lucide-react";

import { env } from "@/env/env.mjs";
import { Breadcrumb } from "./breadcrumb";
import { GridLayout } from "./_grid/core-layout";

export default async function FolderView({ params }: { params: { folderId: string } }) {
    const folderId = params.folderId;

    const folderDetailsPromise = getFolderDetails(folderId);
    const folderContentsPromise = getFolderContents(folderId);

    const [folderDetails, folderContents] = await Promise.all([folderDetailsPromise, folderContentsPromise]);

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
                    <Breadcrumb folderDetails={folderDetails.data} />
                </div>

                <GridLayout folders={folderContents.data.folders} files={folderContents.data.files} />
            </div>
        </div>
    );
}

async function getFolderDetails(folderId: string) {
    const response = await fetch(`${env.NEXT_PUBLIC_OPENCLOUD_SERVER_URL}/v1/folder/get-details?folderId=${folderId}`, {
        cache: "no-store",
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    const parsedFolderDetails = getFolderDetailsSchema.safeParse(await response.json());

    if (parsedFolderDetails.success === false) {
        throw new Error("Failed to fetch data");
    }

    return parsedFolderDetails;
}

async function getFolderContents(folderId: string) {
    const response = await fetch(
        `${env.NEXT_PUBLIC_OPENCLOUD_SERVER_URL}/v1/folder/get-contents?folderId=${folderId}`,
        {
            cache: "no-store",
            headers: { Cookie: cookies().toString() },
        },
    );

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    const parsedFolderContents = getFolderContentsSchema.safeParse(await response.json());

    if (parsedFolderContents.success === false) {
        throw new Error("Failed to fetch data");
    }

    return parsedFolderContents;
}

const getFolderDetailsSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    hierarchy: z
        .object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
        })
        .array(),
});

const folderSchema = z.object({
    id: z.string(),
    folderName: z.string(),
});

const fileSchema = z.object({
    id: z.string(),
    fileName: z.string(),
});

const getFolderContentsSchema = z.object({
    id: z.string(),
    folders: folderSchema.array(),
    files: fileSchema.array(),
});
