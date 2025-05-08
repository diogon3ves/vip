import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { getUsuarioAutenticado } from '@/lib/auth'; // função exportada de forma nomeada

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUsuarioAutenticado(req);
  if (!user) return res.status(401).json({ message: 'Não autorizado' });

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return res.status(400).json({ error });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { email, telefone, banco, chave_pix, tipo_chave_pix } = req.body;

    const { error } = await supabase
      .from('usuarios')
      .update({ email, telefone, banco, chave_pix, tipo_chave_pix })
      .eq('id', user.id);

    if (error) return res.status(400).json({ error });
    return res.status(200).json({ message: 'Atualizado com sucesso' });
  }

  res.status(405).end(); // Method Not Allowed
}
