import { db } from '@/src/utils/db.js';
import { TicketItemStatus, Prisma } from "@prisma/client";

//  REQUÊTES DE BASE 

const findAllTicketItems = () => {
    return db.ticketItem.findMany({
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            status: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
            createdAt: true,
            updatedAt: true,
        }
    });
}

const findTicketItemById = (id: string) => {
    return db.ticketItem.findUnique({
        where: { id },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            status: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
            createdAt: true,
            updatedAt: true,
            ticket: true,
        }
    });
}

const findTicketItemByQrCode = (qrCode: string) => {
    return db.ticketItem.findUnique({
        where: { qrCode },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            status: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
            ticket: true,
        }
    });
}

// ========== RECHERCHES SPÉCIFIQUES ==========

const findTicketItemsByTicketId = (ticketId: string) => {
    return db.ticketItem.findMany({
        where: { ticketId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            qrCode: true,
            status: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
            createdAt: true,
        }
    });
}

const findTicketItemsByEmail = (holderEmail: string) => {
    return db.ticketItem.findMany({
        where: { holderEmail },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            status: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
            createdAt: true,
            ticket: {
                select: {
                    id: true,
                    eventId: true,
                    price: true,
                }
            }
        }
    });
}

const findTicketItemsByStatus = (status: TicketItemStatus) => {
    return db.ticketItem.findMany({
        where: { status },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
            createdAt: true,
        }
    });
}

const findTicketItemsByTicketIdAndStatus = (
    ticketId: string,
    status: TicketItemStatus
) => {
    return db.ticketItem.findMany({
        where: {
            ticketId,
            status
        },
        select: {
            id: true,
            qrCode: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
        }
    });
}

// RECHERCHES AVANCÉES 

const findUnusedTicketItems = () => {
    return db.ticketItem.findMany({
        where: {
            status: TicketItemStatus.ISSUED,
        },
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            holderEmail: true,
            holderName: true,
            ticket: {
                select: {
                    id: true,
                    eventId: true,
                }
            }
        }
    });
}

const findTicketItemsByDateRange = (startDate: Date, endDate: Date) => {
    return db.ticketItem.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            ticketId: true,
            status: true,
            holderEmail: true,
            createdAt: true,
        }
    });
}

const searchTicketItemsByEmail = (searchTerm: string) => {
    return db.ticketItem.findMany({
        where: {
            holderEmail: {
                contains: searchTerm,
                mode: 'insensitive',
            }
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            status: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
            createdAt: true,
        }
    });
}

//  CRUD 

const createTicketItem = (data: {
    ticketId: string;
    holderEmail: string;
    holderName?: string;
    status?: TicketItemStatus;
    qrCode?: string;
}) => {
    return db.ticketItem.create({
        data: {
            ticketId: data.ticketId,
            holderEmail: data.holderEmail,
            holderName: data.holderName,
            status: data.status ?? TicketItemStatus.ISSUED,
            qrCode: data.qrCode,
        },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            status: true,
            holderName: true,
            holderEmail: true,
            createdAt: true,
        }
    });
}

const createManyTicketItems = async (data: {
    ticketId: string;
    holderEmail: string;
    holderName?: string;
    status?: TicketItemStatus;
    qrCode?: string;
}[]) => {
    return db.ticketItem.createMany({
        data: data.map(item => ({
            ticketId: item.ticketId,
            holderEmail: item.holderEmail,
            holderName: item.holderName,
            status: item.status ?? TicketItemStatus.ISSUED,
            qrCode: item.qrCode,
        }))
    });
}

const updateTicketItem = (
    id: string,
    data: {
        holderName?: string;
        holderEmail?: string;
        status?: TicketItemStatus;
        usedAt?: Date | null;
    }
) => {
    return db.ticketItem.update({
        where: { id },
        data: {
            ...(data.holderName !== undefined && { holderName: data.holderName }),
            ...(data.holderEmail !== undefined && { holderEmail: data.holderEmail }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.usedAt !== undefined && { usedAt: data.usedAt }),
        },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            status: true,
            holderName: true,
            holderEmail: true,
            usedAt: true,
            updatedAt: true,
        }
    });
}

const deleteTicketItem = async (id: string) => {
    return db.ticketItem.delete({
        where: { id }
    });
}

const deleteTicketItemsByTicketId = async (ticketId: string) => {
    return db.ticketItem.deleteMany({
        where: { ticketId }
    });
}

//  MÉTHODES MÉTIER 

const markTicketItemAsUsed = (
    id: string,
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    return client.ticketItem.update({
        where: { id },
        data: {
            status: TicketItemStatus.USED,
            usedAt: new Date(),
        },
        select: {
            id: true,
            status: true,
            usedAt: true,
        }
    });
}

const cancelTicketItem = (
    id: string,
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    return client.ticketItem.update({
        where: { id },
        data: {
            status: TicketItemStatus.CANCELLED,
        },
        select: {
            id: true,
            status: true,
        }
    });
}

const isValidTicketItem = async (id: string) => {
    const ticket = await db.ticketItem.findUnique({
        where: { id },
        select: { status: true }
    });
    return ticket?.status === TicketItemStatus.ISSUED;
}

//  STATISTIQUES 

const countTicketItemsByStatus = async (ticketId: string) => {
    const [issued, used, cancelled] = await Promise.all([
        db.ticketItem.count({
            where: { ticketId, status: TicketItemStatus.ISSUED }
        }),
        db.ticketItem.count({
            where: { ticketId, status: TicketItemStatus.USED }
        }),
        db.ticketItem.count({
            where: { ticketId, status: TicketItemStatus.CANCELLED }
        }),
    ]);

    return { ISSUED: issued, USED: used, CANCELLED: cancelled };
}

const countTicketItemsByTicket = async (ticketId: string) => {
    return db.ticketItem.count({
        where: { ticketId }
    });
}

// ========== PAGINATION ==========

const findTicketItemsPaginated = async (
    page: number = 1,
    limit: number = 10,
    filters?: {
        ticketId?: string;
        holderEmail?: string;
        status?: TicketItemStatus;
        dateFrom?: Date;
        dateTo?: Date;
    }
) => {
    const skip = (page - 1) * limit;

    const where: Prisma.TicketItemWhereInput = {};

    if (filters?.ticketId) {
        where.ticketId = filters.ticketId;
    }

    if (filters?.holderEmail) {
        where.holderEmail = {
            contains: filters.holderEmail,
            mode: 'insensitive',
        };
    }

    if (filters?.status) {
        where.status = filters.status;
    }

    if (filters?.dateFrom || filters?.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) {
            where.createdAt.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
            where.createdAt.lte = filters.dateTo;
        }
    }

    const [items, total] = await Promise.all([
        db.ticketItem.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                ticketId: true,
                qrCode: true,
                status: true,
                holderName: true,
                holderEmail: true,
                usedAt: true,
                createdAt: true,
                updatedAt: true,
                ticket: {
                    select: {
                        id: true,
                        eventId: true,
                        price: true,
                    }
                }
            }
        }),
        db.ticketItem.count({ where }),
    ]);

    return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

//  FONCTIONS TRANSACTION (avec tx optionnel) 

// Crée un ticket item dans une transaction
const createTicketItemFn = (
    data: {
        ticketId: string;
        holderEmail: string;
        holderName?: string;
        status?: TicketItemStatus;
        qrCode?: string;
    },
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    return client.ticketItem.create({
        data: {
            ticketId: data.ticketId,
            holderEmail: data.holderEmail,
            holderName: data.holderName,
            status: data.status ?? TicketItemStatus.ISSUED,
            qrCode: data.qrCode,
        },
        select: {
            id: true,
            ticketId: true,
            qrCode: true,
            status: true,
            holderEmail: true,
        }
    });
}

// Met à jour le statut d'un ticket item dans une transaction
const updateTicketItemStatus = (
    id: string,
    status: TicketItemStatus,
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    return client.ticketItem.update({
        where: { id },
        data: { status },
        select: {
            id: true,
            status: true,
        }
    });
}

// Marque un ticket item comme utilisé dans une transaction
const useTicketItem = (
    id: string,
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    return client.ticketItem.update({
        where: { id },
        data: {
            status: TicketItemStatus.USED,
            usedAt: new Date(),
        },
        select: {
            id: true,
            status: true,
            usedAt: true,
        }
    });
}



//CRÉATION EN MASSE AVEC GESTION DES DESTINATAIRES

const createManyForTicket = async (
    params: {
        ticketId: string;
        quantity: number;
        recipients?: { email: string; name?: string }[];
        defaultEmail: string;
        defaultName?: string;
    },
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const { ticketId, quantity, recipients = [], defaultEmail, defaultName } = params;

    const data =
        recipients.length > 0
            ? recipients.slice(0, quantity).map(recipient => ({
                ticketId,
                holderEmail: recipient.email,
                holderName: recipient.name || null,
                status: TicketItemStatus.ISSUED,
            }))
            : Array.from({ length: quantity }, () => ({
                ticketId,
                holderEmail: defaultEmail,
                holderName: defaultName || null,
                status: TicketItemStatus.ISSUED,
            }));

    return await client.ticketItem.createManyAndReturn({
        data,
        select: {
            id: true,
            ticketId: true,
            holderEmail: true,
            holderName: true,
            status: true,
        },
    });
}

// Variante avec retour des IDs créés (utile si besoin de récupérer les QR codes)
const createManyForTicketWithIds = async (
    params: {
        ticketId: string;
        quantity: number;
        recipients?: { email: string; name?: string }[];
        defaultEmail: string;
        defaultName?: string;
    },
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const { ticketId, quantity, recipients = [], defaultEmail, defaultName } = params;

    let dataToCreate: { ticketId: string; holderEmail: string; holderName: string | null; status: TicketItemStatus }[];

    if (recipients.length > 0) {
        const recipientsToUse = recipients.slice(0, quantity);
        dataToCreate = recipientsToUse.map(recipient => ({
            ticketId,
            holderEmail: recipient.email,
            holderName: recipient.name || null,
            status: TicketItemStatus.ISSUED,
        }));
    } else {
        dataToCreate = Array.from({ length: quantity }, () => ({
            ticketId,
            holderEmail: defaultEmail,
            holderName: defaultName || null,
            status: TicketItemStatus.ISSUED,
        }));
    }

    // Créer les ticket items
    await client.ticketItem.createMany({
        data: dataToCreate,
    });

    // Récupérer les IDs des ticket items créés (pour pouvoir les utiliser après)
    const createdItems = await client.ticketItem.findMany({
        where: {
            ticketId,
            status: TicketItemStatus.ISSUED,
            holderEmail: {
                in: dataToCreate.map(d => d.holderEmail),
            },
        },
        orderBy: { createdAt: 'desc' },
        take: dataToCreate.length,
        select: {
            id: true,
            qrCode: true,
            holderEmail: true,
            holderName: true,
        },
    });

    return createdItems;
}

// Variante avec création transactionnelle et retour des QR codes
const createTicketItemsWithQrCodes = async (
    params: {
        ticketId: string;
        quantity: number;
        recipients?: { email: string; name?: string }[];
        defaultEmail: string;
        defaultName?: string;
    },
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const { ticketId, quantity, recipients = [], defaultEmail, defaultName } = params;

    let items: {
        ticketId: string;
        holderEmail: string;
        holderName: string | null;
        status: TicketItemStatus;
    }[];

    if (recipients.length > 0) {
        const recipientsToUse = recipients.slice(0, quantity);
        items = recipientsToUse.map(recipient => ({
            ticketId,
            holderEmail: recipient.email,
            holderName: recipient.name || null,
            status: TicketItemStatus.ISSUED,
        }));
    } else {
        items = Array.from({ length: quantity }, () => ({
            ticketId,
            holderEmail: defaultEmail,
            holderName: defaultName || null,
            status: TicketItemStatus.ISSUED,
        }));
    }

    // Création en batch
    await client.ticketItem.createMany({
        data: items,
    });

    // Récupération des items créés avec leurs QR codes
    const createdItems = await client.ticketItem.findMany({
        where: {
            ticketId,
            holderEmail: {
                in: items.map(i => i.holderEmail),
            },
        },
        orderBy: { createdAt: 'desc' },
        take: items.length,
        select: {
            id: true,
            qrCode: true,
            holderEmail: true,
            holderName: true,
            status: true,
            createdAt: true,
        },
    });

    return createdItems;
}




//  EXPORT DU REPOSITORY 

export const TicketItemRepository = {
    findAllTicketItems,
    findTicketItemById,
    findTicketItemByQrCode,
    findTicketItemsByTicketId,
    findTicketItemsByEmail,
    findTicketItemsByStatus,
    findTicketItemsByTicketIdAndStatus,
    findUnusedTicketItems,
    findTicketItemsByDateRange,
    searchTicketItemsByEmail,
    createTicketItem,
    createManyTicketItems,
    updateTicketItem,
    deleteTicketItem,
    deleteTicketItemsByTicketId,
    markTicketItemAsUsed,
    cancelTicketItem,
    isValidTicketItem,
    countTicketItemsByStatus,
    countTicketItemsByTicket,
    findTicketItemsPaginated,
    createTicketItemFn,
    updateTicketItemStatus,
    useTicketItem,
    createManyForTicket,
    createManyForTicketWithIds,
    createTicketItemsWithQrCodes,
};