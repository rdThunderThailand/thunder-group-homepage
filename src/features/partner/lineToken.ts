// Shared between the /register page (sets the cookie from `?t=`) and the
// submit Route Handler (reads + clears it). Kept in one place so the name
// and lifetime can't drift between the two.

export const LINE_TOKEN_COOKIE = "partner_line_token";

// Matches the LINE-issued token's own lifetime (design review: contract
// says the token is valid for 30 minutes, single use).
export const LINE_TOKEN_MAX_AGE_SECONDS = 30 * 60;

// `[A-Za-z0-9_-]{43}` per docs/partner_web_api_contract.md.
export const LINE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
