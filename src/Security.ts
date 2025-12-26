import bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import Config from 'src/services/config/Config';

type TGCMBundle = {
    ct: Buffer;
    iv: Buffer;
    tag: Buffer;
};

export default class Security {
    public static hashString(password: string): string {
        const hashSalt = Config.get<string>('HASH_SALT');

        return bcryptjs.hashSync(password, hashSalt);
    }

    public static encryptAesGCM(plaintext: string): TGCMBundle {
        const aes256GcmKey = Security.getAes256GcmKey();

        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', aes256GcmKey, iv);
        const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        return {
            ct: ciphertext,
            iv: iv,
            tag: tag,
        };
    }

    public static decryptAesGCM(bundle: TGCMBundle): string {
        const aes256GcmKey = Security.getAes256GcmKey();

        const decipher = crypto.createDecipheriv('aes-256-gcm', aes256GcmKey, bundle.iv);
        decipher.setAuthTag(bundle.tag);

        const plaintext = Buffer.concat([decipher.update(bundle.ct), decipher.final()]);

        return plaintext.toString('utf8');
    }

    public static createDigest(plaintext: string): Buffer {
        return crypto.createHash('sha256').update(plaintext).digest();
    }

    private static getAes256GcmKey(): Buffer {
        const base64Key = Config.get<string>('AES256_GCM_KEY');

        const bufferKey = Buffer.from(base64Key, 'base64');

        if (bufferKey.length !== 32) {
            throw new Error(`AES256_GCM_KEY must decode to 32 bytes; got ${bufferKey.length}`);
        }

        return bufferKey;
    }
}
