import { IncomingMessage } from 'http'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_segura'

interface TokenPayload {
  id: string
  email: string
  nome: string
  iat?: number
  exp?: number
}

export function getUsuarioAutenticado(req: IncomingMessage): TokenPayload | null {
  const cookies = req.headers.cookie
  if (!cookies) return null

  const parsed = parse(cookies)
  const token = parsed.token

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}
