/* eslint-disable @typescript-eslint/unbound-method */
import type { FastifyInstance } from "fastify";

import { $ref } from "./folder.schemas";
import { getDetailsHandler, getContentsHandler, createFolderHandler } from "./folder.handlers";

async function folderRouter(server: FastifyInstance) {
    server.route({
        method: "GET",
        url: "/get-details",
        // onRequest: [server.authenticate],
        schema: {
            querystring: $ref("getDetailsQuerySchema"),
            response: { 200: $ref("getDetailsResponseSchema") },
        },
        handler: getDetailsHandler,
    });

    server.route({
        method: "GET",
        url: "/get-contents",
        // onRequest: [server.authenticate],
        schema: {
            querystring: $ref("getContentsQuerySchema"),
            response: { 200: $ref("getContentsResponseSchema") },
        },
        handler: getContentsHandler,
    });

    server.route({
        method: "POST",
        url: "/create-folder",
        onRequest: [server.authenticate],
        schema: {
            body: $ref("createFolderSchema"),
            response: { 201: $ref("createFolderResponseSchema") },
        },
        handler: createFolderHandler,
    });
}

export default folderRouter;
