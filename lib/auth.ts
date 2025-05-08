import { NextApiRequest } from 'next'
import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_segura'

export function getUsuarioAutenticado(req: NextApiRequest) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  const token = cookies.auth_token

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string }
    return decoded
  } catch {
    return null
  }
}
