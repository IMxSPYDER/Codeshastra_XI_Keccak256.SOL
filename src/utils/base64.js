import base64url from 'base64url';

export const bufferToBase64Url = (buffer) => base64url.encode(Buffer.from(buffer));
export const base64UrlToBuffer = (str) => Uint8Array.from(base64url.toBuffer(str));
