
export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    SUPERADMIN = "SUPERADMIN",
}

export interface User {
    id: string,
    name: string,
    email: string,
    role?: Role,
    phone?: string,
    photo?: string,
    password?: string
}


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
                email?: string;
                phone?: string;
                name?: string;
            };
        }
    }
}