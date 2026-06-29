-- ==========================================================
-- MINNA BRASIL - Seed de histórico inicial do chat
-- Execute no Supabase SQL Editor
-- ==========================================================

-- Usuários fake no auth.users para satisfazer FK de profiles.id
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'japagirl@seed.minna', '', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000002', 'sasake@seed.minna', '', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000003', 'nishio@seed.minna', '', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000004', 'vaijapao@seed.minna', '', NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000005', 'aquiehbrasil@seed.minna', '', NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000006', 'tokyobr@seed.minna', '', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000007', 'yukibr@seed.minna', '', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000008', 'nagoyano@seed.minna', '', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000009', 'sakurabr@seed.minna', '', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated'),
  ('10000000-0000-0000-0000-000000000010', 'dekasegiroots@seed.minna', '', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days', '{"provider":"seed","providers":["seed"]}', '{}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Perfis fake
INSERT INTO profiles (id, nickname, avatar_url, created_at, message_count, reaction_count, reputation, is_banned, is_muted, is_admin)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'japagirl', 'https://api.dicebear.com/7.x/lorelei/svg?seed=sakura-girl&backgroundColor=ffb6c1', NOW() - INTERVAL '20 days', 0, 0, 12, false, false, false),
  ('10000000-0000-0000-0000-000000000002', 'Sasake', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=samurai-sasake&backgroundColor=3498db', NOW() - INTERVAL '19 days', 0, 0, 8, false, false, false),
  ('10000000-0000-0000-0000-000000000003', 'Nishio', 'https://api.dicebear.com/7.x/bottts/svg?seed=nishio-osaka&backgroundColor=f39c12', NOW() - INTERVAL '18 days', 0, 0, 10, false, false, false),
  ('10000000-0000-0000-0000-000000000004', 'vai Japao', 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=vai-japao&backgroundColor=2ecc71', NOW() - INTERVAL '17 days', 0, 0, 6, false, false, false),
  ('10000000-0000-0000-0000-000000000005', 'aqui eh Brasil', 'https://api.dicebear.com/7.x/avataaars/svg?seed=aqui-eh-brasil&backgroundColor=e74c3c', NOW() - INTERVAL '16 days', 0, 0, 14, false, false, false),
  ('10000000-0000-0000-0000-000000000006', 'TokyoBR', 'https://api.dicebear.com/7.x/lorelei/svg?seed=tokyo-br&backgroundColor=9b59b6', NOW() - INTERVAL '15 days', 0, 0, 9, false, false, false),
  ('10000000-0000-0000-0000-000000000007', 'YukiBR', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=yuki-br&backgroundColor=00bcd4', NOW() - INTERVAL '14 days', 0, 0, 7, false, false, false),
  ('10000000-0000-0000-0000-000000000008', 'Nagoyano', 'https://api.dicebear.com/7.x/bottts/svg?seed=nagoyano&backgroundColor=ff9800', NOW() - INTERVAL '13 days', 0, 0, 11, false, false, false),
  ('10000000-0000-0000-0000-000000000009', 'SakuraBR', 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=sakura-br&backgroundColor=e91e63', NOW() - INTERVAL '12 days', 0, 0, 13, false, false, false),
  ('10000000-0000-0000-0000-000000000010', 'dekasegiRoots', 'https://api.dicebear.com/7.x/avataaars/svg?seed=dekasegi-roots&backgroundColor=795548', NOW() - INTERVAL '11 days', 0, 0, 15, false, false, false)
ON CONFLICT (id) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  avatar_url = EXCLUDED.avatar_url,
  is_banned = false,
  is_muted = false;

-- Limpa mensagens seed antigas para evitar duplicar ao rodar de novo
DELETE FROM messages WHERE user_id IN (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000005',
  '10000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000007',
  '10000000-0000-0000-0000-000000000008',
  '10000000-0000-0000-0000-000000000009',
  '10000000-0000-0000-0000-000000000010'
);

-- Histórico de conversa natural com replies, mentions e IDs fixos
INSERT INTO messages (id, user_id, content, mentions, reply_to_id, created_at, is_deleted)
VALUES
  ('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'oi gente, cheguei agora no grupo 😊 tem bastante brasileiro por aqui?', '{}', NULL, NOW() - INTERVAL '4 hours 10 minutes', false),
  ('a0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 'tem sim kkk bem-vinda. aqui sempre aparece alguém do Japão perdido no horário diferente', '{}', NULL, NOW() - INTERVAL '4 hours 8 minutes', false),
  ('a0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'bem-vinda @japagirl. vc tá em qual região?', ARRAY['japagirl'], 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 hours 6 minutes', false),
  ('a0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'tô em Saitama faz pouco tempo, ainda me acostumando com trem e supermercado 😅', '{}', 'a0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '4 hours 4 minutes', false),
  ('a0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000008', 'Saitama é tranquilo. eu moro em Nagoya, mas já passei uns meses aí. mercado no começo é uma novela mesmo', '{}', 'a0000000-0000-0000-0000-000000000004', NOW() - INTERVAL '4 hours 2 minutes', false),
  ('a0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'desde quando vocês estão no Japão? eu cheguei em 2022 e parece que foi ontem', '{}', NULL, NOW() - INTERVAL '4 hours', false),
  ('a0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 'eu tô aqui desde 2018. vim achando que ficava 1 ano e já vai fazer 6 kkk', '{}', 'a0000000-0000-0000-0000-000000000006', NOW() - INTERVAL '3 hours 58 minutes', false),
  ('a0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000006', '2019 aqui. peguei pandemia logo depois, então meu começo foi meio estranho', '{}', 'a0000000-0000-0000-0000-000000000006', NOW() - INTERVAL '3 hours 56 minutes', false),
  ('a0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', 'eu cheguei ano passado. ainda tenho fase de amar tudo e fase de querer pão francês do Brasil', '{}', 'a0000000-0000-0000-0000-000000000006', NOW() - INTERVAL '3 hours 54 minutes', false),
  ('a0000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000005', 'pão francês é gatilho kkkkk mas combini salva demais', '{}', 'a0000000-0000-0000-0000-000000000009', NOW() - INTERVAL '3 hours 52 minutes', false),
  ('a0000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000010', 'e vocês gostam daqui de verdade? sem romantizar', '{}', NULL, NOW() - INTERVAL '3 hours 50 minutes', false),
  ('a0000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', 'gosto da segurança e organização. mas sinto falta de conversar aleatório na rua igual no Brasil', '{}', 'a0000000-0000-0000-0000-000000000011', NOW() - INTERVAL '3 hours 48 minutes', false),
  ('a0000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', 'eu gosto do silêncio, mas às vezes parece silêncio demais. ainda tô tentando fazer amizade', '{}', 'a0000000-0000-0000-0000-000000000011', NOW() - INTERVAL '3 hours 46 minutes', false),
  ('a0000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000006', 'amizade aqui demora, mas quando acha brasileiro gente boa ajuda muito. por isso grupo assim é bom', '{}', 'a0000000-0000-0000-0000-000000000013', NOW() - INTERVAL '3 hours 44 minutes', false),
  ('a0000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000008', 'real. minha primeira dica pra quem chega é: não fica sozinho tentando resolver tudo no Google tradutor', '{}', 'a0000000-0000-0000-0000-000000000013', NOW() - INTERVAL '3 hours 42 minutes', false),
  ('a0000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000004', 'trabalham com o que? eu tô em fábrica de autopeças em Aichi', '{}', NULL, NOW() - INTERVAL '3 hours 40 minutes', false),
  ('a0000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000003', 'logística, separação de mercadoria. cansativo mas o pessoal é tranquilo', '{}', 'a0000000-0000-0000-0000-000000000016', NOW() - INTERVAL '3 hours 38 minutes', false),
  ('a0000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000009', 'eu tô em hotel, limpeza de quartos. japonês no começo me deu medo, mas dá pra ir pegando', '{}', 'a0000000-0000-0000-0000-000000000016', NOW() - INTERVAL '3 hours 36 minutes', false),
  ('a0000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000001', 'eu comecei em bentoya, acordo cedo mas pelo menos aprendo nome das comidas kkk', '{}', 'a0000000-0000-0000-0000-000000000016', NOW() - INTERVAL '3 hours 34 minutes', false),
  ('a0000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000005', 'bentoya é escola de sobrevivência 😂 depois disso vc entende metade do mercado', '{}', 'a0000000-0000-0000-0000-000000000019', NOW() - INTERVAL '3 hours 32 minutes', false),
  ('a0000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000010', 'alguém aqui já visitou Kyoto? tô querendo ir no outono', '{}', NULL, NOW() - INTERVAL '3 hours 30 minutes', false),
  ('a0000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000006', 'Kyoto no outono é absurdo de bonito, mas lota muito. vai cedo nos templos', '{}', 'a0000000-0000-0000-0000-000000000021', NOW() - INTERVAL '3 hours 28 minutes', false),
  ('a0000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000002', 'Fushimi Inari de manhãzinha vale demais. de tarde parece fila de evento', '{}', 'a0000000-0000-0000-0000-000000000021', NOW() - INTERVAL '3 hours 26 minutes', false),
  ('a0000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000008', 'se for Kyoto, tenta encaixar Nara também. os cervos são folgados mas é legal kkk', '{}', 'a0000000-0000-0000-0000-000000000021', NOW() - INTERVAL '3 hours 24 minutes', false),
  ('a0000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000004', 'eu só fui Osaka e Tokyo até agora. Tokyo me deixou cansado só de trocar de linha', '{}', 'a0000000-0000-0000-0000-000000000021', NOW() - INTERVAL '3 hours 22 minutes', false),
  ('a0000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000001', 'Tokyo é lindo mas eu me sinto um npc andando no meio da multidão', '{}', 'a0000000-0000-0000-0000-000000000025', NOW() - INTERVAL '3 hours 20 minutes', false),
  ('a0000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000009', 'kkkkk sim. Shibuya é legal 30 minutos, depois quero um mato', '{}', 'a0000000-0000-0000-0000-000000000025', NOW() - INTERVAL '3 hours 18 minutes', false),
  ('a0000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000003', 'pra mato eu gostei de Hakone. vista do Fuji quando o tempo ajuda é coisa de filme', '{}', 'a0000000-0000-0000-0000-000000000027', NOW() - INTERVAL '3 hours 16 minutes', false),
  ('a0000000-0000-0000-0000-000000000029', '10000000-0000-0000-0000-000000000010', 'Fuji ainda não vi de perto. sempre que planejo chove', '{}', 'a0000000-0000-0000-0000-000000000028', NOW() - INTERVAL '3 hours 14 minutes', false),
  ('a0000000-0000-0000-0000-000000000030', '10000000-0000-0000-0000-000000000005', 'o Fuji é tímido kkk tem que olhar previsão e mesmo assim confiar na sorte', '{}', 'a0000000-0000-0000-0000-000000000029', NOW() - INTERVAL '3 hours 12 minutes', false),
  ('a0000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000004', 'vocês estudam japonês por app ou escola?', '{}', NULL, NOW() - INTERVAL '3 hours 10 minutes', false),
  ('a0000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000006', 'eu faço aula uma vez por semana no centro comunitário. barato e ajuda a destravar', '{}', 'a0000000-0000-0000-0000-000000000031', NOW() - INTERVAL '3 hours 8 minutes', false),
  ('a0000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000008', 'app ajuda vocabulário, mas conversa mesmo só passando vergonha no konbini kkkkk', '{}', 'a0000000-0000-0000-0000-000000000031', NOW() - INTERVAL '3 hours 6 minutes', false),
  ('a0000000-0000-0000-0000-000000000034', '10000000-0000-0000-0000-000000000001', 'eu falei “arigatou gozaimashita” pra máquina automática outro dia. evolução vindo aí', '{}', 'a0000000-0000-0000-0000-000000000031', NOW() - INTERVAL '3 hours 4 minutes', false),
  ('a0000000-0000-0000-0000-000000000035', '10000000-0000-0000-0000-000000000002', 'normal, eu já pedi desculpa pra porta do trem', '{}', 'a0000000-0000-0000-0000-000000000034', NOW() - INTERVAL '3 hours 2 minutes', false),
  ('a0000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000009', 'isso é integração cultural nível avançado', '{}', 'a0000000-0000-0000-0000-000000000035', NOW() - INTERVAL '3 hours', false);

INSERT INTO messages (id, user_id, content, mentions, reply_to_id, created_at, is_deleted)
VALUES
  ('a0000000-0000-0000-0000-000000000037', '10000000-0000-0000-0000-000000000010', 'uma coisa que gosto daqui: dá pra andar tarde sem ficar olhando pra trás toda hora', '{}', NULL, NOW() - INTERVAL '2 hours 58 minutes', false),
  ('a0000000-0000-0000-0000-000000000038', '10000000-0000-0000-0000-000000000005', 'sim, segurança muda a cabeça. mas saudade de churrasco de domingo não passa', '{}', 'a0000000-0000-0000-0000-000000000037', NOW() - INTERVAL '2 hours 56 minutes', false),
  ('a0000000-0000-0000-0000-000000000039', '10000000-0000-0000-0000-000000000003', 'em Hamamatsu tem mercado brasileiro bom. quando bate saudade eu vou lá gastar dinheiro', '{}', 'a0000000-0000-0000-0000-000000000038', NOW() - INTERVAL '2 hours 54 minutes', false),
  ('a0000000-0000-0000-0000-000000000040', '10000000-0000-0000-0000-000000000004', 'coxinha congelada salva vidas', '{}', 'a0000000-0000-0000-0000-000000000039', NOW() - INTERVAL '2 hours 52 minutes', false),
  ('a0000000-0000-0000-0000-000000000041', '10000000-0000-0000-0000-000000000001', 'qual cidade vocês recomendam pra primeiro passeio curto?', '{}', NULL, NOW() - INTERVAL '2 hours 50 minutes', false),
  ('a0000000-0000-0000-0000-000000000042', '10000000-0000-0000-0000-000000000006', 'se estiver em Saitama, faz Kawagoe. perto, bonito, clima antigo, dá pra ir sem gastar tanto', '{}', 'a0000000-0000-0000-0000-000000000041', NOW() - INTERVAL '2 hours 48 minutes', false),
  ('a0000000-0000-0000-0000-000000000043', '10000000-0000-0000-0000-000000000008', 'Kamakura também é ótima. praia, templos, bate-volta tranquilo de Tokyo', '{}', 'a0000000-0000-0000-0000-000000000041', NOW() - INTERVAL '2 hours 46 minutes', false),
  ('a0000000-0000-0000-0000-000000000044', '10000000-0000-0000-0000-000000000002', 'eu voto em Yokohama. de noite é muito bonito e não é tão caos quanto Tokyo', '{}', 'a0000000-0000-0000-0000-000000000041', NOW() - INTERVAL '2 hours 44 minutes', false),
  ('a0000000-0000-0000-0000-000000000045', '10000000-0000-0000-0000-000000000009', 'Yokohama me ganhou pelo passeio perto do mar. e Chinatown pra comer bem', '{}', 'a0000000-0000-0000-0000-000000000044', NOW() - INTERVAL '2 hours 42 minutes', false),
  ('a0000000-0000-0000-0000-000000000046', '10000000-0000-0000-0000-000000000010', 'o difícil é folga bater com clima bom, né', '{}', 'a0000000-0000-0000-0000-000000000041', NOW() - INTERVAL '2 hours 40 minutes', false),
  ('a0000000-0000-0000-0000-000000000047', '10000000-0000-0000-0000-000000000005', 'lei do Japão: folga = chuva. dia de trabalho = céu azul perfeito', '{}', 'a0000000-0000-0000-0000-000000000046', NOW() - INTERVAL '2 hours 38 minutes', false),
  ('a0000000-0000-0000-0000-000000000048', '10000000-0000-0000-0000-000000000004', 'kkkk exatamente. e quando tem hanami, venta tudo antes do domingo', '{}', 'a0000000-0000-0000-0000-000000000047', NOW() - INTERVAL '2 hours 36 minutes', false),
  ('a0000000-0000-0000-0000-000000000049', '10000000-0000-0000-0000-000000000001', 'hanami eu quero muito ver. no Brasil eu só via em foto', '{}', 'a0000000-0000-0000-0000-000000000048', NOW() - INTERVAL '2 hours 34 minutes', false),
  ('a0000000-0000-0000-0000-000000000050', '10000000-0000-0000-0000-000000000003', 'quando sakura começa, vai no primeiro dia livre. não deixa pra depois', '{}', 'a0000000-0000-0000-0000-000000000049', NOW() - INTERVAL '2 hours 32 minutes', false),
  ('a0000000-0000-0000-0000-000000000051', '10000000-0000-0000-0000-000000000006', 'e leva comida. sentar no parque com onigiri parece cena simples mas fica na memória', '{}', 'a0000000-0000-0000-0000-000000000050', NOW() - INTERVAL '2 hours 30 minutes', false),
  ('a0000000-0000-0000-0000-000000000052', '10000000-0000-0000-0000-000000000008', 'vocês pretendem ficar muito tempo aqui ou voltar pro Brasil?', '{}', NULL, NOW() - INTERVAL '2 hours 28 minutes', false),
  ('a0000000-0000-0000-0000-000000000053', '10000000-0000-0000-0000-000000000002', 'eu penso em ficar mais uns anos, juntar dinheiro e decidir. mas planos mudam muito aqui', '{}', 'a0000000-0000-0000-0000-000000000052', NOW() - INTERVAL '2 hours 26 minutes', false),
  ('a0000000-0000-0000-0000-000000000054', '10000000-0000-0000-0000-000000000009', 'eu queria voltar, mas depois que acostuma com segurança e transporte fica complicado', '{}', 'a0000000-0000-0000-0000-000000000052', NOW() - INTERVAL '2 hours 24 minutes', false),
  ('a0000000-0000-0000-0000-000000000055', '10000000-0000-0000-0000-000000000005', 'meu coração é Brasil, minha rotina virou Japão. resumo da confusão', '{}', 'a0000000-0000-0000-0000-000000000052', NOW() - INTERVAL '2 hours 22 minutes', false),
  ('a0000000-0000-0000-0000-000000000056', '10000000-0000-0000-0000-000000000010', 'frase perfeita kkk', '{}', 'a0000000-0000-0000-0000-000000000055', NOW() - INTERVAL '2 hours 20 minutes', false),
  ('a0000000-0000-0000-0000-000000000057', '10000000-0000-0000-0000-000000000001', 'gostei daqui, parece que dá pra perguntar coisa sem julgamento', '{}', NULL, NOW() - INTERVAL '2 hours 18 minutes', false),
  ('a0000000-0000-0000-0000-000000000058', '10000000-0000-0000-0000-000000000004', 'é essa a ideia. todo mundo já passou vergonha no começo, então ninguém tem moral pra julgar kkk', '{}', 'a0000000-0000-0000-0000-000000000057', NOW() - INTERVAL '2 hours 16 minutes', false),
  ('a0000000-0000-0000-0000-000000000059', '10000000-0000-0000-0000-000000000006', 'pergunta mesmo. banco, contrato, lixo, trem, hospital... sempre tem alguém que já sofreu antes', '{}', 'a0000000-0000-0000-0000-000000000057', NOW() - INTERVAL '2 hours 14 minutes', false),
  ('a0000000-0000-0000-0000-000000000060', '10000000-0000-0000-0000-000000000003', 'inclusive lixo é boss final do Japão', '{}', 'a0000000-0000-0000-0000-000000000059', NOW() - INTERVAL '2 hours 12 minutes', false),
  ('a0000000-0000-0000-0000-000000000061', '10000000-0000-0000-0000-000000000008', 'separar PET, tampa, rótulo, dia certo... parece prova do ENEM', '{}', 'a0000000-0000-0000-0000-000000000060', NOW() - INTERVAL '2 hours 10 minutes', false),
  ('a0000000-0000-0000-0000-000000000062', '10000000-0000-0000-0000-000000000009', 'eu guardava papelão como se fosse investimento pq nunca acertava o dia', '{}', 'a0000000-0000-0000-0000-000000000061', NOW() - INTERVAL '2 hours 8 minutes', false),
  ('a0000000-0000-0000-0000-000000000063', '10000000-0000-0000-0000-000000000005', 'kkkkkk todo brasileiro no Japão tem uma pilha de papelão traumática', '{}', 'a0000000-0000-0000-0000-000000000062', NOW() - INTERVAL '2 hours 6 minutes', false),
  ('a0000000-0000-0000-0000-000000000064', '10000000-0000-0000-0000-000000000001', 'já me senti representada. obrigada pelas dicas, gente', '{}', 'a0000000-0000-0000-0000-000000000063', NOW() - INTERVAL '2 hours 4 minutes', false),
  ('a0000000-0000-0000-0000-000000000065', '10000000-0000-0000-0000-000000000002', 'tamo junto. quando for fazer primeiro passeio manda foto depois @japagirl', ARRAY['japagirl'], 'a0000000-0000-0000-0000-000000000064', NOW() - INTERVAL '2 hours 2 minutes', false),
  ('a0000000-0000-0000-0000-000000000066', '10000000-0000-0000-0000-000000000010', 'e se descobrir pão francês bom em Saitama avisa o grupo inteiro', '{}', NULL, NOW() - INTERVAL '2 hours', false),
  ('a0000000-0000-0000-0000-000000000067', '10000000-0000-0000-0000-000000000001', 'combinado kkk missão oficial: achar pão francês no Japão', '{}', 'a0000000-0000-0000-0000-000000000066', NOW() - INTERVAL '1 hour 58 minutes', false),
  ('a0000000-0000-0000-0000-000000000068', '10000000-0000-0000-0000-000000000004', 'esse grupo já começou com objetivo nobre', '{}', 'a0000000-0000-0000-0000-000000000066', NOW() - INTERVAL '1 hour 56 minutes', false),
  ('a0000000-0000-0000-0000-000000000069', '10000000-0000-0000-0000-000000000006', 'bem-vinda ao Japão real: trem no horário, lixo complicado e saudade de padaria', '{}', 'a0000000-0000-0000-0000-000000000067', NOW() - INTERVAL '1 hour 54 minutes', false),
  ('a0000000-0000-0000-0000-000000000070', '10000000-0000-0000-0000-000000000005', 'e brasileiro salvando brasileiro no chat, que é o principal', '{}', 'a0000000-0000-0000-0000-000000000069', NOW() - INTERVAL '1 hour 52 minutes', false),
  ('a0000000-0000-0000-0000-000000000071', '10000000-0000-0000-0000-000000000007', 'gente, tô chegando agora. @aqui eh Brasil vc tá em qual cidade?', ARRAY['aqui eh Brasil'], NULL, NOW() - INTERVAL '1 hour 50 minutes', false),
  ('a0000000-0000-0000-0000-000000000072', '10000000-0000-0000-0000-000000000005', 'tô em Shizuoka. perto do mar e das montanhas, bem de boa', '{}', 'a0000000-0000-0000-0000-000000000071', NOW() - INTERVAL '1 hour 48 minutes', false);

INSERT INTO messages (id, user_id, content, mentions, reply_to_id, created_at, is_deleted)
VALUES
  ('a0000000-0000-0000-0000-000000000073', '10000000-0000-0000-0000-000000000007', 'que legal. eu tô em Gunma, meio no interior. paisagem bonita mas trem demora', '{}', 'a0000000-0000-0000-0000-000000000072', NOW() - INTERVAL '1 hour 46 minutes', false),
  ('a0000000-0000-0000-0000-000000000074', '10000000-0000-0000-0000-000000000008', 'interior do Japão é outro ritmo. eu gosto, mas conveniência longe dá raiva', '{}', 'a0000000-0000-0000-0000-000000000073', NOW() - INTERVAL '1 hour 44 minutes', false),
  ('a0000000-0000-0000-0000-000000000075', '10000000-0000-0000-0000-000000000003', 'alguém já teve problema com hospital aqui? a burocracia me assusta', '{}', NULL, NOW() - INTERVAL '1 hour 42 minutes', false),
  ('a0000000-0000-0000-0000-000000000076', '10000000-0000-0000-0000-000000000006', 'eu já fui uma vez com dor de barriga. apresenta o cartão do seguro e eles já direcionam. foi tranquilo', '{}', 'a0000000-0000-0000-0000-000000000075', NOW() - INTERVAL '1 hour 40 minutes', false),
  ('a0000000-0000-0000-0000-000000000077', '10000000-0000-0000-0000-000000000009', 'eu tive febre e fui de ambulância. não paguei nada na hora, recebi conta depois', '{}', 'a0000000-0000-0000-0000-000000000075', NOW() - INTERVAL '1 hour 38 minutes', false),
  ('a0000000-0000-0000-0000-000000000078', '10000000-0000-0000-0000-000000000004', 'dica: leva sempre o cartão do seguro social. sem ele vira novela', '{}', 'a0000000-0000-0000-0000-000000000077', NOW() - INTERVAL '1 hour 36 minutes', false),
  ('a0000000-0000-0000-0000-000000000079', '10000000-0000-0000-0000-000000000010', 'eu ainda não precisei, mas já anotei o hospital 24h daqui', '{}', 'a0000000-0000-0000-0000-000000000075', NOW() - INTERVAL '1 hour 34 minutes', false),
  ('a0000000-0000-0000-0000-000000000080', '10000000-0000-0000-0000-000000000001', 'boa lembrança. preciso fazer isso também, ainda não sei onde fica o hospital perto de casa', '{}', 'a0000000-0000-0000-0000-000000000079', NOW() - INTERVAL '1 hour 32 minutes', false),
  ('a0000000-0000-0000-0000-000000000081', '10000000-0000-0000-0000-000000000002', 'quando muda de cidade, primeiro dia eu já procuro hospital, conbini e lavanderia. prioridades', '{}', 'a0000000-0000-0000-0000-000000000080', NOW() - INTERVAL '1 hour 30 minutes', false),
  ('a0000000-0000-0000-0000-000000000082', '10000000-0000-0000-0000-000000000005', 'lavanderia kkkk essencial. no início eu lavava na mão igual estudante pobre', '{}', 'a0000000-0000-0000-0000-000000000081', NOW() - INTERVAL '1 hour 28 minutes', false),
  ('a0000000-0000-0000-0000-000000000083', '10000000-0000-0000-0000-000000000003', 'pior que eu já usei banheira como tanque de lavar roupa. fase difícil kkk', '{}', 'a0000000-0000-0000-0000-000000000082', NOW() - INTERVAL '1 hour 26 minutes', false),
  ('a0000000-0000-0000-0000-000000000084', '10000000-0000-0000-0000-000000000007', 'já tive que secar roupa no ar condicionado de inverno. funciona mais ou menos', '{}', 'a0000000-0000-0000-0000-000000000083', NOW() - INTERVAL '1 hour 24 minutes', false),
  ('a0000000-0000-0000-0000-000000000085', '10000000-0000-0000-0000-000000000009', 'e o verão? minha roupa não seca nunca, fica com cheiro', '{}', NULL, NOW() - INTERVAL '1 hour 22 minutes', false),
  ('a0000000-0000-0000-0000-000000000086', '10000000-0000-0000-0000-000000000006', 'secador de roupa salva no verão. ou lavanderia com secadora, mas sai caro', '{}', 'a0000000-0000-0000-0000-000000000085', NOW() - INTERVAL '1 hour 20 minutes', false),
  ('a0000000-0000-0000-0000-000000000087', '10000000-0000-0000-0000-000000000008', 'no verão eu lavo de noite e deixo o ventilador ligado em cima. vai na fé', '{}', 'a0000000-0000-0000-0000-000000000085', NOW() - INTERVAL '1 hour 18 minutes', false),
  ('a0000000-0000-0000-0000-000000000088', '10000000-0000-0000-0000-000000000001', 'vcs usam aquele desumidificador? tô pensando em comprar', '{}', 'a0000000-0000-0000-0000-000000000087', NOW() - INTERVAL '1 hour 16 minutes', false),
  ('a0000000-0000-0000-0000-000000000089', '10000000-0000-0000-0000-000000000005', 'uso. tira o cheiro de mofo e ajuda roupa a secar. recomendo', '{}', 'a0000000-0000-0000-0000-000000000088', NOW() - INTERVAL '1 hour 14 minutes', false),
  ('a0000000-0000-0000-0000-000000000090', '10000000-0000-0000-0000-000000000004', 'e no inverno? roupas pesadas demoram uma eternidade', '{}', 'a0000000-0000-0000-0000-000000000088', NOW() - INTERVAL '1 hour 12 minutes', false),
  ('a0000000-0000-0000-0000-000000000091', '10000000-0000-0000-0000-000000000002', 'inverno eu lavo menos vezes e uso mais camada. fica tudo escondido sob casaco kkk', '{}', 'a0000000-0000-0000-0000-000000000090', NOW() - INTERVAL '1 hour 10 minutes', false),
  ('a0000000-0000-0000-0000-000000000092', '10000000-0000-0000-0000-000000000010', 'vcs têm dica de onde comprar comida brasileira online?', '{}', NULL, NOW() - INTERVAL '1 hour 8 minutes', false),
  ('a0000000-0000-0000-0000-000000000093', '10000000-0000-0000-0000-000000000003', 'eu compro num site que entrega em Tokyo e Saitama. tem coxinha, pão de queijo, até guaraná', '{}', 'a0000000-0000-0000-0000-000000000092', NOW() - INTERVAL '1 hour 6 minutes', false),
  ('a0000000-0000-0000-0000-000000000094', '10000000-0000-0000-0000-000000000005', 'manda o link depois @Nishio? tô sempre procurando lugar novo', ARRAY['Nishio'], 'a0000000-0000-0000-0000-000000000093', NOW() - INTERVAL '1 hour 4 minutes', false),
  ('a0000000-0000-0000-0000-000000000095', '10000000-0000-0000-0000-000000000003', 'mando sim, já salvo aqui', '{}', 'a0000000-0000-0000-0000-000000000094', NOW() - INTERVAL '1 hour 2 minutes', false),
  ('a0000000-0000-0000-0000-000000000096', '10000000-0000-0000-0000-000000000007', 'alguém conhece algum festival brasileiro acontecendo em julho?', '{}', NULL, NOW() - INTERVAL '1 hour', false),
  ('a0000000-0000-0000-0000-000000000097', '10000000-0000-0000-0000-000000000008', 'geralmente em Hamamatsu tem coisa em julho e agosto. festa junina de verão', '{}', 'a0000000-0000-0000-0000-000000000096', NOW() - INTERVAL '58 minutes', false),
  ('a0000000-0000-0000-0000-000000000098', '10000000-0000-0000-0000-000000000006', 'em Tokyo também tem eventos. segue umas páginas de brasileiros no insta que eles postam tudo', '{}', 'a0000000-0000-0000-0000-000000000096', NOW() - INTERVAL '56 minutes', false),
  ('a0000000-0000-0000-0000-000000000099', '10000000-0000-0000-0000-000000000009', 'sinto falta de festa brasileira. aquelas com milho, quentão e música', '{}', 'a0000000-0000-0000-0000-000000000097', NOW() - INTERVAL '54 minutes', false),
  ('a0000000-0000-0000-0000-000000000100', '10000000-0000-0000-0000-000000000005', 'se achar, a gente podia marcar um encontrinho do grupo né?', '{}', 'a0000000-0000-0000-0000-000000000099', NOW() - INTERVAL '52 minutes', false),
  ('a0000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000001', 'ia ser legal conhecer vcs pessoalmente!', '{}', 'a0000000-0000-0000-0000-000000000100', NOW() - INTERVAL '50 minutes', false),
  ('a0000000-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000010', 'se for em Tokyo topo. se for longe demais a gente faz call kkk', '{}', 'a0000000-0000-0000-0000-000000000100', NOW() - INTERVAL '48 minutes', false),
  ('a0000000-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000002', 'primeiro vamos dominar o chat, depois o mundo', '{}', 'a0000000-0000-0000-0000-000000000102', NOW() - INTERVAL '46 minutes', false),
  ('a0000000-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000004', 'quem aqui já foi pra onsen?', '{}', NULL, NOW() - INTERVAL '44 minutes', false),
  ('a0000000-0000-0000-0000-000000000105', '10000000-0000-0000-0000-000000000007', 'eu fui uma vez só. estranho no começo, mas relaxa depois', '{}', 'a0000000-0000-0000-0000-000000000104', NOW() - INTERVAL '42 minutes', false),
  ('a0000000-0000-0000-0000-000000000106', '10000000-0000-0000-0000-000000000006', 'adoro onsen. é o meu programa favorito no inverno', '{}', 'a0000000-0000-0000-0000-000000000104', NOW() - INTERVAL '40 minutes', false),
  ('a0000000-0000-0000-0000-000000000107', '10000000-0000-0000-0000-000000000008', 'tem uns baratos tipo super sento. fica perto de estações', '{}', 'a0000000-0000-0000-0000-000000000106', NOW() - INTERVAL '38 minutes', false),
  ('a0000000-0000-0000-0000-000000000108', '10000000-0000-0000-0000-000000000001', 'quero ir mas tenho tatuagem. ainda tem restrição né?', '{}', 'a0000000-0000-0000-0000-000000000107', NOW() - INTERVAL '36 minutes', false),
  ('a0000000-0000-0000-0000-000000000109', '10000000-0000-0000-0000-000000000006', 'ainda tem alguns que barram, mas muitos estão aceitando. procura que tem lista', '{}', 'a0000000-0000-0000-0000-000000000108', NOW() - INTERVAL '34 minutes', false),
  ('a0000000-0000-0000-0000-000000000110', '10000000-0000-0000-0000-000000000003', 'eu cubro com curativo e nunca perguntaram nada', '{}', 'a0000000-0000-0000-0000-000000000108', NOW() - INTERVAL '32 minutes', false),
  ('a0000000-0000-0000-0000-000000000111', '10000000-0000-0000-0000-000000000005', 'kkkkk life hack japonês', '{}', 'a0000000-0000-0000-0000-000000000110', NOW() - INTERVAL '30 minutes', false),
  ('a0000000-0000-0000-0000-000000000112', '10000000-0000-0000-0000-000000000009', 'gente, alguém já visitou ilhas do Japão? tipo Okinawa?', '{}', NULL, NOW() - INTERVAL '28 minutes', false),
  ('a0000000-0000-0000-0000-000000000113', '10000000-0000-0000-0000-000000000008', 'Okinawa é outro mundo. praia azul, comida diferente, clima quente', '{}', 'a0000000-0000-0000-0000-000000000112', NOW() - INTERVAL '26 minutes', false),
  ('a0000000-0000-0000-0000-000000000114', '10000000-0000-0000-0000-000000000006', 'caro ir de avião mas vale cada centavo. comida de Okinawa é incrível', '{}', 'a0000000-0000-0000-0000-000000000112', NOW() - INTERVAL '24 minutes', false),
  ('a0000000-0000-0000-0000-000000000115', '10000000-0000-0000-0000-000000000001', 'quero muito ir. praia no Japão parece mentira depois de tanto concreto', '{}', 'a0000000-0000-0000-0000-000000000113', NOW() - INTERVAL '22 minutes', false),
  ('a0000000-0000-0000-0000-000000000116', '10000000-0000-0000-0000-000000000004', 'comida de Okinawa é diferente do resto do Japão? tipo goya?', '{}', 'a0000000-0000-0000-0000-000000000114', NOW() - INTERVAL '20 minutes', false),
  ('a0000000-0000-0000-0000-000000000117', '10000000-0000-0000-0000-000000000008', 'sim, goya, soba de Okinawa, taco-rice. mistura com americano por causa das bases', '{}', 'a0000000-0000-0000-0000-000000000116', NOW() - INTERVAL '18 minutes', false),
  ('a0000000-0000-0000-0000-000000000118', '10000000-0000-0000-0000-000000000010', 'taco-rice me deixou curioso agora. anotado pra próxima viagem', '{}', 'a0000000-0000-0000-0000-000000000117', NOW() - INTERVAL '16 minutes', false),
  ('a0000000-0000-0000-0000-000000000119', '10000000-0000-0000-0000-000000000002', 'quando alguém for pra Okinawa, abre uma thread. quero dicas de hostel e praia', '{}', 'a0000000-0000-0000-0000-000000000118', NOW() - INTERVAL '14 minutes', false),
  ('a0000000-0000-0000-0000-000000000120', '10000000-0000-0000-0000-000000000005', 'e se for planejar viagem, chama o grupo. aqui sempre tem alguém que já foi', '{}', 'a0000000-0000-0000-0000-000000000119', NOW() - INTERVAL '12 minutes', false);

-- Atualiza contagem aproximada de mensagens dos perfis seed
UPDATE profiles p
SET message_count = sub.cnt
FROM (
  SELECT user_id, COUNT(*)::int AS cnt
  FROM messages
  WHERE user_id IN (
    '10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000009',
    '10000000-0000-0000-0000-000000000010'
  )
  GROUP BY user_id
) sub
WHERE p.id = sub.user_id;
