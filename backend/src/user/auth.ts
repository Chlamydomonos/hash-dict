import { User } from '../db/models/User';

function generateRandomString(length: number = 16): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export type LoginRequest = { name: string; passwordHash: string };
export type LoginResponse = { success: true; session: string } | { success: false; reason: 'not_exist' | 'not_valid' };

class AuthHandler {
    sessions = new Set<string>();

    async login(req: LoginRequest): Promise<LoginResponse> {
        const user = await User.findOne({ where: req });
        if (user != null && user.valid) {
            let session = generateRandomString();
            while (this.sessions.has(session)) {
                session = generateRandomString();
            }
            this.sessions.add(session);
            return { success: true, session };
        }
        return { success: false, reason: user == null ? 'not_exist' : 'not_valid' };
    }

    loggedIn(session: string) {
        return this.sessions.has(session);
    }

    logout(session: string) {
        if (this.sessions.has(session)) {
            this.sessions.delete(session);
        }
    }
}

export const Auth = new AuthHandler();
