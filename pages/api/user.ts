import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { getUsuarioAutenticado } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = getUsuarioAutenticado(req);

    console.log('[API] JWT decodificado:', user);

    if (!user || (!user.id && !user.email)) {
      console.warn('[API] Token inválido ou faltando informações');
      return res.status(401).json({ message: 'Token inválido ou ausente' });
    }

    if (req.method === 'GET') {
      const chave = user.id ? 'id' : 'email';
      const valor = user.id || user.email;

      console.log(`[API] Buscando usuário por ${chave}: ${valor}`);

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq(chave, valor)
        .single();

      if (error) {
        console.error('[API] Erro Supabase:', error);
        return res.status(400).json({ error });
      }

      console.log('[API] Usuário encontrado:', data);
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { email, telefone, banco, chave_pix, tipo_chave_pix } = req.body;
      const chave = user.id ? 'id' : 'email';
      const valor = user.id || user.email;

      const { error } = await supabase
        .from('usuarios')
        .update({ email, telefone, banco, chave_pix, tipo_chave_pix })
        .eq(chave, valor);

      if (error) {
        console.error('[API] Erro ao atualizar Supabase:', error);
        return res.status(400).json({ error });
      }

      return res.status(200).json({ message: 'Atualizado com sucesso' });
    }

    res.status(405).end();
  } catch (err: any) {
    console.error('[API] Erro inesperado:', err);
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
}
