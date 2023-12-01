import { cookies } from "next/headers";
import { z } from "zod";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { env } from "@/env/env.mjs";
import { GridLayout } from "./_grid/core-layout";

export default async function FolderView({ params }: { params: { folderId: string } }) {
    const folderId = params.folderId;

    const queryClient = new QueryClient();

    const folderDetailsQuery = queryClient.prefetchQuery({
        queryKey: ["folder-details", folderId],
        queryFn: () => getFolderDetails(folderId),
    });
    const folderContentsQuery = queryClient.prefetchQuery({
        queryKey: ["folder-contents", folderId],
        queryFn: () => getFolderContents(folderId),
    });

    await Promise.all([folderDetailsQuery, folderContentsQuery]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GridLayout folderId={folderId} />
        </HydrationBoundary>
    );
}

async function getFolderDetails(folderId: string) {
    const response = await fetch(`${env.NEXT_PUBLIC_OPENCLOUD_SERVER_URL}/v1/folder/get-details?folderId=${folderId}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    const parsedFolderDetails = getFolderDetailsSchema.safeParse(await response.json());

    if (parsedFolderDetails.success === false) {
        throw new Error("Failed to parse data");
    }

    return parsedFolderDetails;
}

async function getFolderContents(folderId: string) {
    const response = await fetch(
        `${env.NEXT_PUBLIC_OPENCLOUD_SERVER_URL}/v1/folder/get-contents?folderId=${folderId}`,
        {
            headers: { Cookie: cookies().toString() },
        },
    );

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    const parsedFolderContents = getFolderContentsSchema.safeParse(await response.json());

    if (parsedFolderContents.success === false) {
        throw new Error("Failed to parse data");
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
