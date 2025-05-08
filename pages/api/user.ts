import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { getUsuarioAutenticado } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = getUsuarioAutenticado(req);

    if (!user || (!user.id && !user.email)) {
      return res.status(401).json({ message: 'Token inválido ou ausente.' });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq(user.id ? 'id' : 'email', user.id || user.email)
        .single();

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return res.status(400).json({ error });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { email, telefone, banco, chave_pix, tipo_chave_pix } = req.body;

      const { error } = await supabase
        .from('usuarios')
        .update({ email, telefone, banco, chave_pix, tipo_chave_pix })
        .eq(user.id ? 'id' : 'email', user.id || user.email);

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(400).json({ error });
      }

      return res.status(200).json({ message: 'Atualizado com sucesso' });
    }

    return res.status(405).end(); // Método não permitido
  } catch (err: any) {
    console.error('Erro interno na rota /api/user:', err);
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
}
