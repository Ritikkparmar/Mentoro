// Next.js client-safe envs must be prefixed with NEXT_PUBLIC_
// These are replaced at build-time in the client bundle
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "/api";
export const MAX_LENGTH = Number(process.env.NEXT_PUBLIC_MAX_LENGTH || 8000);