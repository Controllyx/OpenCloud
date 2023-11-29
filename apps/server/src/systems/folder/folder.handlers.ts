import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import type { getDetailsQuerystring, getContentsQuerystring, createFolderInput } from "./folder.schemas";

export async function getDetailsHandler(
    this: FastifyInstance,
    request: FastifyRequest<{ Querystring: getDetailsQuerystring }>,
    reply: FastifyReply,
) {
    const folderId = request.query.folderId;

    const folder = await this.prisma.folder.findUnique({ where: { id: folderId } });

    if (!folder) {
        return reply.code(404).send({ message: "Something went wrong. Please try again." });
    }

    let currentFolder = folder;
    const hierarchy: { id: string; name: string; type: string }[] = [];

    while (currentFolder.type != "ROOT" && currentFolder.parentFolderId) {
        const parent = await this.prisma.folder.findUnique({ where: { id: currentFolder.parentFolderId } });

        if (!parent) {
            return reply.code(404).send({ message: "Something went wrong. Please try again." });
        }

        hierarchy.push({ id: parent.id, name: parent.folderName, type: parent.type });

        currentFolder = parent;
    }

    return reply.code(200).send({ id: folderId, name: folder.folderName, type: folder.type, hierarchy: hierarchy });
}

export async function getContentsHandler(
    this: FastifyInstance,
    request: FastifyRequest<{ Querystring: getContentsQuerystring }>,
    reply: FastifyReply,
) {
    const folderId = request.query.folderId;

    const user = await this.prisma.user.findUnique({
        where: { id: request.user.id },
        select: {
            displayOrders: {
                where: { folderId: folderId },
            },
        },
    });

    if (!user) {
        return reply.code(500).send({ message: "User not found" });
    }

    const sortDirection = user.displayOrders[0] ? (user.displayOrders[0].Order === "ASC" ? "asc" : "desc") : "asc";

    let contents;

    if (!user.displayOrders[0] || user.displayOrders[0].Type === "NAME") {
        contents = await this.prisma.folder.findFirst({
            where: { id: folderId },
            select: {
                childFolders: {
                    select: { id: true, folderName: true },
                    orderBy: { folderName: sortDirection },
                },
                childFiles: {
                    select: { id: true, fileName: true },
                    orderBy: { fileName: sortDirection },
                },
            },
        });
    } else if (user.displayOrders[0].Type === "DATE_CREATED") {
        contents = await this.prisma.folder.findFirst({
            where: { id: folderId },
            select: {
                childFolders: {
                    select: { id: true, folderName: true },
                    orderBy: { createdAt: sortDirection },
                },
                childFiles: {
                    select: { id: true, fileName: true },
                    orderBy: { createdAt: sortDirection },
                },
            },
        });
    } else if (user.displayOrders[0].Type === "SIZE") {
        contents = await this.prisma.folder.findFirst({
            where: { id: folderId },
            select: {
                // Folders default to sort ascending by name when sorting by size
                childFolders: {
                    select: { id: true, folderName: true },
                    orderBy: { folderName: "asc" },
                },
                childFiles: {
                    select: { id: true, fileName: true },
                    orderBy: { fileSize: sortDirection },
                },
            },
        });
    }

    if (!contents) {
        return reply.code(404).send({ message: "Something went wrong. Please try again." });
    }

    return reply.code(200).send({ id: folderId, folders: contents.childFolders, files: contents.childFiles });
}

export async function createFolderHandler(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: createFolderInput }>,
    reply: FastifyReply,
) {
    const userId = request.user.id;
    const { folderName, parentFolderId } = request.body;

    const existingFolder = await this.prisma.folder.findFirst({
        where: { ownerId: userId, folderName: folderName, parentFolderId: parentFolderId },
    });

    if (existingFolder) {
        return reply.code(400).send({ message: "A folder with this name already exists in the folder" });
    }

    const folder = await this.prisma.folder.create({
        data: {
            ownerId: userId,
            folderName: folderName,
            parentFolderId: parentFolderId,
        },
    });

    return reply.code(201).send({ id: folder.id });
}
