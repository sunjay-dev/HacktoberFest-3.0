export const fail = (res, status, message) => res.status(status).json({ error: message })
