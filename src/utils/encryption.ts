import crypto from "crypto";

const ALGORITHM = "aes-256-gcm"; 
const IV_LENGTH = 16; 
const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_SECRET!)
  .digest(); 

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
    tag: authTag,
  };
}

export function decrypt(encrypted: { iv: string; content: string; tag: string }) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(encrypted.iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(encrypted.tag, "hex"));

  let decrypted = decipher.update(encrypted.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
