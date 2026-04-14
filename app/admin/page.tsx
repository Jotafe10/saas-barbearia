"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
const supabaseUrl = 'https://hewpqaakoreejpjbvanz.supabase.co';
const supabaseKey = 'sb_publishable_uYapZZawEYaUqD_W-GsbEw_6ww-CSir';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [senha, setSenha] = useState('');
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função simples de Login para o MVP
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === 'barber2026') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta! Tente: barber2026');
    }
  };

  // Buscar os dados no Supabase quando logar
  useEffect(() => {
    if (isAuthenticated) {
      buscarAgendamentos();
    }
  }, [isAuthenticated]);

  const buscarAgendamentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .order('id', { ascending: false }); // Traz os mais recentes primeiro

      if (error) throw error;
      if (data) setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- TELA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-red-800">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#0a0a0a] p-8 rounded-xl border border-zinc-800 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Painel Restrito</h1>
            <p className="text-red-700 text-xs tracking-[0.2em] mt-1 uppercase">Studio Barber Shop</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-500 text-sm mb-2">Senha de Acesso</label>
              <input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-700 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-red-800 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors uppercase tracking-widest text-sm">
              Entrar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- TELA DO DASHBOARD (Logado) ---
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-red-800">
      
      {/* Header do Admin */}
      <header className="bg-[#0a0a0a] border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Dashboard</h1>
          <p className="text-zinc-500 text-sm">Gestão de Agendamentos</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto p-6 mt-6">
        
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-zinc-900 to-[#0a0a0a] p-6 rounded-xl border border-zinc-800 border-l-4 border-l-red-700">
            <h3 className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-2">Total de Agendamentos</h3>
            <p className="text-4xl font-bold text-white">{agendamentos.length}</p>
          </div>
          {/* Você pode adicionar mais cards aqui no futuro (ex: Faturamento, Clientes do Dia) */}
        </div>

        {/* Tabela de Agendamentos */}
        <div className="bg-[#0a0a0a] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Últimos Agendamentos</h2>
            <button onClick={buscarAgendamentos} className="text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Atualizar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 text-zinc-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Cliente</th>
                  <th className="p-4 font-medium">WhatsApp</th>
                  <th className="p-4 font-medium">Data e Hora</th>
                  <th className="p-4 font-medium">Serviço</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">Carregando agendamentos...</td>
                  </tr>
                ) : agendamentos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">Nenhum agendamento encontrado.</td>
                  </tr>
                ) : (
                  agendamentos.map((agendamento) => (
                    <tr key={agendamento.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4 font-bold text-white">{agendamento.nome_cliente || 'N/A'}</td>
                      <td className="p-4 text-zinc-400">
                        <a href={`https://wa.me/55${agendamento.telefone_cliente?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors flex items-center gap-2">
                          {agendamento.telefone_cliente || 'N/A'}
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        </a>
                      </td>
                      <td className="p-4 text-red-500 font-medium">{agendamento.data_hora}</td>
                      <td className="p-4 text-zinc-300">{agendamento.servico}</td>
                      <td className="p-4">
                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {agendamento.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

    </div>
  );
}