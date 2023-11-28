"use client";

import { useRouter } from "next/navigation";
import { Download, X } from "lucide-react";

import { env } from "@/env/env.mjs";

export default function ViewModalToolbar({ fileId }: { fileId: string }) {
    const router = useRouter();

    return (
        <div className="flex flex-row items-center">
            <a
                href={`${env.NEXT_PUBLIC_OPENCLOUD_SERVER_URL}/v1/files/download/${fileId}`}
                className=" mr-1.5 flex cursor-pointer items-center rounded-lg p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
                <Download className="m-1 h-8 w-8" />
            </a>
            <button
                onClick={(e) => router.back()}
                className="flex items-center rounded-lg p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
                <X className="h-10 w-10" />
            </button>
        </div>
    );
}
