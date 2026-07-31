import { EventImageRepository } from '@/src/repositories/eventImage.repository.js';
import AppError from '@/src/utils/AppError.js';
import { cloudinary } from '@/src/config/cloudinary.js';

interface EventImage {
    id: number;
    eventId: string;
    url: string;
    publicId: string;
    type: string;
    isPrimary: boolean;
    createdAt: Date;
}

interface UploadedFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
}

function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (error:any, result:any) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}

const getEventImages = async (eventId: string): Promise<EventImage[]> => {
    const eventExists = await EventImageRepository.eventExists(eventId);
    if (!eventExists) {
        throw new AppError(404, 'Event not found');
    }

    // Une liste vide est un résultat normal, pas une erreur
    return EventImageRepository.findEventImagesByEventId(eventId);
};

const getEventImageById = async (id: number): Promise<EventImage> => {
    const eventImage = await EventImageRepository.findEventImageById(id);
    if (!eventImage) {
        throw new AppError(404, 'Event image not found');
    }
    return eventImage;
};

const uploadEventImages = async (eventId: string, files: UploadedFile[]): Promise<EventImage[]> => {
    const eventExists = await EventImageRepository.eventExists(eventId);
    if (!eventExists) {
        throw new AppError(404, 'Event not found');
    }

    const existing = await EventImageRepository.findEventImagesByEventId(eventId);
    const hasPrimaryAlready = existing.some((f) => f.isPrimary);

    const created: EventImage[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.mimetype.startsWith('image/');
        const result = await uploadBufferToCloudinary(file.buffer, `events/${eventId}`);

        const record = await EventImageRepository.createEventImage({
            eventId,
            url: result.secure_url,
            publicId: result.public_id,
            type: isImage ? 'image' : 'pdf',
            isPrimary: isImage && !hasPrimaryAlready && i === 0,
        });

        created.push(record);
    }

    return created;
};

const deleteEventImage = async (id: number): Promise<EventImage> => {
    const eventImage = await EventImageRepository.findEventImageById(id);
    if (!eventImage) {
        throw new AppError(404, 'Event image not found');
    }

    // Supprime d'abord sur Cloudinary pour éviter les fichiers orphelins
    await cloudinary.uploader.destroy(eventImage.publicId, {
        resource_type: eventImage.type === 'pdf' ? 'raw' : 'image',
    });

    return EventImageRepository.deleteEventImage(id);
};

const setPrimaryImage = async (id: number): Promise<EventImage> => {
    const eventImage = await EventImageRepository.findEventImageById(id);
    if (!eventImage) {
        throw new AppError(404, 'Event image not found');
    }
    if (eventImage.type !== 'image') {
        throw new AppError(400, 'Only an image can be set as primary');
    }

    await EventImageRepository.unsetPrimaryForEvent(eventImage.eventId);
    return EventImageRepository.setPrimary(id);
};

export const EventImageService = {
    getEventImages,
    getEventImageById,
    uploadEventImages,
    deleteEventImage,
    setPrimaryImage,
};