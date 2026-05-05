import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Filter, Plus, X, Edit3, Trash2, Share2, Copy, Check,
  Mail, Phone, Globe, MapPin, Briefcase, Award, AlertCircle,
  ChevronDown, ChevronRight, ExternalLink, Lock, Unlock, Eye, EyeOff,
  UserPlus, Link2, Star, Clock, Sparkles, ArrowUpRight, Users,
  KeyRound, ShieldCheck, Upload, FileText, ArrowLeft,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_VERSION = 'v1';

const ROLE_OPTIONS = [
  'Designer Sénior',
  'Designer Mid/Junior',
  'Strategy & Project Manager',
  'Community & Team Manager',
  'Mobile VideoMaker',
  'Copywriter',
  'Account Manager',
  'Assistente Pessoal/Virtual',
  'A definir',
  'Outro',
];

const STATUS_OPTIONS = [
  { value: 'Em Análise', color: '#C4A464' },
  { value: 'Aprovado', color: '#7A9B6F' },
  { value: 'Rejeitado', color: '#B5746B' },
  { value: 'Potencial Futuro', color: '#9B7FA8' },
];

const EXPERIENCE_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead', 'A definir'];
const WORK_MODELS = ['Presencial', 'Híbrido', 'Virtual', 'Freelance'];

const formatSalary = (n) => {
  if (n === null || n === undefined || n === '' || isNaN(n)) return '—';
  return new Intl.NumberFormat('pt-AO').format(n) + ' AKZ';
};

const naField = (v) => {
  if (v === null || v === undefined || v === '') return '—';
  return v;
};

const generateId = () => Math.random().toString(36).slice(2, 11);

// ─────────────────────────────────────────────────────────────────────────────
// PRE-LOADED CANDIDATES (Phase 2 analysis)
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_CANDIDATES = [
  {
    id: 'renoir-ventura',
    name: 'Renoir Ventura',
    roleApplied: 'Strategy & Project Manager',
    bestFitRole: 'Community & Team Manager',
    experienceLevel: 'Mid',
    yearsExperience: 5,
    workModels: [],
    expectedSalary: null,
    lastSalary: null,
    location: 'Luanda, Angola',
    languages: ['Português (Nativo)', 'Inglês (Intermediário)', 'Espanhol (Básico)'],
    tools: [],
    keySkills: ['Brand Activation', 'Gestão de Projetos', 'Marketing Digital', 'Planeamento Estratégico', 'Eventos'],
    brandsWorkedWith: ['Tigra', 'Jade', 'Super Bock', 'Smirnoff', "Gordon's", 'Refriango', 'BF Marketing'],
    bio: 'Profissional de marketing orientada para resultados, com experiência em gestão de campanhas, ativação de marcas e coordenação de projetos. Co-fundadora da Dígitos (produção de eventos).',
    strengths: 'Energia e atitude positiva genuínas. Experiência real de campo com marcas FMCG de topo (Tigra, Smirnoff, Gordon\'s) via Refriango. Co-fundou a Dígitos — sinal de iniciativa empreendedora. A solução de packaging que apresentou no teste Lume (carimbo, papel vegetal, sticker) é genuinamente boa, prática e replicável internamente.',
    weaknesses: 'Execução escrita BÁSICA — múltiplos erros gramaticais no teste ("introducão", "im impacto", "criando hype"). RED FLAG SÉRIO: o CV contém Lorem ipsum no cargo "Diretora de Projeto" (DG Marketing) — reivindica título sem evidência. Pensamento estratégico ainda raso: identifica problemas óbvios mas soluções são playbook genérico (pilares editoriais "Almoço Real/Bastidores/Ritmo" = qualquer restaurante). Vai precisar de supervisão alta nos primeiros 6 meses.',
    status: 'Em Análise',
    recommendedPosition: 'Community & Team Manager — Voxie Lab. Plano: revisão aos 6 meses, possível progressão para Junior Strategy & PM aos 12-18 meses se demonstrar evolução clara em escrita estratégica e profundidade analítica.',
    interviewNotes: 'Entrevista presencial: atitude e postura ALTAS. Energia positiva, fala bem, encaixa culturalmente. Disse coisas certas sobre clientes e ativação. Decepção veio com o teste escrito (Lume) e a verificação fina do CV.',
    personalNotes: 'Decisão: oferecer Community & Team Manager, não Strategy & PM. Salário inicial: faixa 550-650k. Se aceitar com humildade e disposição para crescer, é uma boa hire. Se reagir mal ao downgrade de cargo, é informação útil sobre fit.',
    contact: {
      email: '[email protected]',
      phone: '+244 922 169 944',
      linkedin: '',
      instagram: '',
      other: '',
    },
    portfolioLink: '',
    cvLink: 'CV anexado em conversa',
    source: 'admin',
    createdAt: '2026-05-03',
    updatedAt: '2026-05-03',
  },
  {
    id: 'augusto-jeronimo',
    name: 'Augusto Jerónimo',
    roleApplied: 'Designer',
    bestFitRole: 'Designer Sénior',
    experienceLevel: 'Senior',
    yearsExperience: 5,
    workModels: [],
    expectedSalary: null,
    lastSalary: null,
    location: 'Luanda, Angola',
    languages: ['Português (Nativo)'],
    tools: ['Photoshop', 'Illustrator', 'InDesign', 'Canva', 'After Effects', 'Premiere', 'CapCut', 'Ferramentas IA'],
    keySkills: ['Social Media Design', 'Identidade Visual', 'Comunicação Estratégica', 'Branding', 'Comunicação Visual Exterior', 'Motion Design Básico'],
    brandsWorkedWith: ['Special (Refriango)', 'Kero', 'RFM Sociedade de Advogados', 'Soclima', 'Renov', 'Bela Delícia', 'Lacco Clean', 'Anglobal'],
    bio: 'Designer com 5 anos de experiência com foco em Social Media, identidade visual e comunicação estratégica. Atua na ligação entre design, marketing e tecnologia, integrando ferramentas Adobe e IA.',
    strengths: 'Portfólio sólido com clientes de topo do mercado angolano (Special, Kero, RFM). O trabalho RFM Sociedade de Advogados demonstra capacidade premium e sofisticada — paleta institucional disciplinada, tipografia clássica, presença de mercado forte. Polivalente: branding, social media, comunicação visual exterior (billboards, vehicle wraps), motion básico, integração com IA. Discurso profissional maduro no portfólio.',
    weaknesses: 'Sem evidência clara de liderança de equipas de design (sempre IC?). Trabalhos parecem ser projetos avulsos via agência — verificar capacidade de gestão de relação direta com cliente premium. Sem trabalho de longo prazo numa única marca a mostrar consistência sustentada. Falta motion design avançado.',
    status: 'Em Análise',
    recommendedPosition: 'Designer Sénior — Voxie Lab. TOP candidato. Concorrência directa com Veto de Araújo. Decisão final depende de entrevista cultural + teste prático curto sob constrangimento Voxie.',
    interviewNotes: 'A marcar entrevista estruturada. Pontos a validar: (1) pensamento estratégico para além da execução, (2) capacidade de defender escolhas perante cliente, (3) expectativa salarial e flexibilidade, (4) disposição para liderar um designer mid/junior.',
    personalNotes: 'Se entrevistar bem, é o pick. Faixa 1.000.000–1.300.000 AKZ. Vamos pedir um teste curto: rebrand visual de uma marca fictícia da Voxie em 48h, para ver velocidade + sensibilidade.',
    contact: {
      email: '[email protected]',
      phone: '+244 927 195 247',
      linkedin: 'LinkedIn no portfólio',
      instagram: 'Instagram no portfólio',
      other: 'Behance no portfólio',
    },
    portfolioLink: 'PDF anexado em conversa',
    cvLink: 'Incluído no portfólio',
    source: 'admin',
    createdAt: '2026-05-03',
    updatedAt: '2026-05-03',
  },
  {
    id: 'veto-araujo',
    name: 'Veto Kilson Arsénio de Araújo',
    roleApplied: 'Designer',
    bestFitRole: 'Designer Sénior',
    experienceLevel: 'Senior',
    yearsExperience: 4,
    workModels: [],
    expectedSalary: null,
    lastSalary: null,
    location: 'Luanda, Angola',
    languages: ['Português (Fluente)', 'Inglês (Intermédio)'],
    tools: ['Figma', 'Photoshop', 'Illustrator', 'Adobe Creative Cloud', 'PowerPoint', 'CapCut'],
    keySkills: ['Brand Design', 'Logofólio', 'Social Media Design', 'Design de Interfaces (UI)', 'Identidade Visual'],
    brandsWorkedWith: ['Kero', 'Procenter', 'Buka APP', 'Kria by Giramondo', 'Catedral', 'Van-Trier Store', 'Technology Super Store', 'Braleza', 'FirstCut', 'Juliana Silva', 'Vambazá'],
    bio: 'Designer gráfico há 4 anos. Trabalha principalmente com criação de logótipos, construção de identidades visuais e design para redes sociais. Acredita que para criar um design memorável é necessário começar com uma ideia que valha a pena lembrar.',
    strengths: 'Portfólio EXTRAORDINÁRIO para apenas 4 anos. Brand identity work (Catedral, Van-Trier, Technology Super Store) mostra pensamento sistemático e linguagem visual coesa. DIFERENCIAL ÚNICO: design de interfaces (UI) para a app Vambazá — capacidade que Augusto não demonstra. Trabalho social media para Procenter é comercialmente sofisticado. Atualmente na Kria by Giramondo (educação criativa) — ambiente alinhado com Voxie. Apresentação do portfólio é polida, organizada, profissional.',
    weaknesses: '4 anos é um ano a menos que Augusto. Sempre trabalhou via agências/empresas — não há evidência de gestão direta de cliente premium sob pressão. Falta trabalho de motion design/vídeo. Verificar maturidade emocional na lida com clientes difíceis.',
    status: 'Em Análise',
    recommendedPosition: 'Designer Sénior — Voxie Lab. TOP candidato lado a lado com Augusto. Se Voxie precisar de capacidade web/UI no futuro próximo, Veto sai à frente. Decisão final via entrevista comparativa.',
    interviewNotes: 'A marcar. Pontos a validar: (1) gestão directa de cliente, (2) maturidade na receção de feedback negativo, (3) interesse em motion/vídeo, (4) leadership potencial.',
    personalNotes: 'Tendência: contratar Veto + freelancer/contratar Augusto como mid se faixa salarial permitir. Veto pelo UI design adicional. Faixa 950.000–1.250.000 AKZ.',
    contact: {
      email: '[email protected]',
      phone: '+244 939 184 076',
      linkedin: 'Veto de Araújo (LinkedIn)',
      instagram: '@veto.araujo_',
      other: 'Behance: Veto Araújo',
    },
    portfolioLink: 'PDF anexado em conversa',
    cvLink: 'Incluído no portfólio',
    source: 'admin',
    createdAt: '2026-05-03',
    updatedAt: '2026-05-03',
  },
  {
    id: 'david-pedro',
    name: 'David Moisés Saldanha Pedro',
    roleApplied: 'Designer',
    bestFitRole: 'Designer Mid/Junior',
    experienceLevel: 'Mid',
    yearsExperience: 4,
    workModels: [],
    expectedSalary: null,
    lastSalary: null,
    location: 'Benfica - Kifica, Luanda',
    languages: ['Português (Nativo)'],
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    keySkills: ['Design Gráfico', 'Identidade Visual', 'Social Media', 'Materiais Promocionais', 'Print'],
    brandsWorkedWith: ['Hey Hey Heyy', 'CarDivas', 'TargetOne', 'Inspunyl', 'Nenvika', 'Fumueto Villag Resort', 'ConsulFarma', 'Williams Business', 'Olifrán', 'DMSP Lda'],
    bio: 'Designer gráfico com experiência como chefe de produção em diferentes empresas. Técnico médio em informática. Trabalha primariamente com Photoshop e Illustrator.',
    strengths: 'Volume de trabalho consistente em ambiente de produção (DMSP é uma gráfica). Capaz de entregar com prazos curtos e volume alto. Logótipos como Fumueto Villag Resort mostram capacidade de construção geométrica. Experiência com diferentes setores (resort, saúde, business, agro). Bom para o slot de "designer de execução" sob direção criativa.',
    weaknesses: 'Trabalho mid-level — não senior. Tipografia inconsistente entre projetos (mix de fontes sem critério). Social media designs (DMSP) são genéricos, falta refinamento e originalidade. Não há evidência de criar sistemas de design coesos para clientes premium. Não demonstra direção criativa, apenas execução. Stack de ferramentas limitado (apenas Photoshop e Illustrator — sem Figma, sem motion).',
    status: 'Em Análise',
    recommendedPosition: 'Designer Mid/Junior (suporte ao Sénior) — Voxie Lab. Modelo virtual ou part-time. Função: adaptações, social media recorrente, mockups, sob direção do Designer Sénior. NÃO é adequado para liderar.',
    interviewNotes: 'A marcar. Validar: (1) abertura para trabalhar sob direção, (2) disponibilidade virtual/part-time, (3) flexibilidade em ferramentas (aprender Figma).',
    personalNotes: 'Faixa 350.000–500.000 AKZ. Útil como segundo designer se conseguirmos contratar Augusto OU Veto como Sénior.',
    contact: {
      email: '[email protected]',
      phone: '+244 945 957 577',
      linkedin: '',
      instagram: '@davidpedro_designer',
      other: '',
    },
    portfolioLink: 'PDF anexado em conversa',
    cvLink: 'Incluído no portfólio',
    source: 'admin',
    createdAt: '2026-05-03',
    updatedAt: '2026-05-03',
  },
  {
    id: 'francisco-izinga',
    name: 'Francisco Simão Izinga',
    roleApplied: 'Designer',
    bestFitRole: 'A definir (sem portfólio)',
    experienceLevel: 'Senior',
    yearsExperience: 8,
    workModels: [],
    expectedSalary: null,
    lastSalary: null,
    location: 'Vila Alice, Rangel, Luanda',
    languages: ['Português (Nativo)', 'Francês (Avançado)', 'Inglês (Intermediário)'],
    tools: ['Branding', 'Web Design (HTML/CSS/JS básico)', 'Photoshop', 'Premiere Pro', 'After Effects', 'Motion Graphics'],
    keySkills: ['Web Design', 'Graphic Design', 'Email Marketing', 'Motion Design', 'Branding', 'Photo & Video'],
    brandsWorkedWith: ['NCR Angola (5 anos)', 'Stylus'],
    bio: 'Web and Graphic Designer com experiência em web design, marketing digital, branding, projetos de comunicação, edição de fotos e vídeos. Foco em experiência do utilizador.',
    strengths: 'Perfil mais maduro do lote (32 anos, 8 anos de experiência). Multidisciplinar: web design + motion + photo/video + branding. FRANCÊS AVANÇADO — diferencial raro e valioso para clientes francófonos (potencial expansão). Estabilidade profissional notável (5 anos consecutivos na NCR Angola). CV bem estruturado e bilingue.',
    weaknesses: 'CRÍTICO: NÃO ENVIOU PORTFÓLIO. Apenas o CV. Para um Designer, isto é uma falha eliminatória até prova em contrário. Não é possível avaliar a qualidade real do trabalho. CV elegante não é evidência de output. Forte sinal de aviso: alguém com 8 anos de carreira em design que se candidata sem mostrar trabalho perde credibilidade imediata.',
    status: 'Em Análise',
    recommendedPosition: 'PENDENTE até receção de portfólio. Pedir explicitamente: 5-7 trabalhos do NCR Angola + qualquer projeto pessoal. Se portfólio for forte, candidato extremamente forte (perfil sénior + multidisciplinar + francês). Se for fraco ou ausente, descontinuar.',
    interviewNotes: 'Aguardar portfólio antes de marcar entrevista. Se portfólio chegar e for sólido, marcar imediatamente — perfil multidisciplinar é raro.',
    personalNotes: 'Acção pendente: enviar email a pedir portfólio com prazo de 5 dias. Se não responder ou portfólio for fraco, descontinuar.',
    contact: {
      email: '[email protected]',
      phone: '+244 926 84 84 84',
      linkedin: '',
      instagram: '',
      other: '',
    },
    portfolioLink: 'NÃO ENVIADO',
    cvLink: 'CV anexado em conversa',
    source: 'admin',
    createdAt: '2026-05-03',
    updatedAt: '2026-05-03',
  },
  {
    id: 'edgar-vandunem',
    name: 'Edgar de Sá Neto Van-Dúnem',
    roleApplied: 'Mobile VideoMaker',
    bestFitRole: 'Mobile VideoMaker',
    experienceLevel: 'Mid',
    yearsExperience: 3,
    workModels: [],
    expectedSalary: null,
    lastSalary: null,
    location: 'Luanda, Angola',
    languages: ['Português (Nativo)'],
    tools: [],
    keySkills: ['Captação Mobile', 'Edição Estratégica', 'Storytelling Visual', 'Reels / Vídeos Virais', 'Conteúdo Vertical'],
    brandsWorkedWith: ['Sonangol', 'Unitel', 'TotalEnergies', 'ExxonMobil', 'Aker Energy', 'BPC', 'BFA', 'BCI', 'BAI', 'Standard Bank', 'Banco Yetu', 'BCS', 'BNA', 'Nossa Seguros', 'Fidelidade', 'Fortaleza Seguros', 'ENSA', 'Global Seguros', 'Candando', 'Mitrelli', 'CABship', 'DStv', 'LiraLink', 'Paratus', 'INACOM', 'Porto de Luanda', 'Mintrans', 'Governo de Angola', 'Gabinete da Primeira-Dama da República', 'CHA', 'GH Express', 'UCAN', 'Marina Bar', 'Clínica General Katondo', 'Gulkis', 'ARCCLA', 'Noxx', 'Viva Seguros', 'Keve'],
    bio: '22 anos, mais de 3 anos no mercado audiovisual. Especialista em criação de conteúdos mobile com qualidade profissional. Foco em captação mobile, edição estratégica, storytelling visual e Reels/vídeos virais.',
    strengths: 'Lista de marcas EXCEPCIONAL para alguém com 22 anos — bancos, seguradoras, oil & gas, governo, telecoms, retail. Já trabalhou com clientes de tier-1 angolano que muitos profissionais experientes nunca tocaram. 6.4k seguidores no Instagram = autoridade digital incipiente. Especialização clara e focada em mobile content vertical/short-form (formato dominante actual). Aos 22 anos com este nível de exposição = potencial de crescimento enorme.',
    weaknesses: 'Portfólio entregue é APENAS apresentação visual estática — não inclui amostras reais de vídeo (links Instagram, Drive, Vimeo). Sem ver os vídeos, não posso validar se a qualidade está à altura da lista de clientes. Idade jovem (22) pode significar imaturidade comercial — pedir referências de cliente. Stack de ferramentas declarado é vago ("captação mobile", "edição estratégica") — confirmar quais apps/softwares específicos.',
    status: 'Em Análise',
    recommendedPosition: 'Mobile VideoMaker — Voxie Lab. Top candidato pendente de validação técnica. Pedir 5-10 vídeos reais (links) antes de avançar para entrevista. Se a qualidade do trabalho confirmar a lista de clientes, contratar imediatamente.',
    interviewNotes: 'AÇÃO PENDENTE: pedir 5-10 reels reais de marcas listadas (links Instagram ou Drive). Confirmar ferramentas exactas. Marcar entrevista logo após receção e validação.',
    personalNotes: 'Faixa 600.000–800.000 AKZ. Se entregar amostras de qualidade, é hire imediato. A lista de marcas é um diferencial competitivo enorme para o pitch da Voxie a futuros clientes.',
    contact: {
      email: '[email protected]',
      phone: '+244 943 142 592',
      linkedin: '',
      instagram: '@edgarvandunem',
      other: '',
    },
    portfolioLink: 'PDF anexado em conversa',
    cvLink: 'Incluído na apresentação',
    source: 'admin',
    createdAt: '2026-05-03',
    updatedAt: '2026-05-03',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CONFIG — keys come from Vercel environment variables
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabaseFetch = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATES — CRUD
// ─────────────────────────────────────────────────────────────────────────────
const loadCandidates = async () => {
  try {
    const rows = await supabaseFetch('/candidates?select=*&order=created_at.asc');
    if (rows && rows.length > 0) {
      return rows.map(r => r.data);
    }
    // Empty table → seed once with initial demo candidates
    try {
      await supabaseFetch('/candidates', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify(INITIAL_CANDIDATES.map(c => ({ id: c.id, data: c }))),
      });
    } catch (e) {
      console.warn('Seed insert warning (likely race or already seeded):', e.message);
    }
    return INITIAL_CANDIDATES;
  } catch (e) {
    console.error('loadCandidates failed:', e);
    throw e;
  }
};

const dbInsertCandidate = async (candidate) => {
  try {
    await supabaseFetch('/candidates', {
      method: 'POST',
      body: JSON.stringify({ id: candidate.id, data: candidate }),
    });
    return true;
  } catch (e) {
    console.error('Insert failed:', e);
    return false;
  }
};

const dbUpdateCandidate = async (candidate) => {
  try {
    await supabaseFetch(`/candidates?id=eq.${encodeURIComponent(candidate.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ data: candidate, updated_at: new Date().toISOString() }),
    });
    return true;
  } catch (e) {
    console.error('Update failed:', e);
    return false;
  }
};

const dbDeleteCandidate = async (id) => {
  try {
    await supabaseFetch(`/candidates?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
    return true;
  } catch (e) {
    console.error('Delete failed:', e);
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH HELPERS — SHA-256 hashing of admin password (browser SubtleCrypto)
// Password hash stored in Supabase `app_config` table under key 'admin_password'
// ─────────────────────────────────────────────────────────────────────────────
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const passwordExists = async () => {
  try {
    const rows = await supabaseFetch('/app_config?select=value&key=eq.admin_password');
    return Array.isArray(rows) && rows.length > 0 && !!rows[0].value;
  } catch (e) {
    console.error('passwordExists check failed:', e);
    return false;
  }
};

const setPasswordHash = async (password) => {
  try {
    const hash = await hashPassword(password);
    const existing = await supabaseFetch('/app_config?select=key&key=eq.admin_password');
    if (Array.isArray(existing) && existing.length > 0) {
      await supabaseFetch('/app_config?key=eq.admin_password', {
        method: 'PATCH',
        body: JSON.stringify({ value: hash, updated_at: new Date().toISOString() }),
      });
    } else {
      await supabaseFetch('/app_config', {
        method: 'POST',
        body: JSON.stringify({ key: 'admin_password', value: hash }),
      });
    }
    return true;
  } catch (e) {
    console.error('setPasswordHash failed:', e);
    return false;
  }
};

const verifyPassword = async (password) => {
  try {
    const rows = await supabaseFetch('/app_config?select=value&key=eq.admin_password');
    if (!Array.isArray(rows) || rows.length === 0) return false;
    const hash = await hashPassword(password);
    return hash === rows[0].value;
  } catch (e) {
    console.error('verifyPassword failed:', e);
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME — editorial luxury, warm dark
// ─────────────────────────────────────────────────────────────────────────────
const theme = {
  bg: '#0E0D0A',
  surface: '#161410',
  surfaceElev: '#1F1C16',
  border: '#2A2620',
  borderElev: '#3D3830',
  text: '#F2EEE3',
  textDim: '#A8A092',
  textMute: '#6E665A',
  accent: '#D4B87A',
  accentDim: '#8C7649',
};

const fontStack = `'Fraunces', 'Times New Roman', Georgia, serif`;
const sansStack = `'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif`;

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI BITS
// ─────────────────────────────────────────────────────────────────────────────
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; }
    ::selection { background: ${theme.accent}; color: ${theme.bg}; }
    input, textarea, select, button { font-family: ${sansStack}; }
    input:focus, textarea:focus, select:focus { outline: 1px solid ${theme.accent}; outline-offset: 1px; }
    .scroll-soft::-webkit-scrollbar { width: 6px; height: 6px; }
    .scroll-soft::-webkit-scrollbar-track { background: transparent; }
    .scroll-soft::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
    .scroll-soft::-webkit-scrollbar-thumb:hover { background: ${theme.borderElev}; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .anim-in { animation: fadeIn 0.4s ease-out forwards; }
  `}</style>
);

const Logo = ({ size = 'md', showSub = true }) => {
  const sizes = { sm: { mark: 26, name: 18 }, md: { mark: 38, name: 24 }, lg: { mark: 56, name: 40 } };
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: s.mark, height: s.mark, borderRadius: '50%',
        border: `1px solid ${theme.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: fontStack, fontStyle: 'italic', color: theme.accent, fontSize: s.mark * 0.5,
        fontWeight: 500,
      }}>V</div>
      <div>
        <div style={{ fontFamily: fontStack, fontSize: s.name, color: theme.text, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1 }}>
          Voxie <span style={{ fontStyle: 'italic', color: theme.accent }}>Talent</span>
        </div>
        {showSub && (
          <div style={{ fontFamily: sansStack, fontSize: 10, color: theme.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 4 }}>
            Concierge Database · v1
          </div>
        )}
      </div>
    </div>
  );
};

const Pill = ({ children, color, bg, sm }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: sm ? '3px 9px' : '5px 11px', borderRadius: 999,
    fontSize: sm ? 10 : 11, fontWeight: 500, letterSpacing: '0.03em',
    color: color || theme.textDim, background: bg || theme.surfaceElev,
    border: `1px solid ${theme.border}`, fontFamily: sansStack,
    whiteSpace: 'nowrap',
  }}>{children}</span>
);

const StatusPill = ({ status, sm }) => {
  const s = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: sm ? '3px 9px' : '5px 11px', borderRadius: 999,
      fontSize: sm ? 10 : 11, fontWeight: 500, letterSpacing: '0.03em',
      color: s.color, background: `${s.color}1A`,
      border: `1px solid ${s.color}40`, fontFamily: sansStack,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {s.value}
    </span>
  );
};

const Btn = ({ children, onClick, variant = 'primary', size = 'md', icon: Icon, disabled, type = 'button', full }) => {
  const variants = {
    primary: { bg: theme.accent, color: theme.bg, border: theme.accent, hov: '#E5C98A' },
    secondary: { bg: 'transparent', color: theme.text, border: theme.border, hov: theme.surface },
    ghost: { bg: 'transparent', color: theme.textDim, border: 'transparent', hov: theme.surface },
    danger: { bg: 'transparent', color: '#B5746B', border: '#B5746B40', hov: '#B5746B1A' },
  };
  const sizes = { sm: { px: 12, py: 6, fs: 11 }, md: { px: 16, py: 9, fs: 12 }, lg: { px: 20, py: 12, fs: 13 } };
  const v = variants[variant], sz = sizes[size];
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: `${sz.py}px ${sz.px}px`, borderRadius: 6,
        background: hov && !disabled ? v.hov : v.bg, color: v.color,
        border: `1px solid ${v.border}`, fontSize: sz.fs, fontWeight: 500,
        letterSpacing: '0.02em', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, transition: 'all 0.15s ease', fontFamily: sansStack,
        width: full ? '100%' : 'auto',
      }}
    >
      {Icon && <Icon size={sz.fs + 2} />}
      {children}
    </button>
  );
};

const Field = ({ label, children, hint, required, optional, autoFilled }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: theme.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7, fontFamily: sansStack, fontWeight: 500 }}>
      <span>{label}</span>
      {required && <span style={{ color: theme.accent }}>*</span>}
      {optional && <span style={{ color: theme.textMute, fontSize: 9, fontStyle: 'italic', textTransform: 'none', letterSpacing: '0.04em', fontWeight: 400 }}>(opcional)</span>}
      {autoFilled && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, color: theme.accent, background: `${theme.accent}1A`, border: `1px solid ${theme.accent}40`, padding: '2px 6px 2px 5px', borderRadius: 999, textTransform: 'none', letterSpacing: '0.04em', fontWeight: 500 }}>
          <Check size={9} strokeWidth={3} /> auto
        </span>
      )}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: theme.textMute, marginTop: 5, fontFamily: sansStack, fontStyle: 'italic' }}>{hint}</div>}
  </div>
);

const Input = (props) => (
  <input {...props} style={{
    width: '100%', padding: '10px 12px', background: theme.bg, color: theme.text,
    border: `1px solid ${theme.border}`, borderRadius: 4, fontSize: 13, fontFamily: sansStack,
    ...props.style,
  }} />
);

const Textarea = (props) => (
  <textarea {...props} style={{
    width: '100%', padding: '10px 12px', background: theme.bg, color: theme.text,
    border: `1px solid ${theme.border}`, borderRadius: 4, fontSize: 13, fontFamily: sansStack,
    resize: 'vertical', minHeight: 80, lineHeight: 1.5,
    ...props.style,
  }} />
);

const Select = (props) => (
  <select {...props} style={{
    width: '100%', padding: '10px 12px', background: theme.bg, color: theme.text,
    border: `1px solid ${theme.border}`, borderRadius: 4, fontSize: 13, fontFamily: sansStack,
    appearance: 'none', cursor: 'pointer',
    backgroundImage: `linear-gradient(45deg, transparent 50%, ${theme.textDim} 50%), linear-gradient(135deg, ${theme.textDim} 50%, transparent 50%)`,
    backgroundPosition: `calc(100% - 16px) 50%, calc(100% - 11px) 50%`,
    backgroundSize: '5px 5px',
    backgroundRepeat: 'no-repeat',
    paddingRight: 32,
    ...props.style,
  }} />
);

const Checkbox = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 0', fontSize: 13, color: theme.text, fontFamily: sansStack }}>
    <span style={{
      width: 16, height: 16, borderRadius: 3, border: `1px solid ${checked ? theme.accent : theme.border}`,
      background: checked ? theme.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s',
    }}>
      {checked && <Check size={11} color={theme.bg} strokeWidth={3} />}
    </span>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
    {label}
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────
// AUTH GATE — protects admin view with password (first-time setup or login)
// ─────────────────────────────────────────────────────────────────────────────
const AuthGate = ({ onAuth }) => {
  const [mode, setMode] = useState('checking'); // checking | setup | login
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    passwordExists().then(exists => {
      setMode(exists ? 'login' : 'setup');
    });
  }, []);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      if (mode === 'setup') {
        if (pwd.length < 6) { setError('A palavra-passe deve ter pelo menos 6 caracteres.'); setLoading(false); return; }
        if (pwd !== confirm) { setError('As palavras-passe não coincidem.'); setLoading(false); return; }
        const ok = await setPasswordHash(pwd);
        if (ok) onAuth();
        else setError('Erro ao guardar a palavra-passe. Tenta novamente.');
      } else {
        const valid = await verifyPassword(pwd);
        if (valid) onAuth();
        else setError('Palavra-passe incorrecta.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Verifica a consola e tenta novamente.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  if (mode === 'checking') {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.textDim, fontFamily: sansStack, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        <FontImport />
        Verificando acesso...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: sansStack, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <FontImport />
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex' }}><Logo size="md" showSub={false} /></div>
        </div>

        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${theme.accent}1A`, border: `1px solid ${theme.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              {mode === 'setup' ? <ShieldCheck size={20} color={theme.accent} /> : <KeyRound size={20} color={theme.accent} />}
            </div>
            <div style={{ fontSize: 11, color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 500 }}>
              {mode === 'setup' ? 'Primeiro Acesso' : 'Acesso Restrito'}
            </div>
            <h2 style={{ fontFamily: fontStack, fontSize: 28, color: theme.text, margin: 0, fontWeight: 400, letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2 }}>
              {mode === 'setup' ? 'Define a palavra-passe' : 'Vista Admin'}
            </h2>
            <p style={{ color: theme.textDim, fontSize: 13, lineHeight: 1.6, marginTop: 12, textAlign: 'center', maxWidth: 340 }}>
              {mode === 'setup'
                ? 'Esta palavra-passe protege a base de talento da Voxie. Mínimo 6 caracteres. Guarda-a num local seguro — não há recuperação automática.'
                : 'Insere a palavra-passe para aceder à base de talento.'}
            </p>
          </div>

          <div>
            <Field label="Palavra-passe" required>
              <div style={{ position: 'relative' }}>
                <Input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  required
                  style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: theme.textMute, cursor: 'pointer', padding: 4 }}>
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>

            {mode === 'setup' && (
              <Field label="Confirmar palavra-passe" required>
                <Input
                  type={showPwd ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                />
              </Field>
            )}

            {error && (
              <div style={{ padding: 12, background: '#B5746B1A', border: '1px solid #B5746B40', borderRadius: 4, marginBottom: 16, fontSize: 12, color: '#B5746B', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <Btn onClick={handleSubmit} variant="primary" full disabled={loading} icon={mode === 'setup' ? ShieldCheck : Unlock}>
              {loading ? 'Aguarda...' : (mode === 'setup' ? 'Definir e Entrar' : 'Entrar')}
            </Btn>
          </div>

          {mode === 'setup' && (
            <p style={{ fontSize: 11, color: theme.textMute, marginTop: 20, textAlign: 'center', lineHeight: 1.6, fontStyle: 'italic' }}>
              A palavra-passe é hashada (SHA-256) antes de ser guardada. Não fica em texto simples.
            </p>
          )}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 10, color: theme.textMute, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          Voxie Talent · Concierge Recruitment
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────
const FilterBar = ({ filters, setFilters, onReset, candidates }) => {
  const [open, setOpen] = useState(false);
  const activeCount = Object.values(filters).filter(v => v && v !== 'all' && (Array.isArray(v) ? v.length : true)).length;

  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMute }} />
          <Input
            placeholder="Pesquisar por nome, marca, skill..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <Btn icon={Filter} variant="secondary" onClick={() => setOpen(!open)}>
          Filtros {activeCount > 0 && <Pill sm color={theme.accent} bg={`${theme.accent}1A`}>{activeCount}</Pill>}
        </Btn>
        {activeCount > 0 && <Btn icon={X} variant="ghost" size="sm" onClick={onReset}>Limpar</Btn>}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, color: theme.textMute, fontFamily: sansStack, letterSpacing: '0.04em' }}>
          {candidates.length} candidato{candidates.length !== 1 ? 's' : ''}
        </div>
      </div>

      {open && (
        <div className="anim-in" style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.border}`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <Field label="Cargo (Best Fit)">
            <Select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              <option value="all">Todos</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
          </Field>
          <Field label="Nível de Experiência">
            <Select value={filters.level} onChange={(e) => setFilters({ ...filters, level: e.target.value })}>
              <option value="all">Todos</option>
              {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </Select>
          </Field>
          <Field label="Modelo de Trabalho">
            <Select value={filters.workModel} onChange={(e) => setFilters({ ...filters, workModel: e.target.value })}>
              <option value="all">Todos</option>
              {WORK_MODELS.map(w => <option key={w} value={w}>{w}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="all">Todos</option>
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
            </Select>
          </Field>
          <Field label="Salário Máximo (AKZ)" hint="Filtra por expectativa salarial">
            <Input
              type="number"
              placeholder="ex: 800000"
              value={filters.maxSalary}
              onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
            />
          </Field>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE CARD
// ─────────────────────────────────────────────────────────────────────────────
const CandidateCard = ({ candidate, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: theme.surface, border: `1px solid ${hov ? theme.borderElev : theme.border}`,
        borderRadius: 8, padding: 22, cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-1px)' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {candidate.source === 'self-registered' && (
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <Pill sm color={theme.accent} bg={`${theme.accent}1A`}><UserPlus size={9} /> Auto-registo</Pill>
        </div>
      )}
      <div style={{ marginBottom: 14 }}>
        <h3 style={{
          fontFamily: fontStack, fontSize: 22, color: theme.text, margin: 0,
          fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.2,
        }}>{candidate.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 11, color: theme.textMute, fontFamily: sansStack, letterSpacing: '0.04em' }}>
          <Briefcase size={11} /> {candidate.bestFitRole}
          {candidate.roleApplied !== candidate.bestFitRole && (
            <span style={{ color: theme.accentDim }}> (aplicou: {candidate.roleApplied})</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        <StatusPill sm status={candidate.status} />
        <Pill sm><Star size={9} /> {candidate.experienceLevel}{candidate.yearsExperience ? ` · ${candidate.yearsExperience}a` : ''}</Pill>
        {candidate.workModels?.length > 0
          ? candidate.workModels.map(m => <Pill sm key={m}>{m}</Pill>)
          : <Pill sm color={theme.textMute}>Modelo: —</Pill>}
      </div>

      <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12, fontFamily: sansStack }}>
        <div>
          <div style={{ fontSize: 10, color: theme.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Expectativa</div>
          <div style={{ color: candidate.expectedSalary ? theme.text : theme.textMute, fontWeight: 500, fontStyle: candidate.expectedSalary ? 'normal' : 'italic' }}>{formatSalary(candidate.expectedSalary)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: theme.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Localização</div>
          <div style={{ color: candidate.location ? theme.text : theme.textMute, fontWeight: 500, fontStyle: candidate.location ? 'normal' : 'italic' }}>{naField(candidate.location)}</div>
        </div>
      </div>

      {candidate.brandsWorkedWith?.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 10, color: theme.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Marcas</div>
          <div style={{ fontSize: 11, color: theme.textDim, fontFamily: sansStack, lineHeight: 1.5 }}>
            {candidate.brandsWorkedWith.slice(0, 5).join(' · ')}
            {candidate.brandsWorkedWith.length > 5 && <span style={{ color: theme.textMute }}> +{candidate.brandsWorkedWith.length - 5}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE DETAIL PANEL (admin)
// ─────────────────────────────────────────────────────────────────────────────
const CandidateDetail = ({ candidate, onClose, onSave, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(candidate);
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { setDraft(candidate); setEditing(false); setConfirmDelete(false); setShareOpen(false); }, [candidate.id]);

  const shareUrl = `${window.location.origin}${window.location.pathname}#profile/${candidate.id}`;

  const handleSave = () => {
    onSave({ ...draft, updatedAt: new Date().toISOString().slice(0, 10) });
    setEditing(false);
  };

  const c = editing ? draft : candidate;

  const showOrNa = (val) => {
    if (val === null || val === undefined || val === '') return <span style={{ color: theme.textMute, fontStyle: 'italic' }}>—</span>;
    return val;
  };

  const showListOrNa = (arr) => {
    if (!arr || arr.length === 0) return <span style={{ color: theme.textMute, fontStyle: 'italic', fontSize: 13 }}>—</span>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
        {arr.map(s => <Pill key={s}>{s}</Pill>)}
      </div>
    );
  };

  const showTextOrNa = (val) => {
    if (val === null || val === undefined || val === '') {
      return <p style={{ color: theme.textMute, fontStyle: 'italic', fontSize: 13, margin: 0 }}>—</p>;
    }
    return <p style={{ color: theme.textDim, lineHeight: 1.7, fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>{val}</p>;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 100, display: 'flex', justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="scroll-soft anim-in"
        style={{
          width: '100%', maxWidth: 720, background: theme.bg, borderLeft: `1px solid ${theme.border}`,
          height: '100vh', overflow: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, background: theme.bg, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1 }}>
              {editing ? (
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={{ fontSize: 24, fontFamily: fontStack, fontWeight: 400, padding: '6px 10px', marginBottom: 8 }} />
              ) : (
                <h2 style={{ fontFamily: fontStack, fontSize: 32, color: theme.text, margin: 0, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{c.name}</h2>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                <StatusPill status={c.status} />
                {c.source === 'self-registered' && <Pill color={theme.accent} bg={`${theme.accent}1A`}><UserPlus size={10} /> Auto-registo</Pill>}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: theme.textDim, cursor: 'pointer', padding: 4 }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
            {!editing ? (
              <>
                <Btn icon={Edit3} variant="secondary" size="sm" onClick={() => setEditing(true)}>Editar</Btn>
                <Btn icon={Share2} variant="primary" size="sm" onClick={() => setShareOpen(true)}>
                  Partilhar Perfil
                </Btn>
                {confirmDelete ? (
                  <>
                    <span style={{ fontSize: 11, color: theme.textDim, alignSelf: 'center', fontFamily: sansStack }}>Confirmar?</span>
                    <Btn variant="danger" size="sm" onClick={() => onDelete(candidate.id)}>Eliminar</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Btn>
                  </>
                ) : (
                  <Btn icon={Trash2} variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Eliminar</Btn>
                )}
              </>
            ) : (
              <>
                <Btn icon={Check} variant="primary" size="sm" onClick={handleSave}>Guardar</Btn>
                <Btn variant="ghost" size="sm" onClick={() => { setDraft(candidate); setEditing(false); }}>Cancelar</Btn>
              </>
            )}
          </div>
        </div>

        <div style={{ padding: 32, fontFamily: sansStack, color: theme.text }}>
          {/* Position info */}
          <Section title="Posição">
            <Grid>
              <DetailField label="Cargo Aplicado">
                {editing ? (
                  <Select value={draft.roleApplied} onChange={(e) => setDraft({ ...draft, roleApplied: e.target.value })}>
                    {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                ) : showOrNa(c.roleApplied)}
              </DetailField>
              <DetailField label="Best Fit (Voxie)">
                {editing ? (
                  <Select value={draft.bestFitRole} onChange={(e) => setDraft({ ...draft, bestFitRole: e.target.value })}>
                    {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                ) : <span style={{ color: theme.accent, fontWeight: 500 }}>{c.bestFitRole || 'A definir'}</span>}
              </DetailField>
              <DetailField label="Nível">
                {editing ? (
                  <Select value={draft.experienceLevel} onChange={(e) => setDraft({ ...draft, experienceLevel: e.target.value })}>
                    {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </Select>
                ) : showOrNa(c.experienceLevel)}
              </DetailField>
              <DetailField label="Anos de Experiência">
                {editing ? (
                  <Input type="number" value={draft.yearsExperience || ''} onChange={(e) => setDraft({ ...draft, yearsExperience: parseInt(e.target.value) || null })} placeholder="Deixa vazio se desconhecido" />
                ) : (c.yearsExperience ? `${c.yearsExperience} anos` : showOrNa(null))}
              </DetailField>
              <DetailField label="Status">
                {editing ? (
                  <Select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                  </Select>
                ) : c.status}
              </DetailField>
              <DetailField label="Localização">
                {editing ? (
                  <Input value={draft.location || ''} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
                ) : showOrNa(c.location)}
              </DetailField>
            </Grid>
          </Section>

          {/* Salary & Work model */}
          <Section title="Compensação & Modelo">
            <Grid>
              <DetailField label="Expectativa Salarial">
                {editing ? (
                  <Input type="number" value={draft.expectedSalary || ''} onChange={(e) => setDraft({ ...draft, expectedSalary: parseInt(e.target.value) || null })} placeholder="Deixa vazio se desconhecido" />
                ) : <span style={{ color: c.expectedSalary ? theme.accent : theme.textMute, fontStyle: c.expectedSalary ? 'normal' : 'italic', fontWeight: 500 }}>{formatSalary(c.expectedSalary)}</span>}
              </DetailField>
              <DetailField label="Último Salário">
                {editing ? (
                  <Input type="number" value={draft.lastSalary || ''} onChange={(e) => setDraft({ ...draft, lastSalary: parseInt(e.target.value) || null })} placeholder="Deixa vazio se desconhecido" />
                ) : <span style={{ color: c.lastSalary ? theme.text : theme.textMute, fontStyle: c.lastSalary ? 'normal' : 'italic' }}>{formatSalary(c.lastSalary)}</span>}
              </DetailField>
            </Grid>
            <DetailField label="Modelos Aceitos">
              {editing ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
                  {WORK_MODELS.map(m => (
                    <Checkbox key={m} label={m}
                      checked={draft.workModels?.includes(m)}
                      onChange={() => {
                        const wm = draft.workModels || [];
                        setDraft({ ...draft, workModels: wm.includes(m) ? wm.filter(x => x !== m) : [...wm, m] });
                      }} />
                  ))}
                </div>
              ) : showListOrNa(c.workModels)}
            </DetailField>
          </Section>

          {/* Skills, tools, brands */}
          <Section title="Competências">
            <DetailField label="Skills-chave">
              {editing ? (
                <Input value={draft.keySkills?.join(', ') || ''} onChange={(e) => setDraft({ ...draft, keySkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              ) : showListOrNa(c.keySkills)}
            </DetailField>
            <DetailField label="Ferramentas">
              {editing ? (
                <Input value={draft.tools?.join(', ') || ''} onChange={(e) => setDraft({ ...draft, tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              ) : showListOrNa(c.tools)}
            </DetailField>
            <DetailField label="Marcas / Clientes">
              {editing ? (
                <Textarea value={draft.brandsWorkedWith?.join(', ') || ''} onChange={(e) => setDraft({ ...draft, brandsWorkedWith: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              ) : showListOrNa(c.brandsWorkedWith)}
            </DetailField>
            <DetailField label="Idiomas">
              {editing ? (
                <Input value={draft.languages?.join(', ') || ''} onChange={(e) => setDraft({ ...draft, languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              ) : showListOrNa(c.languages)}
            </DetailField>
          </Section>

          <Section title="Bio">
            {editing ? (
              <Textarea value={draft.bio || ''} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
            ) : showTextOrNa(c.bio)}
          </Section>

          {/* INTERNAL ASSESSMENT */}
          <Section title="Avaliação Interna" warning="Confidencial — não exposto na partilha pública">
            <DetailField label="Forças">
              {editing ? (
                <Textarea value={draft.strengths || ''} onChange={(e) => setDraft({ ...draft, strengths: e.target.value })} />
              ) : showTextOrNa(c.strengths)}
            </DetailField>
            <DetailField label="Fraquezas / Gaps">
              {editing ? (
                <Textarea value={draft.weaknesses || ''} onChange={(e) => setDraft({ ...draft, weaknesses: e.target.value })} />
              ) : showTextOrNa(c.weaknesses)}
            </DetailField>
            <DetailField label="Recomendação">
              {editing ? (
                <Textarea value={draft.recommendedPosition || ''} onChange={(e) => setDraft({ ...draft, recommendedPosition: e.target.value })} />
              ) : showTextOrNa(c.recommendedPosition)}
            </DetailField>
            <DetailField label="Notas de Entrevista">
              {editing ? (
                <Textarea value={draft.interviewNotes || ''} onChange={(e) => setDraft({ ...draft, interviewNotes: e.target.value })} />
              ) : showTextOrNa(c.interviewNotes)}
            </DetailField>
            <DetailField label="Notas Pessoais">
              {editing ? (
                <Textarea value={draft.personalNotes || ''} onChange={(e) => setDraft({ ...draft, personalNotes: e.target.value })} />
              ) : showTextOrNa(c.personalNotes)}
            </DetailField>
          </Section>

          {/* Contact */}
          <Section title="Contacto" warning="Confidencial — oculto na partilha pública">
            <Grid>
              <DetailField label="Email">
                {editing ? (
                  <Input value={draft.contact?.email || ''} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, email: e.target.value } })} />
                ) : showOrNa(c.contact?.email)}
              </DetailField>
              <DetailField label="Telefone">
                {editing ? (
                  <Input value={draft.contact?.phone || ''} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, phone: e.target.value } })} />
                ) : showOrNa(c.contact?.phone)}
              </DetailField>
              <DetailField label="LinkedIn">
                {editing ? (
                  <Input value={draft.contact?.linkedin || ''} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, linkedin: e.target.value } })} />
                ) : showOrNa(c.contact?.linkedin)}
              </DetailField>
              <DetailField label="Instagram / Outro">
                {editing ? (
                  <Input value={draft.contact?.instagram || ''} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, instagram: e.target.value } })} />
                ) : showOrNa(c.contact?.instagram)}
              </DetailField>
            </Grid>
            <DetailField label="Portfólio">
              {editing ? (
                <Input value={draft.portfolioLink || ''} onChange={(e) => setDraft({ ...draft, portfolioLink: e.target.value })} />
              ) : showOrNa(c.portfolioLink)}
            </DetailField>
            <DetailField label="CV">
              {editing ? (
                <Input value={draft.cvLink || ''} onChange={(e) => setDraft({ ...draft, cvLink: e.target.value })} />
              ) : showOrNa(c.cvLink)}
            </DetailField>
          </Section>

          <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${theme.border}`, fontSize: 10, color: theme.textMute, fontFamily: sansStack, letterSpacing: '0.06em' }}>
            ID: {c.id} · Criado: {c.createdAt} · Atualizado: {c.updatedAt} · Origem: {c.source === 'admin' ? 'Admin' : 'Auto-registo'}
          </div>
        </div>
      </div>

      {shareOpen && (
        <ShareDialog
          url={shareUrl}
          title="Partilhar Perfil"
          description={`Vista sanitizada de ${candidate.name} — sem contactos, sem notas internas. Envia este link a clientes para apresentar o candidato.`}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
};

const Section = ({ title, children, warning }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{
      fontFamily: fontStack, fontSize: 11, color: theme.accent, letterSpacing: '0.18em',
      textTransform: 'uppercase', fontWeight: 500, marginBottom: 14,
      paddingBottom: 8, borderBottom: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span>{title}</span>
      {warning && (
        <span style={{ fontSize: 9, color: theme.textMute, letterSpacing: '0.08em', fontStyle: 'italic', textTransform: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Lock size={10} /> {warning}
        </span>
      )}
    </div>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>{children}</div>
);

const DetailField = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 10, color: theme.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, fontFamily: sansStack, fontWeight: 500 }}>{label}</div>
    <div style={{ color: theme.text, fontSize: 13, fontFamily: sansStack }}>{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC PROFILE VIEW (client-facing, sanitized)
// ─────────────────────────────────────────────────────────────────────────────
const PublicProfile = ({ candidate }) => {
  if (!candidate) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: sansStack, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 40, textAlign: 'center' }}>
        <FontImport />
        <AlertCircle size={32} color={theme.accentDim} />
        <h2 style={{ fontFamily: fontStack, fontSize: 28, marginTop: 20, marginBottom: 8, fontWeight: 400 }}>Perfil indisponível</h2>
        <p style={{ color: theme.textDim, maxWidth: 400 }}>Este link de partilha pode ter expirado ou o candidato já não está disponível na nossa base de talentos.</p>
        <p style={{ color: theme.textMute, fontSize: 12, marginTop: 24 }}>Para mais informação, contacte a Voxie Talent directamente.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: sansStack }}>
      <FontImport />
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${theme.border}`, padding: '24px 0' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Logo size="sm" showSub={false} />
          <Pill color={theme.accent} bg={`${theme.accent}1A`}><Eye size={10} /> Vista Cliente · Confidencial</Pill>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 32px 80px' }}>
        {/* Title */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, fontFamily: sansStack, fontWeight: 500 }}>
            Candidato Recomendado
          </div>
          <h1 style={{ fontFamily: fontStack, fontSize: 56, color: theme.text, margin: 0, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
            {candidate.name}
          </h1>
          <div style={{ marginTop: 18, fontSize: 16, color: theme.textDim, fontFamily: fontStack, fontStyle: 'italic' }}>
            {candidate.bestFitRole}{candidate.experienceLevel ? ` · ${candidate.experienceLevel}` : ''}{candidate.yearsExperience ? ` · ${candidate.yearsExperience} anos de experiência` : ''}
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {candidate.workModels?.length > 0 && candidate.workModels.map(m => <Pill key={m}>{m}</Pill>)}
            {candidate.location && <Pill><MapPin size={9} /> {candidate.location}</Pill>}
          </div>
        </div>

        {/* Bio */}
        {candidate.bio && (
          <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: `1px solid ${theme.border}` }}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: theme.text, fontFamily: fontStack, fontWeight: 300, margin: 0 }}>
              "{candidate.bio}"
            </p>
          </div>
        )}

        {/* Investment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 48 }}>
          <PublicStat label="Faixa Salarial" value={formatSalary(candidate.expectedSalary)} accent />
          <PublicStat label="Modelos Aceitos" value={candidate.workModels?.length > 0 ? candidate.workModels.join(' · ') : '—'} />
          <PublicStat label="Idiomas" value={candidate.languages?.length > 0 ? candidate.languages.join(' · ') : '—'} />
        </div>

        {/* Strengths */}
        {candidate.strengths && (
          <PublicSection title="Porquê Este Candidato">
            <p style={{ color: theme.textDim, lineHeight: 1.8, fontSize: 14, margin: 0, whiteSpace: 'pre-wrap' }}>{candidate.strengths}</p>
          </PublicSection>
        )}

        {/* Skills */}
        {candidate.keySkills?.length > 0 && (
          <PublicSection title="Competências-Chave">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {candidate.keySkills.map(s => <Pill key={s}>{s}</Pill>)}
            </div>
          </PublicSection>
        )}

        {/* Tools */}
        {candidate.tools?.length > 0 && (
          <PublicSection title="Ferramentas">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {candidate.tools.map(s => <Pill key={s}>{s}</Pill>)}
            </div>
          </PublicSection>
        )}

        {/* Brands */}
        {candidate.brandsWorkedWith?.length > 0 && (
          <PublicSection title="Marcas / Clientes Anteriores">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {candidate.brandsWorkedWith.map(s => <Pill key={s}>{s}</Pill>)}
            </div>
          </PublicSection>
        )}

        {/* CTA */}
        <div style={{ marginTop: 64, padding: 32, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>
            Próximo Passo
          </div>
          <h3 style={{ fontFamily: fontStack, fontSize: 26, margin: '0 0 12px', fontWeight: 400, letterSpacing: '-0.015em' }}>
            Interessado em avançar com este candidato?
          </h3>
          <p style={{ color: theme.textDim, fontSize: 14, lineHeight: 1.6, maxWidth: 520, margin: '0 auto 20px' }}>
            Todas as conversas, entrevistas e contratações são geridas pela Voxie Talent. Contacte-nos para agendar uma entrevista ou pedir referências adicionais.
          </p>
          <p style={{ color: theme.textMute, fontSize: 11, fontStyle: 'italic', letterSpacing: '0.04em' }}>
            Os dados de contacto do candidato são confidenciais e geridos pela Voxie.
          </p>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center', fontSize: 10, color: theme.textMute, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          Voxie Talent · Concierge Recruitment
        </div>
      </div>
    </div>
  );
};

const PublicStat = ({ label, value, accent }) => (
  <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 6, padding: 18 }}>
    <div style={{ fontSize: 10, color: theme.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: accent ? 22 : 14, color: accent ? theme.accent : theme.text, fontFamily: accent ? fontStack : sansStack, fontWeight: 500, lineHeight: 1.3 }}>{value || '—'}</div>
  </div>
);

const PublicSection = ({ title, children }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{ fontFamily: fontStack, fontSize: 22, color: theme.text, margin: '0 0 18px', fontWeight: 400, letterSpacing: '-0.01em' }}>{title}</h2>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-FILL — extract structured candidate data from CV / portfolio via API
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 3;

const EMPTY_FORM_DATA = {
  name: '', roleApplied: ROLE_OPTIONS[0], experienceLevel: 'Mid', yearsExperience: '',
  workModels: [], expectedSalary: '', lastSalary: '', location: '',
  languages: '', tools: '', keySkills: '', brandsWorkedWith: '',
  bio: '', portfolioLink: '', cvLink: '',
  contact: { email: '', phone: '', linkedin: '', instagram: '', other: '' },
};

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = () => reject(new Error('Falha a ler o ficheiro.'));
  reader.readAsDataURL(file);
});

const extractFromFiles = async (files) => {
  const blocks = await Promise.all(files.map(async (file) => {
    const base64Data = await fileToBase64(file);
    if (file.type === 'application/pdf') {
      return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } };
    }
    return { type: 'image', source: { type: 'base64', media_type: file.type, data: base64Data } };
  }));

  const prompt = `És um sistema de extracção de dados estruturados de CVs e portfólios para a Voxie Talent (agência de talento angolana).

Analisa o(s) documento(s) anexo(s) e extrai APENAS dados explicitamente mencionados. NÃO INVENTES nem infiras dados que não estejam claramente presentes.

Retorna EXCLUSIVAMENTE um objecto JSON válido (sem markdown, sem explicações, sem code fences) com esta estrutura exacta:

{
  "name": string ou null,
  "roleApplied": string ou null,
  "experienceLevel": "Junior" | "Mid" | "Senior" | "Lead" ou null,
  "yearsExperience": number ou null,
  "location": string ou null,
  "languages": [string],
  "tools": [string],
  "keySkills": [string],
  "brandsWorkedWith": [string],
  "bio": string ou null,
  "expectedSalary": number ou null,
  "contact": {
    "email": string ou null,
    "phone": string ou null,
    "linkedin": string ou null,
    "instagram": string ou null
  }
}

Regras:
- "roleApplied" deve ser uma destas opções (a mais próxima do que a pessoa faz): ${ROLE_OPTIONS.join(' | ')}. Se incerto, usa "A definir".
- "experienceLevel": Junior (0-2 anos), Mid (3-5 anos), Senior (6+ anos), Lead (gere equipas directamente). Se incerto, null.
- "languages": formato "Idioma (Nível)" ex: "Português (Nativo)", "Inglês (Avançado)".
- "brandsWorkedWith": empresas/marcas/clientes mencionados como experiência ou no portfólio.
- "tools": software/tecnologias dominadas (ex: Photoshop, Figma, Premiere).
- "keySkills": competências profissionais (ex: Branding, Social Media, UI Design).
- "bio": 1-3 frases em português sintetizadas a partir do sumário/objectivo profissional. Se não houver, null.
- "contact.phone": formato internacional se possível (ex: +244 XXX XXX XXX).
- NÃO incluas "expectedSalary" a menos que esteja claramente declarado no documento.
- Para campos não encontrados: null (strings/numbers) ou [] (arrays).

Responde APENAS com o JSON. Sem texto antes ou depois.`;

  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      files: blocks,
      prompt,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.error || `Erro da análise (${response.status})`);
  }

  const text = (result.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  if (!text) throw new Error('A análise devolveu uma resposta vazia.');

  // Defensive JSON extraction (strip fences, find object boundaries)
  let jsonStr = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  const start = jsonStr.indexOf('{');
  const end = jsonStr.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Não foi possível interpretar a análise.');
  jsonStr = jsonStr.slice(start, end + 1);

  return JSON.parse(jsonStr);
};

const mapExtractedToFormData = (e) => ({
  name: e.name || '',
  roleApplied: ROLE_OPTIONS.includes(e.roleApplied) ? e.roleApplied : 'A definir',
  experienceLevel: EXPERIENCE_LEVELS.includes(e.experienceLevel) ? e.experienceLevel : 'Mid',
  yearsExperience: e.yearsExperience != null ? String(e.yearsExperience) : '',
  workModels: [],
  expectedSalary: e.expectedSalary != null ? String(e.expectedSalary) : '',
  lastSalary: '',
  location: e.location || '',
  languages: (e.languages || []).join(', '),
  tools: (e.tools || []).join(', '),
  keySkills: (e.keySkills || []).join(', '),
  brandsWorkedWith: (e.brandsWorkedWith || []).join(', '),
  bio: e.bio || '',
  portfolioLink: '',
  cvLink: '',
  contact: {
    email: e.contact?.email || '',
    phone: e.contact?.phone || '',
    linkedin: e.contact?.linkedin || '',
    instagram: e.contact?.instagram || '',
    other: '',
  },
});

const buildAutoFilledKeys = (e) => {
  const keys = new Set();
  if (e.name) keys.add('name');
  if (e.roleApplied && e.roleApplied !== 'A definir') keys.add('roleApplied');
  if (e.experienceLevel) keys.add('experienceLevel');
  if (e.yearsExperience != null) keys.add('yearsExperience');
  if (e.location) keys.add('location');
  if (e.languages?.length) keys.add('languages');
  if (e.tools?.length) keys.add('tools');
  if (e.keySkills?.length) keys.add('keySkills');
  if (e.brandsWorkedWith?.length) keys.add('brandsWorkedWith');
  if (e.bio) keys.add('bio');
  if (e.expectedSalary != null) keys.add('expectedSalary');
  if (e.contact?.email) keys.add('contact.email');
  if (e.contact?.phone) keys.add('contact.phone');
  if (e.contact?.linkedin) keys.add('contact.linkedin');
  if (e.contact?.instagram) keys.add('contact.instagram');
  return keys;
};

// ─── Shared shell for all register-flow screens ─────────────────────────────
const RegisterShell = ({ children }) => (
  <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: sansStack }}>
    <FontImport />
    <div style={{ borderBottom: `1px solid ${theme.border}`, padding: '24px 0' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 32px' }}>
        <Logo size="sm" />
      </div>
    </div>
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px 80px' }}>
      {children}
    </div>
  </div>
);

// ─── Step 1: Choice between auto-fill and manual ────────────────────────────
const ChoicePanel = ({ onUpload, onManual }) => {
  const [hov1, setHov1] = useState(false);
  const [hov2, setHov2] = useState(false);
  return (
    <RegisterShell>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>
          Candidatura · Auto-Registo
        </div>
        <h1 style={{ fontFamily: fontStack, fontSize: 48, margin: 0, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
          Junta-te à base de talento <span style={{ fontStyle: 'italic', color: theme.accent }}>Voxie</span>
        </h1>
        <p style={{ color: theme.textDim, fontSize: 15, lineHeight: 1.7, marginTop: 18, maxWidth: 580 }}>
          Como queres começar?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <button
          onClick={onUpload}
          onMouseEnter={() => setHov1(true)}
          onMouseLeave={() => setHov1(false)}
          style={{
            background: theme.surface, border: `1px solid ${hov1 ? theme.accent : theme.border}`,
            borderRadius: 8, padding: 28, textAlign: 'left', cursor: 'pointer',
            transition: 'all 0.2s ease', transform: hov1 ? 'translateY(-2px)' : 'none',
            color: theme.text, fontFamily: sansStack,
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${theme.accent}1A`, border: `1px solid ${theme.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Sparkles size={18} color={theme.accent} />
          </div>
          <div style={{ fontSize: 10, color: theme.accent, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>
            Mais rápido · ~30 segundos
          </div>
          <h3 style={{ fontFamily: fontStack, fontSize: 24, margin: '0 0 10px', fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Tenho CV ou portfólio
          </h3>
          <p style={{ color: theme.textDim, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Envia o teu CV (PDF) e/ou portfólio. A nossa IA extrai automaticamente os teus dados — só revês e completas o que faltar.
          </p>
        </button>

        <button
          onClick={onManual}
          onMouseEnter={() => setHov2(true)}
          onMouseLeave={() => setHov2(false)}
          style={{
            background: theme.surface, border: `1px solid ${hov2 ? theme.borderElev : theme.border}`,
            borderRadius: 8, padding: 28, textAlign: 'left', cursor: 'pointer',
            transition: 'all 0.2s ease', transform: hov2 ? 'translateY(-2px)' : 'none',
            color: theme.text, fontFamily: sansStack,
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: theme.surfaceElev, border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Edit3 size={18} color={theme.textDim} />
          </div>
          <div style={{ fontSize: 10, color: theme.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>
            Tradicional · ~5 minutos
          </div>
          <h3 style={{ fontFamily: fontStack, fontSize: 24, margin: '0 0 10px', fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Preencher manualmente
          </h3>
          <p style={{ color: theme.textDim, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Não tens CV digital? Sem problema. Preenche o formulário tradicional — só leva uns minutos.
          </p>
        </button>
      </div>

      <p style={{ fontSize: 11, color: theme.textMute, marginTop: 32, textAlign: 'center', fontStyle: 'italic', letterSpacing: '0.04em' }}>
        Os teus dados são confidenciais e geridos exclusivamente pela Voxie Talent.
      </p>
    </RegisterShell>
  );
};

// ─── Step 2a: File upload with drag-drop ────────────────────────────────────
const UploadPanel = ({ onSubmit, onBack, onSkipToManual, externalError }) => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef(null);

  const validate = (proposed) => {
    if (proposed.length === 0) return null;
    if (proposed.length > MAX_FILES) return `Máximo ${MAX_FILES} ficheiros por candidatura.`;
    for (const f of proposed) {
      if (!ALLOWED_FILE_TYPES.includes(f.type)) {
        return `Tipo não suportado em "${f.name}". Aceitamos PDF, JPG, PNG ou WEBP.`;
      }
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `"${f.name}" é demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB por ficheiro.`;
      }
    }
    return null;
  };

  const handleFiles = (incoming) => {
    const merged = [...files, ...Array.from(incoming)];
    // Cap to MAX_FILES, dedup by name+size
    const seen = new Set();
    const unique = merged.filter(f => {
      const k = `${f.name}-${f.size}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, MAX_FILES);
    const err = validate(unique);
    if (err) { setValidationError(err); return; }
    setValidationError('');
    setFiles(unique);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
    setValidationError('');
  };

  const canSubmit = files.length > 0 && !validationError;

  return (
    <RegisterShell>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: theme.textDim, cursor: 'pointer', padding: 0, fontSize: 12, fontFamily: sansStack, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        <ArrowLeft size={13} /> Voltar
      </button>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>
          Passo 1 de 2 · Envia os teus ficheiros
        </div>
        <h1 style={{ fontFamily: fontStack, fontSize: 40, margin: 0, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
          Envia o teu CV ou portfólio
        </h1>
        <p style={{ color: theme.textDim, fontSize: 14, lineHeight: 1.7, marginTop: 14 }}>
          Aceitamos PDF, JPG, PNG e WEBP. Até {MAX_FILES} ficheiros, máximo {MAX_FILE_SIZE_MB}MB cada. A análise demora cerca de 20-30 segundos.
        </p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          background: dragOver ? `${theme.accent}10` : theme.surface,
          border: `2px dashed ${dragOver ? theme.accent : theme.border}`,
          borderRadius: 10, padding: 44, textAlign: 'center', cursor: 'pointer',
          transition: 'all 0.2s ease', marginBottom: 16,
        }}
      >
        <Upload size={28} color={dragOver ? theme.accent : theme.textDim} style={{ marginBottom: 14 }} />
        <div style={{ fontFamily: fontStack, fontSize: 18, color: theme.text, marginBottom: 6, fontWeight: 400 }}>
          Arrasta ficheiros para aqui
        </div>
        <div style={{ fontSize: 12, color: theme.textDim, fontFamily: sansStack }}>
          ou <span style={{ color: theme.accent, textDecoration: 'underline' }}>escolhe do teu dispositivo</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {files.map((f, i) => (
            <div key={`${f.name}-${i}`} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 14,
              background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 6, marginBottom: 8,
            }}>
              <FileText size={16} color={theme.accent} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: theme.text, fontFamily: sansStack, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </div>
                <div style={{ fontSize: 11, color: theme.textMute, fontFamily: sansStack, marginTop: 2 }}>
                  {(f.size / 1024).toFixed(0)} KB · {(f.type.split('/')[1] || 'file').toUpperCase()}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{ background: 'transparent', border: 'none', color: theme.textMute, cursor: 'pointer', padding: 6 }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {(validationError || externalError) && (
        <div style={{ padding: 14, background: '#B5746B1A', border: '1px solid #B5746B40', borderRadius: 6, marginBottom: 16, fontSize: 13, color: '#B5746B', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
          <AlertCircle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
          <span>{validationError || externalError}</span>
        </div>
      )}

      <Btn onClick={() => onSubmit(files)} variant="primary" size="lg" full disabled={!canSubmit} icon={Sparkles}>
        Analisar e continuar
      </Btn>

      {externalError && onSkipToManual && (
        <div style={{ marginTop: 10 }}>
          <Btn onClick={onSkipToManual} variant="secondary" size="lg" full icon={Edit3}>
            Preencher manualmente
          </Btn>
        </div>
      )}

      <p style={{ fontSize: 11, color: theme.textMute, marginTop: 18, textAlign: 'center', lineHeight: 1.6, fontStyle: 'italic' }}>
        A análise é feita com IA. Os teus dados nunca são partilhados com terceiros.
      </p>
    </RegisterShell>
  );
};

// ─── Step 2b: Loading screen during AI analysis ─────────────────────────────
const ExtractingPanel = ({ fileCount }) => {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <RegisterShell>
      <style>{`@keyframes pulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.7; } }`}</style>
      <div style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${theme.accent}1A`, border: `1px solid ${theme.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, animation: 'pulseDot 1.6s ease-in-out infinite' }}>
          <Sparkles size={26} color={theme.accent} />
        </div>
        <div style={{ fontSize: 11, color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>
          A analisar{dots}
        </div>
        <h2 style={{ fontFamily: fontStack, fontSize: 36, margin: 0, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15, maxWidth: 520 }}>
          A IA está a ler {fileCount === 1 ? 'o teu ficheiro' : `os teus ${fileCount} ficheiros`}
        </h2>
        <p style={{ color: theme.textDim, fontSize: 14, lineHeight: 1.7, marginTop: 18, maxWidth: 460 }}>
          Estamos a extrair os teus dados profissionais. Demora cerca de 20-30 segundos. Não feches a página.
        </p>
      </div>
    </RegisterShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SELF-REGISTER FORM (public)
// ─────────────────────────────────────────────────────────────────────────────
const RegisterForm = ({ onSubmit }) => {
  const [step, setStep] = useState('choice'); // choice | upload | extracting | form
  const [data, setData] = useState(EMPTY_FORM_DATA);
  const [autoFilledKeys, setAutoFilledKeys] = useState(new Set());
  const [files, setFiles] = useState([]);
  const [extractError, setExtractError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFilesSubmit = async (selectedFiles) => {
    setFiles(selectedFiles);
    setExtractError('');
    setStep('extracting');
    try {
      const extracted = await extractFromFiles(selectedFiles);
      setData(mapExtractedToFormData(extracted));
      setAutoFilledKeys(buildAutoFilledKeys(extracted));
      setStep('form');
    } catch (err) {
      console.error('Extraction failed:', err);
      const msg = String(err?.message || '').toLowerCase();
      const isBudgetError = msg.includes('credit') || msg.includes('balance') ||
                            msg.includes('rate') || msg.includes('quota') ||
                            msg.includes('429') || msg.includes('overloaded');
      if (isBudgetError) {
        setExtractError('A análise automática está temporariamente indisponível. Podes preencher o formulário manualmente — leva poucos minutos.');
      } else {
        setExtractError(err?.message
          ? `Não conseguimos analisar o ficheiro: ${err.message}. Podes tentar outro ficheiro ou preencher manualmente.`
          : 'Não foi possível analisar o(s) documento(s). Podes tentar outro ficheiro ou preencher manualmente.');
      }
      setStep('upload');
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!data.name || !data.contact.email || !data.contact.phone) {
      setError('Nome, email e telefone são obrigatórios.');
      return;
    }
    setError('');
    const newCandidate = {
      ...data,
      id: generateId(),
      yearsExperience: parseInt(data.yearsExperience) || null,
      expectedSalary: parseInt(data.expectedSalary) || null,
      lastSalary: parseInt(data.lastSalary) || null,
      languages: data.languages.split(',').map(s => s.trim()).filter(Boolean),
      tools: data.tools.split(',').map(s => s.trim()).filter(Boolean),
      keySkills: data.keySkills.split(',').map(s => s.trim()).filter(Boolean),
      brandsWorkedWith: data.brandsWorkedWith.split(',').map(s => s.trim()).filter(Boolean),
      bestFitRole: 'A definir',
      strengths: '', weaknesses: '', recommendedPosition: '',
      interviewNotes: '', personalNotes: '',
      status: 'Em Análise', source: 'self-registered',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    const ok = await onSubmit(newCandidate);
    if (ok) setSubmitted(true);
    else setError('Erro ao guardar. Tenta novamente em alguns segundos.');
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: sansStack, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 40, textAlign: 'center' }}>
        <FontImport />
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${theme.accent}1A`, border: `1px solid ${theme.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Check size={28} color={theme.accent} />
        </div>
        <h1 style={{ fontFamily: fontStack, fontSize: 42, margin: 0, fontWeight: 400, letterSpacing: '-0.02em' }}>Candidatura recebida</h1>
        <p style={{ color: theme.textDim, maxWidth: 480, marginTop: 16, lineHeight: 1.7, fontSize: 15 }}>
          Obrigada, <strong style={{ color: theme.text }}>{data.name.split(' ')[0]}</strong>. O teu perfil foi adicionado à base de talentos da Voxie. Sempre que abrir uma vaga compatível, entraremos em contacto directamente.
        </p>
        <p style={{ color: theme.textMute, fontSize: 11, marginTop: 24, letterSpacing: '0.06em', fontStyle: 'italic' }}>
          Voxie Talent · Concierge Recruitment
        </p>
      </div>
    );
  }

  if (step === 'choice') {
    return <ChoicePanel onUpload={() => setStep('upload')} onManual={() => setStep('form')} />;
  }

  if (step === 'upload') {
    return <UploadPanel onSubmit={handleFilesSubmit} onBack={() => { setExtractError(''); setStep('choice'); }} onSkipToManual={() => { setExtractError(''); setStep('form'); }} externalError={extractError} />;
  }

  if (step === 'extracting') {
    return <ExtractingPanel fileCount={files.length} />;
  }

  // step === 'form'
  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: sansStack }}>
      <FontImport />
      <div style={{ borderBottom: `1px solid ${theme.border}`, padding: '24px 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 32px' }}>
          <Logo size="sm" />
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 32px 80px' }}>
        <button onClick={() => setStep('choice')} style={{ background: 'transparent', border: 'none', color: theme.textDim, cursor: 'pointer', padding: 0, fontSize: 12, fontFamily: sansStack, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          <ArrowLeft size={13} /> Voltar ao início
        </button>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 500 }}>
            {autoFilledKeys.size > 0 ? `Passo 2 de 2 · Revê e completa` : 'Candidatura · Auto-Registo'}
          </div>
          <h1 style={{ fontFamily: fontStack, fontSize: 44, margin: 0, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            {autoFilledKeys.size > 0 ? (
              <>Revê os teus <span style={{ fontStyle: 'italic', color: theme.accent }}>dados</span></>
            ) : (
              <>Junta-te à base de talento <span style={{ fontStyle: 'italic', color: theme.accent }}>Voxie</span></>
            )}
          </h1>
          <p style={{ color: theme.textDim, fontSize: 15, lineHeight: 1.7, marginTop: 18, maxWidth: 580 }}>
            {autoFilledKeys.size > 0 ? (
              <>Os campos marcados com <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: theme.accent, background: `${theme.accent}1A`, border: `1px solid ${theme.accent}40`, padding: '1px 6px', borderRadius: 999, fontWeight: 500, verticalAlign: 'middle' }}><Check size={9} strokeWidth={3} /> auto</span> foram preenchidos pela IA a partir do teu CV. Confirma se estão correctos e completa os obrigatórios em falta (com <span style={{ color: theme.accent }}>*</span>).</>
            ) : (
              <>Preenche o teu perfil. Sempre que abrirmos uma vaga compatível com a tua experiência, entraremos em contacto. Os campos marcados com <span style={{ color: theme.accent }}>*</span> são obrigatórios — os restantes são opcionais.</>
            )}
          </p>
        </div>

        <div>
          <FormSection title="Identificação">
            <Field label="Nome Completo" required autoFilled={autoFilledKeys.has('name')}>
              <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <Field label="Localização" hint="Cidade, País" optional autoFilled={autoFilledKeys.has('location')}>
                <Input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} placeholder="Luanda, Angola" />
              </Field>
              <Field label="Idiomas" hint="Separados por vírgula" optional autoFilled={autoFilledKeys.has('languages')}>
                <Input value={data.languages} onChange={(e) => setData({ ...data, languages: e.target.value })} placeholder="Português (Nativo), Inglês (Intermediário)" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Posição Pretendida">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <Field label="Cargo" required autoFilled={autoFilledKeys.has('roleApplied')}>
                <Select value={data.roleApplied} onChange={(e) => setData({ ...data, roleApplied: e.target.value })}>
                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
              </Field>
              <Field label="Nível" optional autoFilled={autoFilledKeys.has('experienceLevel')}>
                <Select value={data.experienceLevel} onChange={(e) => setData({ ...data, experienceLevel: e.target.value })}>
                  {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </Select>
              </Field>
              <Field label="Anos de Experiência" optional autoFilled={autoFilledKeys.has('yearsExperience')}>
                <Input type="number" value={data.yearsExperience} onChange={(e) => setData({ ...data, yearsExperience: e.target.value })} placeholder="ex: 4" />
              </Field>
            </div>
            <Field label="Modelos de Trabalho Aceitos" hint="Marca todas as opções com que te sentes confortável" optional>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 6 }}>
                {WORK_MODELS.map(m => (
                  <Checkbox key={m} label={m}
                    checked={data.workModels.includes(m)}
                    onChange={() => setData({
                      ...data,
                      workModels: data.workModels.includes(m) ? data.workModels.filter(x => x !== m) : [...data.workModels, m],
                    })} />
                ))}
              </div>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Expectativa Salarial Mínima" hint="Em AKZ, valor mensal bruto. Deixa em branco se preferires não responder." optional autoFilled={autoFilledKeys.has('expectedSalary')}>
                <Input type="number" value={data.expectedSalary} onChange={(e) => setData({ ...data, expectedSalary: e.target.value })} placeholder="ex: 800000" />
              </Field>
              <Field label="Último Salário" hint="Em AKZ, valor mensal bruto" optional>
                <Input type="number" value={data.lastSalary} onChange={(e) => setData({ ...data, lastSalary: e.target.value })} placeholder="ex: 600000" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Experiência & Competências">
            <Field label="Bio Curta" hint="2-4 frases que te descrevem profissionalmente" optional autoFilled={autoFilledKeys.has('bio')}>
              <Textarea value={data.bio} onChange={(e) => setData({ ...data, bio: e.target.value })} rows={4} />
            </Field>
            <Field label="Skills-chave" hint="Separados por vírgula" optional autoFilled={autoFilledKeys.has('keySkills')}>
              <Input value={data.keySkills} onChange={(e) => setData({ ...data, keySkills: e.target.value })} placeholder="Branding, Social Media, Identidade Visual" />
            </Field>
            <Field label="Ferramentas / Software" hint="Separados por vírgula" optional autoFilled={autoFilledKeys.has('tools')}>
              <Input value={data.tools} onChange={(e) => setData({ ...data, tools: e.target.value })} placeholder="Figma, Photoshop, Illustrator, After Effects" />
            </Field>
            <Field label="Marcas / Clientes Anteriores" hint="Separados por vírgula" optional autoFilled={autoFilledKeys.has('brandsWorkedWith')}>
              <Textarea value={data.brandsWorkedWith} onChange={(e) => setData({ ...data, brandsWorkedWith: e.target.value })} rows={3} placeholder="Marca A, Marca B, Marca C..." />
            </Field>
          </FormSection>

          <FormSection title="Contacto">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Email" required autoFilled={autoFilledKeys.has('contact.email')}>
                <Input type="email" value={data.contact.email} onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} required />
              </Field>
              <Field label="Telefone / WhatsApp" required autoFilled={autoFilledKeys.has('contact.phone')}>
                <Input value={data.contact.phone} onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })} placeholder="+244 ..." required />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="LinkedIn" optional autoFilled={autoFilledKeys.has('contact.linkedin')}>
                <Input value={data.contact.linkedin} onChange={(e) => setData({ ...data, contact: { ...data.contact, linkedin: e.target.value } })} />
              </Field>
              <Field label="Instagram / Behance" optional autoFilled={autoFilledKeys.has('contact.instagram')}>
                <Input value={data.contact.instagram} onChange={(e) => setData({ ...data, contact: { ...data.contact, instagram: e.target.value } })} />
              </Field>
            </div>
            <Field label="Link do Portfólio" optional>
              <Input value={data.portfolioLink} onChange={(e) => setData({ ...data, portfolioLink: e.target.value })} placeholder="Behance, Drive, site pessoal..." />
            </Field>
          </FormSection>

          {error && (
            <div style={{ padding: 14, background: '#B5746B1A', border: '1px solid #B5746B40', borderRadius: 6, marginBottom: 18, fontSize: 13, color: '#B5746B' }}>
              <AlertCircle size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              {error}
            </div>
          )}

          <Btn onClick={handleSubmit} variant="primary" size="lg" full icon={ArrowUpRight}>
            Submeter Candidatura
          </Btn>

          <p style={{ fontSize: 11, color: theme.textMute, marginTop: 18, textAlign: 'center', lineHeight: 1.6, fontStyle: 'italic' }}>
            Ao submeter este formulário concordas com a inclusão dos teus dados na base de talentos da Voxie. Contactaremos sempre que houver vaga compatível.
          </p>
        </div>
      </div>
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <div style={{ marginBottom: 36 }}>
    <h3 style={{ fontFamily: fontStack, fontSize: 11, color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${theme.border}` }}>{title}</h3>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SHARE DIALOG — robust clipboard with fallbacks; works even in sandboxed iframes
// ─────────────────────────────────────────────────────────────────────────────
const ShareDialog = ({ url, title, description, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const inputRef = useRef(null);

  // Auto-select the URL on mount so user can copy with Ctrl/Cmd+C even if buttons fail
  useEffect(() => {
    const t = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 80);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = async () => {
    setCopyFailed(false);
    let success = false;

    // Strategy 1: modern Clipboard API (requires secure context + permission)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        success = true;
      } catch (e) { /* fall through */ }
    }

    // Strategy 2: execCommand fallback (works in most iframes)
    if (!success && inputRef.current) {
      try {
        inputRef.current.focus();
        inputRef.current.select();
        inputRef.current.setSelectionRange(0, url.length);
        success = document.execCommand('copy');
      } catch (e) { /* fall through */ }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } else {
      setCopyFailed(true);
      // Keep selection so user can manually Ctrl/Cmd+C
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  };

  const handleOpenPreview = () => {
    try {
      const w = window.open(url, '_blank', 'noopener,noreferrer');
      if (!w) {
        // Popup blocked — navigate current window as fallback
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
  };

  return (
    <div onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.18s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} className="anim-in" style={{
        width: '100%', maxWidth: 500, background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 10, padding: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        fontFamily: sansStack,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${theme.accent}1A`, border: `1px solid ${theme.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2 size={16} color={theme.accent} />
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: theme.textDim, cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <h3 style={{ fontFamily: fontStack, fontSize: 24, color: theme.text, margin: '14px 0 8px', fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.2 }}>{title}</h3>
        <p style={{ color: theme.textDim, fontSize: 13, lineHeight: 1.6, margin: '0 0 22px' }}>{description}</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 10, color: theme.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7, fontFamily: sansStack, fontWeight: 500 }}>
            URL de partilha
          </label>
          <input
            ref={inputRef}
            value={url}
            readOnly
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.target.select()}
            style={{
              width: '100%', padding: '10px 12px', background: theme.bg, color: theme.text,
              border: `1px solid ${copied ? theme.accent : theme.border}`, borderRadius: 4,
              fontSize: 11, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {copyFailed && (
          <div style={{ padding: 12, background: `${theme.accent}14`, border: `1px solid ${theme.accent}40`, borderRadius: 4, marginBottom: 16, fontSize: 12, color: theme.textDim, lineHeight: 1.5 }}>
            <AlertCircle size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: theme.accent }} />
            O browser não permitiu cópia automática. O link já está seleccionado — usa <strong style={{ color: theme.text }}>Ctrl+C</strong> (ou <strong style={{ color: theme.text }}>Cmd+C</strong>) para copiar.
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Btn icon={copied ? Check : Copy} variant="primary" onClick={handleCopy}>
            {copied ? 'Link copiado' : 'Copiar link'}
          </Btn>
          <Btn icon={ExternalLink} variant="secondary" onClick={handleOpenPreview}>
            Pré-visualizar
          </Btn>
          <div style={{ flex: 1 }} />
          <Btn variant="ghost" onClick={onClose}>Fechar</Btn>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = ({ candidates, onAddCandidate, onUpdateCandidate, onDeleteCandidate, onLogout }) => {
  const [filters, setFilters] = useState({ search: '', role: 'all', level: 'all', workModel: 'all', status: 'all', maxSalary: '' });
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [shareLinkOpen, setShareLinkOpen] = useState(false);

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = [c.name, c.bestFitRole, c.roleApplied, ...(c.keySkills || []), ...(c.brandsWorkedWith || []), ...(c.tools || [])].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.role !== 'all' && c.bestFitRole !== filters.role && c.roleApplied !== filters.role) return false;
      if (filters.level !== 'all' && c.experienceLevel !== filters.level) return false;
      if (filters.workModel !== 'all' && !c.workModels?.includes(filters.workModel)) return false;
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      if (filters.maxSalary && c.expectedSalary && c.expectedSalary > parseInt(filters.maxSalary)) return false;
      return true;
    });
  }, [candidates, filters]);

  const resetFilters = () => setFilters({ search: '', role: 'all', level: 'all', workModel: 'all', status: 'all', maxSalary: '' });

  const registerUrl = `${window.location.origin}${window.location.pathname}#register`;

  const stats = useMemo(() => ({
    total: candidates.length,
    approved: candidates.filter(c => c.status === 'Aprovado').length,
    pending: candidates.filter(c => c.status === 'Em Análise').length,
    selfRegistered: candidates.filter(c => c.source === 'self-registered').length,
  }), [candidates]);

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: sansStack }}>
      <FontImport />

      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${theme.border}`, background: theme.bg, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <Logo />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Btn icon={Link2} variant="secondary" size="sm" onClick={() => setShareLinkOpen(true)}>
              Link de Auto-Registo
            </Btn>
            <Btn icon={Plus} variant="primary" size="sm" onClick={() => setShowAdd(true)}>
              Adicionar Candidato
            </Btn>
            <Btn icon={Lock} variant="ghost" size="sm" onClick={onLogout}>Bloquear</Btn>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: theme.accent, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 500 }}>
            Base de Talento · Vista Admin
          </div>
          <h1 style={{ fontFamily: fontStack, fontSize: 44, color: theme.text, margin: 0, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Talento <span style={{ fontStyle: 'italic', color: theme.accent }}>curado</span>, sempre disponível.
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard icon={Users} label="Total" value={stats.total} />
          <StatCard icon={Check} label="Aprovados" value={stats.approved} accent />
          <StatCard icon={Clock} label="Em Análise" value={stats.pending} />
          <StatCard icon={Sparkles} label="Auto-registos" value={stats.selfRegistered} />
        </div>

        {/* Filter */}
        <div style={{ marginBottom: 24 }}>
          <FilterBar filters={filters} setFilters={setFilters} onReset={resetFilters} candidates={filtered} />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ padding: 80, textAlign: 'center', background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
            <Filter size={32} color={theme.textMute} style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: fontStack, fontSize: 22, color: theme.text, margin: 0, fontWeight: 400 }}>Sem resultados</h3>
            <p style={{ color: theme.textDim, marginTop: 8, fontSize: 14 }}>Ajusta os filtros ou limpa-os para ver todos os candidatos.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(c => (
              <CandidateCard key={c.id} candidate={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${theme.border}`, fontSize: 10, color: theme.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center' }}>
          Voxie Talent · Concierge Recruitment · v1.1
        </div>
      </div>

      {selected && (
        <CandidateDetail
          candidate={selected}
          onClose={() => setSelected(null)}
          onSave={(updated) => { onUpdateCandidate(updated); setSelected(updated); }}
          onDelete={(id) => { onDeleteCandidate(id); setSelected(null); }}
        />
      )}

      {showAdd && (
        <CandidateDetail
          candidate={{
            id: generateId(), name: '', roleApplied: ROLE_OPTIONS[0], bestFitRole: 'A definir',
            experienceLevel: 'Mid', yearsExperience: null, workModels: [], expectedSalary: null, lastSalary: null,
            location: '', languages: [], tools: [], keySkills: [], brandsWorkedWith: [],
            bio: '', strengths: '', weaknesses: '', recommendedPosition: '',
            status: 'Em Análise', interviewNotes: '', personalNotes: '',
            contact: { email: '', phone: '', linkedin: '', instagram: '', other: '' },
            portfolioLink: '', cvLink: '', source: 'admin',
            createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10),
          }}
          onClose={() => setShowAdd(false)}
          onSave={(c) => { onAddCandidate(c); setShowAdd(false); }}
          onDelete={() => setShowAdd(false)}
        />
      )}

      {shareLinkOpen && (
        <ShareDialog
          url={registerUrl}
          title="Link de Auto-Registo"
          description="Partilha este link com candidatos para que se inscrevam directamente na base de talento. As candidaturas aparecem aqui marcadas como 'Auto-registo' e ficam em estado 'Em Análise'."
          onClose={() => setShareLinkOpen(false)}
        />
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 22, position: 'relative' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <Icon size={16} color={accent ? theme.accent : theme.textDim} />
    </div>
    <div style={{ fontFamily: fontStack, fontSize: 36, color: accent ? theme.accent : theme.text, fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ fontSize: 10, color: theme.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 8, fontFamily: sansStack, fontWeight: 500 }}>{label}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [view, setView] = useState('admin');
  const [profileId, setProfileId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Parse URL hash for routing
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#profile/')) {
        setProfileId(hash.replace('#profile/', ''));
        setView('public');
      } else if (hash === '#register') {
        setView('register');
      } else {
        setView('admin');
        setProfileId(null);
      }
    };
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Load data
  useEffect(() => {
    loadCandidates()
      .then(c => {
        setCandidates(c);
        setLoadError('');
      })
      .catch(err => {
        console.error('Initial load failed:', err);
        setLoadError('Não foi possível ligar à base de dados. Verifica a tua ligação e recarrega a página.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (newCandidate) => {
    const ok = await dbInsertCandidate(newCandidate);
    if (ok) setCandidates(prev => [...prev, newCandidate]);
    else alert('Não foi possível guardar. Verifica a tua ligação e tenta novamente.');
    return ok;
  };

  const handleUpdate = async (candidate) => {
    const ok = await dbUpdateCandidate(candidate);
    if (ok) setCandidates(prev => prev.map(c => c.id === candidate.id ? candidate : c));
    else alert('Não foi possível guardar as alterações. Verifica a tua ligação e tenta novamente.');
    return ok;
  };

  const handleDelete = async (id) => {
    const ok = await dbDeleteCandidate(id);
    if (ok) setCandidates(prev => prev.filter(c => c.id !== id));
    else alert('Não foi possível eliminar. Verifica a tua ligação e tenta novamente.');
    return ok;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.textDim, fontFamily: sansStack, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        <FontImport />
        Carregando talento...
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: sansStack, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 40, textAlign: 'center' }}>
        <FontImport />
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#B5746B1A', border: '1px solid #B5746B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <AlertCircle size={28} color="#B5746B" />
        </div>
        <h1 style={{ fontFamily: fontStack, fontSize: 32, margin: 0, fontWeight: 400, letterSpacing: '-0.02em' }}>Erro de Ligação</h1>
        <p style={{ color: theme.textDim, maxWidth: 460, marginTop: 14, lineHeight: 1.7, fontSize: 14 }}>{loadError}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: 24, background: theme.accent, border: 'none', color: theme.bg, padding: '10px 22px', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: sansStack, fontWeight: 500 }}>
          Recarregar
        </button>
      </div>
    );
  }

  // Public profile view (no auth needed)
  if (view === 'public') {
    const candidate = candidates.find(c => c.id === profileId);
    return <PublicProfile candidate={candidate} />;
  }

  // Self-register view (no auth needed)
  if (view === 'register') {
    return <RegisterForm onSubmit={handleAdd} />;
  }

  // Admin view — requires auth
  if (!authenticated) {
    return <AuthGate onAuth={() => setAuthenticated(true)} />;
  }

  return (
    <AdminDashboard
      candidates={candidates}
      onAddCandidate={handleAdd}
      onUpdateCandidate={handleUpdate}
      onDeleteCandidate={handleDelete}
      onLogout={() => setAuthenticated(false)}
    />
  );
}
