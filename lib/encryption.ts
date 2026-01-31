import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const ALGORITHM = "aes-256-cbc";
const KEY_LEN = 32;
const IV_LEN = 16;

const scryptAsync = promisify(scrypt);

export async function encrypt(text: string): Promise<string> {
    const password = process.env.ENCRYPTION_PASSWORD!;
    const iv = randomBytes(IV_LEN);
    const key = (await scryptAsync(password, "salt", KEY_LEN)) as Buffer;

    const cipher = createCipheriv(
        ALGORITHM,
        (key as Uint8Array).subarray(),
        (iv as Uint8Array).subarray(),
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + encrypted;
}

export async function decrypt(ciphertextWithIV: string): Promise<string> {
    const password = process.env.ENCRYPTION_PASSWORD!;
    const ivHex = ciphertextWithIV.slice(0, IV_LEN * 2);
    const encryptedData = ciphertextWithIV.slice(IV_LEN * 2);

    const iv = Buffer.from(ivHex, "hex");
    const key = (await scryptAsync(password, "salt", KEY_LEN)) as Buffer;

    const decipher = createDecipheriv(
        ALGORITHM,
        (key as Uint8Array).subarray(),
        (iv as Uint8Array).subarray(),
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}
