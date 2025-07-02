import forge from "node-forge";

let cachedPublicKey: forge.pki.PublicKey | null = null;

export async function encryptRSA(data: any): Promise<string> {
  if (!cachedPublicKey) {
    const res = await fetch("/rsa/public.pem");
    const pem = await res.text();
    cachedPublicKey = forge.pki.publicKeyFromPem(pem);
  }

  const json = JSON.stringify(data);
  const encrypted = (cachedPublicKey as any).encrypt(json, "RSA-OAEP");
  return forge.util.encode64(encrypted);
}
