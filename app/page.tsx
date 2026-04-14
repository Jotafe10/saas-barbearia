"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
// Substitua as strings abaixo pelas suas chaves reais do Supabase (Project Settings > API)
const supabaseUrl = 'https://hewpqaakoreejpjbvanz.supabase.co';
const supabaseKey = 'sb_publishable_uYapZZawEYaUqD_W-GsbEw_6ww-CSir';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- DADOS MOCK (Poderão vir da BD depois) ---
const servicosAvulsos = [
  { id: 'corte', nome: 'Corte de Cabelo', desc: 'Degradê ou Social', preco: 'R$ 45' },
  { id: 'barba', nome: 'Barba Completa', desc: 'Toalha Quente', preco: 'R$ 35' },
  { id: 'combo', nome: 'Combo (Corte + Barba)', desc: 'O visual completo', preco: 'R$ 70' },
];

const diasDisponiveis = [
  { id: '14', label: 'Hoje, 14 Abr' },
  { id: '15', label: 'Amanhã, 15 Abr' },
  { id: '16', label: 'Qua, 16 Abr' },
  { id: '17', label: 'Qui, 17 Abr' },
];

const horariosDisponiveis = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

export default function StudioBarberShop() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar erros da BD

  const [reserva, setReserva] = useState({
    servicoId: '',
    servicoNome: '',
    data: '',
    hora: '',
    nome: '',
    telefone: ''
  });

  const fecharModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setReserva({ servicoId: '', servicoNome: '', data: '', hora: '', nome: '', telefone: '' });
      setErrorMessage('');
    }, 300);
  };

  const proximoPasso = () => setStep((prev) => prev + 1);
  const passoAnterior = () => setStep((prev) => prev - 1);

  // --- FUNÇÃO REAL DE ENVIO PARA O SUPABASE ---
  const confirmarAgendamento = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Inserir na tabela do Supabase
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([
          { 
            servico: reserva.servicoNome,
            data_hora: `${reserva.data} - ${reserva.hora}`,
            status: 'pendente',
            nome_cliente: reserva.nome,
            telefone_cliente: reserva.telefone
          }
        ]);

      if (error) throw error;

      // 2. Criar a mensagem para o WhatsApp
      const numeroBarbearia = "5527999890469";
      const mensagemFixa = `Olá! Gostaria de confirmar meu agendamento no Studio Barber Shop:%0A%0A` +
                           `*Cliente:* ${reserva.nome}%0A` +
                           `*Serviço:* ${reserva.servicoNome}%0A` +
                           `*Data/Hora:* ${reserva.data} às ${reserva.hora}`;
      
      const linkWhatsapp = `https://wa.me/${numeroBarbearia}?text=${mensagemFixa}`;

      // 3. Abrir o WhatsApp em uma nova aba
      window.open(linkWhatsapp, '_blank');

      // 4. Ir para o passo de sucesso no site
      setStep(4); 
      
    } catch (error: any) {
      console.error('Erro no agendamento:', error);
      const mensagemDoBanco = error?.message || 'Ocorreu um erro ao guardar o agendamento.';
      setErrorMessage(`Erro do banco: ${mensagemDoBanco}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-red-800 selection:text-white relative">
      
      {/* NAVEGAÇÃO CLEAN */}
      <nav className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-widest text-white uppercase">Studio</span>
            <span className="text-[10px] tracking-[0.3em] text-red-700 uppercase">Barber Shop</span>
          </div>
          
          <ul className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-zinc-400 uppercase">
            <li><a href="#inicio" className="hover:text-white transition-colors">Início</a></li>
            <li><a href="#galeria" className="hover:text-white transition-colors">Galeria</a></li>
            <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
          </ul>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-800 text-white px-6 py-2.5 text-sm font-bold tracking-wide hover:bg-red-700 transition-all rounded-sm">
            AGENDAR
          </button>
        </div>
      </nav>

      {/* SEÇÃO INÍCIO (HERO) */}
      <section id="inicio" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <h1 className="text-5xl md:text-7xl font-light text-white leading-tight">
              A arte do <br />
              <span className="font-bold text-red-700">corte clássico.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              Elevamos o padrão da barbearia tradicional. Um espaço pensado para o homem moderno que valoriza excelência, estilo e um atendimento impecável.
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-black px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors cursor-pointer">
                Agendar Horário
              </button>
            </div>
          </div>
          
          <div className="relative h-[500px] w-full hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
              alt="Interior da Barbearia" 
              className="absolute inset-0 w-full h-full object-cover rounded-sm grayscale-[30%] opacity-90 mix-blend-luminosity"
            />
            <div className="absolute -inset-4 border border-red-800/40 rounded-sm -z-10 translate-x-4 translate-y-4"></div>
          </div>
        </div>
      </section>

      {/* SEÇÃO GALERIA */}
      <section id="galeria" className="py-24 bg-[#0a0a0a] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Nosso Trabalho</h2>
              <p className="text-zinc-500">Precisão em cada detalhe.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop" alt="Corte 1" className="w-full h-64 object-cover hover:opacity-75 transition-opacity cursor-pointer rounded-sm" />
            <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop" alt="Corte 2" className="w-full h-64 object-cover hover:opacity-75 transition-opacity cursor-pointer rounded-sm" />
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop" alt="Corte 3" className="w-full h-64 object-cover hover:opacity-75 transition-opacity cursor-pointer rounded-sm" />
            <img src="https://images.unsplash.com/photo-1512496015851-a1dc8f41dd66?q=80&w=600&auto=format&fit=crop" alt="Corte 4" className="w-full h-64 object-cover hover:opacity-75 transition-opacity cursor-pointer rounded-sm" />
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTATO E MAPA */}
      <section id="contato" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Visite o Studio</h2>
              <p className="text-zinc-400 leading-relaxed">
                Estamos localizados no coração de Itararé, prontos para oferecer a melhor experiência em estética masculina.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-red-700 shrink-0 bg-red-900/10">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Endereço</h4>
                  <p className="text-zinc-500 text-sm">Rua das Palmeiras, 213<br/>Itararé</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-red-700 shrink-0 bg-red-900/10">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Contato</h4>
                  <p className="text-zinc-500 text-sm">(27) 99989-0469</p>
                </div>
              </div>
            </div>

            <a 
              href="https://wa.me/5527999890469" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto bg-[#25D366] text-white px-8 py-4 font-bold text-sm tracking-wide hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-2 rounded-sm shadow-lg shadow-[#25D366]/20"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Chamar no WhatsApp
            </a>
          </div>

          <div className="w-full h-[400px] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden p-1">
            <iframe 
              src="https://maps.google.com/maps?q=Rua%20das%20Palmeiras,%20213,%20Itarar%C3%A9,%20ES&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center bg-black">
        <p className="text-zinc-600 text-sm tracking-wide">
          © 2026 Studio Barber Shop. Todos os direitos reservados.
        </p>
      </footer>

      {/* MODAL DE AGENDAMENTO (MULTI-STEP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer" onClick={fecharModal}></div>
          
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Cabeçalho do Modal */}
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-[#050505]">
              <div className="flex items-center gap-3">
                {step > 1 && step < 4 && (
                  <button onClick={passoAnterior} className="text-zinc-400 hover:text-white transition-colors">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                )}
                <h3 className="text-lg font-bold text-white">
                  {step === 1 && "Novo Agendamento"}
                  {step === 2 && "Escolher Horário"}
                  {step === 3 && "Seus Dados"}
                  {step === 4 && "Tudo Pronto!"}
                </h3>
              </div>
              <button onClick={fecharModal} className="text-zinc-500 hover:text-white transition-colors">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* BARRA DE PROGRESSO */}
            {step < 4 && (
              <div className="w-full bg-zinc-900 h-1">
                <div className="bg-red-700 h-1 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>
            )}

            {/* CORPO DO MODAL */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* PASSO 1: ESCOLHER SERVIÇO */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-gradient-to-r from-red-900/40 to-[#0a0a0a] border border-red-800/30 rounded-lg p-4 cursor-pointer hover:border-red-700 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-red-500 font-bold text-sm tracking-widest uppercase">Clube Barber</span>
                      <span className="text-white font-bold">R$ 120/mês</span>
                    </div>
                    <p className="text-zinc-400 text-sm">Cortes e barbas ilimitados. Torne-se membro e pare de pagar por sessão.</p>
                  </div>

                  <h4 className="text-white font-bold text-sm uppercase tracking-wide pt-2">Serviços Avulsos</h4>
                  <div className="space-y-3">
                    {servicosAvulsos.map((servico) => (
                      <div 
                        key={servico.id}
                        onClick={() => setReserva({ ...reserva, servicoId: servico.id, servicoNome: servico.nome })}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          reserva.servicoId === servico.id 
                            ? 'border-red-700 bg-red-900/20' 
                            : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${reserva.servicoId === servico.id ? 'border-red-600' : 'border-zinc-600'}`}>
                            {reserva.servicoId === servico.id && <div className="w-2 h-2 bg-red-600 rounded-full"></div>}
                          </div>
                          <div>
                            <p className="text-white font-medium">{servico.nome}</p>
                            <p className="text-xs text-zinc-500">{servico.desc}</p>
                          </div>
                        </div>
                        <span className="text-white font-bold">{servico.preco}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PASSO 2: ESCOLHER DATA E HORA */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Datas */}
                  <div>
                    <h4 className="text-zinc-400 text-sm mb-3 font-medium">Data do Atendimento</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {diasDisponiveis.map((dia) => (
                        <button
                          key={dia.id}
                          onClick={() => setReserva({ ...reserva, data: dia.label })}
                          className={`whitespace-nowrap px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                            reserva.data === dia.label
                              ? 'border-red-700 bg-red-700 text-white'
                              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {dia.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horários */}
                  <div>
                    <h4 className="text-zinc-400 text-sm mb-3 font-medium">Horários Disponíveis</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {horariosDisponiveis.map((hora) => (
                        <button
                          key={hora}
                          onClick={() => setReserva({ ...reserva, hora })}
                          className={`py-3 rounded-lg border text-sm font-bold transition-colors ${
                            reserva.hora === hora
                              ? 'border-red-700 bg-red-900/30 text-white'
                              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white'
                          }`}
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PASSO 3: DADOS DO CLIENTE */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg mb-6">
                    <p className="text-sm text-zinc-400">Resumo do Agendamento:</p>
                    <p className="text-white font-bold mt-1">{reserva.servicoNome}</p>
                    <p className="text-red-500 font-medium text-sm">{reserva.data} às {reserva.hora}</p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">Seu Nome Completo</label>
                      <input 
                        type="text" 
                        value={reserva.nome}
                        onChange={(e) => setReserva({...reserva, nome: e.target.value})}
                        placeholder="Ex: João Silva"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-700 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">WhatsApp</label>
                      <input 
                        type="tel" 
                        value={reserva.telefone}
                        onChange={(e) => setReserva({...reserva, telefone: e.target.value})}
                        placeholder="(27) 99999-9999"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-700 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PASSO 4: SUCESSO */}
              {step === 4 && (
                <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Agendamento Confirmado!</h3>
                  <p className="text-zinc-400 mb-6">
                    Aguardamos por si no dia <strong className="text-white">{reserva.data}</strong> às <strong className="text-white">{reserva.hora}</strong>.
                  </p>
                  <p className="text-sm text-zinc-500">Enviámos as informações para o seu WhatsApp.</p>
                </div>
              )}

            </div>

            {/* RODAPÉ E BOTÕES DE AÇÃO */}
            {step < 4 && (
              <div className="p-5 border-t border-zinc-800 bg-[#050505]">
                
                {step === 1 && (
                  <button 
                    onClick={proximoPasso}
                    disabled={!reserva.servicoId}
                    className="w-full bg-red-800 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3.5 rounded-sm transition-colors uppercase tracking-widest text-sm"
                  >
                    Escolher Horário
                  </button>
                )}

                {step === 2 && (
                  <button 
                    onClick={proximoPasso}
                    disabled={!reserva.data || !reserva.hora}
                    className="w-full bg-red-800 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3.5 rounded-sm transition-colors uppercase tracking-widest text-sm"
                  >
                    Informar Dados
                  </button>
                )}

                {step === 3 && (
                  <button 
                    onClick={confirmarAgendamento}
                    disabled={!reserva.nome || !reserva.telefone || isSubmitting}
                    className="w-full bg-[#25D366] hover:bg-[#1DA851] disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3.5 rounded-sm transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Confirmar Agendamento"
                    )}
                  </button>
                )}

              </div>
            )}

            {/* Botão de Fechar no Sucesso */}
            {step === 4 && (
              <div className="p-5 border-t border-zinc-800 bg-[#050505]">
                <button 
                  onClick={fecharModal}
                  className="w-full bg-zinc-800 text-white font-bold py-3.5 rounded-sm hover:bg-zinc-700 transition-colors uppercase tracking-widest text-sm"
                >
                  Voltar ao Site
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}