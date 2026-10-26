const DIAS=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const A=[
{s:"Descanso",c:"Opcional: corrida 30' Z1",z:"—",t:"descanso"},
{s:"Rio: treino do clube adaptado a Z2, 14–16 km (4×8' Z2 alta, sem os 2' fortes)",c:"Ginásio A (força máxima)",z:"Z2 · FC 70–80% · RPE 4–5 · 62–72 rpm",t:"normal"},
{s:"Piscina com o grupo (natação + apneia)",c:"Tarde: rio 50–60' Z1–Z2 + técnica",z:"Z1–Z2 · RPE 3–5",t:"duro"},
{s:"Rio: QUALIDADE 1 — limiar longo (ex.: 3×12'→3')",c:"Corrida 30–40' Z1–Z2",z:"Z3 · FC 80–88% · RPE 6–7 · 72–82 rpm",t:"normal"},
{s:"Piscina com o grupo",c:"Rio 60' Z2 + ginásio B",z:"Z2 · RPE 4–5",t:"duro"},
{s:"Rio 60–70' Z2 + 6×15'' acelerações soltas",c:"Ginásio C (ombros, curto)",z:"Z2 · RPE 4–5 · 62–72 rpm",t:"normal"},
{s:"Rio com o grupo: ondas com teto Z2 (dez: Z3), depois prolongar (16–20 km)",c:"Dezembro: QUALIDADE 2 (ritmo 5 km)",z:"Z2 (dez: Z3–Z4) · RPE 4–5",t:"duro"}];
const B=[
{s:"Descanso ou corrida 30' Z1",c:"—",z:"Z1",t:"descanso"},
{s:"Almoço 60': rio Z2 contínuo + técnica",c:"Noite: ginásio A",z:"Z2 · FC 70–80% · RPE 4–5",t:"normal"},
{s:"Almoço: piscina (versão curta)",c:"—",z:"Z1–Z2",t:"normal"},
{s:"Almoço 60': QUALIDADE 1 — 3×10'→2' limiar",c:"Noite: ginásio B",z:"Z3 · FC 80–88% · RPE 6–7 · 72–82 rpm",t:"normal"},
{s:"Almoço: piscina (versão curta)",c:"Noite (opcional): ginásio C",z:"Z1–Z2",t:"normal"},
{s:"Almoço 60': rio Z2 + 6×15'' acelerações",c:"—",z:"Z2 · RPE 4–5",t:"normal"},
{s:"Rio com o grupo em Z2, prolongar para 14–18 km",c:"Dezembro: QUALIDADE 2",z:"Z2 (dez: Z3–Z4)",t:"duro"}];
const FASES=[
{ini:"2026-11-02",nome:"Base 1",km:48,q:"1×: 3×10'→3' Z3",r:"Z2, técnica, longo 14 km, força máxima"},
{ini:"2026-11-09",nome:"Base 2",km:55,q:"1×: 3×12'→3' Z3",r:"Longo 16 km; 1 sessão em água agitada a Z2"},
{ini:"2026-11-16",nome:"Base 3",km:62,q:"1×: 3×15'→3' Z3",r:"Longo 18 km; pico de volume"},
{ini:"2026-11-23",nome:"Assimilação + teste",km:50,q:"Teste 5 km (mesma maré, ida e volta)",r:"Volume −20%"},
{ini:"2026-11-30",nome:"Específico 1",km:62,q:"2×: 3×12' Z3 + 4×1 km ritmo 5 km →2'",r:"Longo 16 km"},
{ini:"2026-12-07",nome:"Específico 2",km:52,q:"2×: limiar + 2×2,5 km ritmo 5 km",r:"Longo 14 km; afinação a partir de D-10"},
{ini:"2026-12-14",nome:"Afinação final",km:32,q:"Curtas a ritmo de prova",r:"Volume −40 a −50%"}];
const NUT={"duro": {"kcal": 2960, "p": 170, "h": 390, "g": 80, "lbl": "Duro (longo ou bi-diário)"}, "normal": {"kcal": 2650, "p": 170, "h": 312, "g": 80, "lbl": "Normal (1 sessão + ginásio)"}, "descanso": {"kcal": 2335, "p": 170, "h": 234, "g": 80, "lbl": "Descanso"}};
const MEALS=[{"n": "Pequeno-almoço", "h": 0.15, "p": 30, "g": 0.2, "c": ["Aveia + skyr + banana + nozes", "Pão integral + ovos mexidos + claras + fruta", "Panquecas de aveia, claras e banana + manteiga de amendoim"]}, {"n": "Lanche da manhã", "h": 0.08, "p": 15, "g": 0.15, "c": ["Iogurte grego 0% + frutos vermelhos + amêndoas", "Tostas + queijo fresco + fiambre de peru", "Maçã + queijo cottage"]}, {"n": "Almoço", "h": 0.2, "p": 35, "g": 0.2, "c": ["Arroz basmati + peito de frango + salada + azeite", "Massa integral + atum + legumes salteados", "Batata-doce + salmão + brócolos"]}, {"n": "Lanche pré-treino", "h": 0.17, "p": 15, "g": 0.05, "c": ["Pão de mistura + mel + skyr", "Bolachas de arroz + banana + whey", "Tâmaras + iogurte grego 0%"]}, {"n": "Pós-treino", "h": 0.2, "p": 30, "g": 0.05, "c": ["Shake: whey + banana + aveia (ou leite)", "Arroz + frango ou peru + fruta", "Wrap + peru + queijo fresco + sumo/fruta"]}, {"n": "Jantar", "h": 0.15, "p": 30, "g": 0.2, "c": ["Pescada ou bacalhau + batata cozida + legumes + azeite", "Vaca picada 5% + grão/feijão + salada", "Omelete de ovos e claras + quinoa + legumes"]}, {"n": "Ceia / pré-sono", "h": 0.05, "p": 15, "g": 0.15, "c": ["Skyr ou requeijão + nozes", "Caseína + chocolate 85% (1 quadrado)", "Queijo cottage + sementes de chia"]}];
const GRP={h:"Hidratos",p:"Proteína",g:"Gordura",v:"Legumes / fruta"};
const FOODS={"h": [["Arroz branco", 78, "cru"], ["Arroz branco", 28, "cozido"], ["Arroz basmati", 78, "cru"], ["Arroz basmati", 25, "cozido"], ["Arroz integral", 74, "cru"], ["Arroz integral", 23, "cozido"], ["Massa", 72, "crua"], ["Massa", 28, "cozida"], ["Massa integral", 64, "crua"], ["Massa integral", 25, "cozida"], ["Gnocchi", 32, "embalado, cru"], ["Batata", 16, "crua, com casca"], ["Batata-doce", 20, "crua"], ["Pão de mistura", 50, "pronto"], ["Pão integral", 42, "pronto"], ["Wrap de trigo", 50, "pronto"], ["Tostas", 70, "prontas"], ["Bolachas de arroz", 80, "prontas"], ["Flocos de aveia", 60, "secos"], ["Cereais (flocos de milho)", 83, "secos"], ["Quinoa", 64, "crua"], ["Cuscuz", 72, "cru"], ["Grão-de-bico", 18, "cozido / frasco escorrido"], ["Feijão", 14, "cozido / frasco escorrido"], ["Lentilhas", 17, "cozidas"], ["Banana", 21, "sem casca"], ["Maçã", 12, "com casca"], ["Laranja", 9, "sem casca"], ["Tâmaras", 65, "secas, sem caroço"], ["Mel", 80, "—"]], "p": [["Peito de frango", 23, "cru"], ["Peito de frango", 31, "grelhado"], ["Coxa de frango sem pele", 19, "crua"], ["Peito de peru", 22, "cru"], ["Vaca magra (alcatra, pojadouro)", 21, "crua"], ["Carne picada de vaca 5%", 20, "crua"], ["Lombo de porco", 21, "cru"], ["Salmão", 20, "cru"], ["Pescada", 17, "crua"], ["Bacalhau demolhado", 18, "cru"], ["Atum ao natural (lata)", 25, "escorrido"], ["Sardinha", 20, "crua, limpa"], ["Polvo", 15, "cru"], ["Camarão", 18, "cru, descascado"], ["Ovo inteiro", 12.5, "cru (1 ovo ≈ 55 g sem casca)", 1], ["Claras", 11, "cruas"], ["Iogurte grego 0%", 10, "—"], ["Skyr", 11, "—"], ["Queijo fresco", 10, "—"], ["Requeijão", 10, "—"], ["Queijo cottage", 12, "—"], ["Whey", 78, "pó"], ["Caseína", 80, "pó"], ["Fiambre de peru", 18, "fatiado"]], "g": [["Azeite", 100, "1 c. sopa ≈ 10 g"], ["Abacate", 14, "polpa"], ["Nozes", 65, "cruas"], ["Amêndoas", 52, "cruas"], ["Cajus", 46, "crus"], ["Manteiga de amendoim", 50, "100% amendoim"], ["Sementes de chia", 31, "secas"], ["Sementes de linhaça", 42, "moídas"], ["Chocolate 85%", 46, "—"], ["Queijo flamengo / curado", 26, "também dá proteína"]], "v": [["Brócolos", 0, "legume"], ["Espinafres", 0, "legume"], ["Curgete", 0, "legume"], ["Cenoura", 0, "legume"], ["Tomate", 0, "legume"], ["Alface / salada mista", 0, "legume"], ["Pimento", 0, "legume"], ["Cogumelos", 0, "legume"], ["Couve / grelos", 0, "legume"], ["Feijão-verde", 0, "legume"], ["Frutos vermelhos", 0, "fruta"], ["Kiwi", 0, "fruta"], ["Pera", 0, "fruta"], ["Ananás", 0, "fruta"]]};
const ZONAS=[["Z1 Recuperação","< 70% · RPE 2–3 · 55–65 rpm"],["Z2 Aeróbio","70–80% · RPE 4–5 · 62–72 rpm"],["Z3 Limiar","80–88% · RPE 6–7 · 72–82 rpm"],["Z4 Ritmo 5 km","86–92% · RPE 7–8 · 78–88 rpm"],["Acelerações","6–8×10–15'' soltas"]];
const TAPER=[["D-10 a D-7","Volume −30%, 3×1 km ritmo de prova. Último ginásio pesado."],["D-6 a D-3","Volume −40 a −50%. 4–6×1' ritmo de prova + 6×15'' acelerações. Ginásio só C."],["D-2","Descanso ou 30' Z1."],["D-1","25–30' com 3×1' ritmo de prova. Hidratos 7–8 g/kg."],["Dia da prova","Refeição 3 h antes (2 g/kg hidratos), aquecimento 20', saída controlada (RPE 7 nos primeiros 500 m)."]];
const ADAPT=[["Seg 4×5' + 4×8' + 4×2' forte","4×8' a Z2 alta, sem os 2' fortes; 15' aquecimento e retorno"],["Ter 3×(10×1'→1')","3×10'→3' Z3, ou os 1' a Z3 (não forte)"],["Qua fartlek 12×3' 70/90%","Nov: 6×3' Z2 alta/3' Z2. Dez: 8×3' ritmo 5 km/3' Z2"],["Qui 4×8' ritmo de contra","Z2 alta–Z3 baixa; foco na técnica"],["Sex 2×(10×2'→1') forte","Nov: 4×6'→2' Z3. Dez: 4×1 km ritmo 5 km"],["Sáb 4×12' troca de ondas","Com o grupo, teto de FC Z2 (dez: Z3), depois prolongar"],["Araújo 2×3'45 / 4×1000 m 100%","Adiar para a pista; dez: 3×1500 m ritmo 5 km"],["4×40'' 100% / saídas 5''","6–8×15'' acelerações soltas"],["Piscina e corrida do clube","Manter; corrida em Z1–Z2"]];
const GYM=[["A — Força máxima","Remada deitada no banco, supino, elevações com peso, peso morto romeno, agachamento frontal","4–5 × 3–5 (RPE 8), descanso 3'"],["B — Força + core","Remada unilateral, press landmine, peso morto unilateral, prancha lateral, Pallof press, rotação com cabo","3–4 × 6–8; core 3 × 30–45''"],["C — Ombros (curto)","Rotação externa com elástico, face pull, Y-T-W, serratus wall slide, mobilidade torácica","2–3 × 12–15 (também no aquecimento de A e B)"]];

const KEY="k1-natal-registo";
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const hoje=iso(new Date());
const faseDe=d=>{let i=-1;FASES.forEach((f,k)=>{if(d>=f.ini)i=k});return i};
const semK=d=>{const x=new Date(d+"T12:00:00");x.setDate(x.getDate()-((x.getDay()+6)%7));return iso(x)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const S={tab:"hoje",wk:localStorage.getItem("k1-wk")||"A",dia:new Date().getDay(),nt:null,meal:-1,grp:null,food:-1,logs:JSON.parse(localStorage.getItem(KEY)||"[]"),f:{d:hoje,km:"",min:"",fc:"",rpe:"",spm:"",notas:""}};
const plano=()=>S.wk==="A"?A:B;
const card=(t,b,cls="")=>`<div class="card ${cls}"><p class="h">${t}</p>${b}</div>`;
const kv=(k,v)=>`<div class="kv"><span>${k}</span><b>${v}</b></div>`;
const row=(l,s,a)=>`<button class="row" data-a="${a}"><span>${esc(l)}</span><span>${esc(s)} ›</span></button>`;
const macros=n=>kv("Energia",n.kcal+" kcal")+kv("Proteína",n.p+" g")+kv("Hidratos",n.h+" g")+kv("Gordura",n.g+" g");
const tipo=()=>S.nt||plano()[new Date().getDay()].t;
const alvo=(m,g)=>{const N=NUT[tipo()],M=MEALS[m];return g==="h"?Math.round(N.h*M.h):g==="p"?M.p:g==="g"?Math.round(N.g*M.g):0};

function hojeV(){const d=plano()[S.dia],fi=faseDe(hoje),f=FASES[fi];
return `<div class="pills">${DIAS.map((x,i)=>`<button class="pill ${i===S.dia?"on":""}" data-a="dia:${i}">${x}</button>`).join("")}</div>`+
card(`${DIAS[S.dia]} · ${f?f.nome:"antes do bloco (começa 2 nov)"}`,`<p class="big">${d.s}</p><p>+ ${d.c}</p>`)+
card("Alvos de intensidade",`<p>${d.z}</p>`)+(f?card("Qualidade desta semana",`<p>${f.q}</p><p>${f.r} · alvo ${f.km} km</p>`):"")+
card("Alimentação · dia "+d.t,macros(NUT[d.t]))+card("Lembrete de ritmo","<p>1.ª série no máx. 2–3 s/500 mais rápida que a média. Recuperações a remar em Z1. Séries em par: a favor e contra a corrente.</p>")}
function semanaV(){const p=plano();return [1,2,3,4,5,6,0].map(j=>card(`${DIAS[j]} · ${p[j].t}`,`<p class="big" style="font-size:16px">${p[j].s}</p><p>+ ${p[j].c}</p><p class="small">${p[j].z}</p>`)).join("")+card("Zonas",ZONAS.map(z=>kv(z[0],z[1])).join("")+"<p>Em novembro nada acima de Z3, exceto acelerações. ~80% do tempo em Z1–Z2.</p>")}
function planoV(){const fi=faseDe(hoje);return FASES.map((x,i)=>card(`Semana de ${x.ini.slice(8)}/${x.ini.slice(5,7)}${i===fi?" · agora":""}`,`<p class="big">${x.nome} · ${x.km} km</p><div class="bar"><div style="width:${x.km/62*100}%"></div></div><p>Qualidade: ${x.q}</p><p>${x.r}</p>`,i===fi?"now":"")).join("")+
card("Afinação final",TAPER.map(t=>`<div class="kv" style="display:block"><p><b style="color:#f2f4f8">${t[0]}</b></p><p>${t[1]}</p></div>`).join(""))+
card("Adaptar treinos do clube",ADAPT.map(t=>`<div class="kv" style="display:block"><p style="color:#f2f4f8">${t[0]}</p><p>→ ${t[1]}</p></div>`).join(""))+
card("Progressão","<p>Subir no máx. 10–15% de km/semana. FC em repouso +5 bpm ou RPE em Z2 acima de 5: repetir a semana.</p>")+
card("Corrida","<p>Semana A 2×, Semana B 1×, sempre Z1–Z2. Começar em 25' e subir 5'/semana até 40–45'. Corrida do clube conta. Na semana da prova: 1×20'.</p>")}
function gymV(){return GYM.map(g=>card(g[0],`<p>${g[1]}</p><p style="color:#f2f4f8">${g[2]}</p>`)).join("")+card("Progressão","<p>Novembro: força máxima (A + B). Dezembro: A com 3 séries + 3×5 remadas explosivas. Último treino pesado 8–10 dias antes da prova.</p>")}
function nutV(){const t=tipo(),N=NUT[t];
if(S.meal<0)return `<p class="h">Tipo de dia</p><div class="pills">${["duro","normal","descanso"].map(k=>`<button class="pill ${k===t?"on":""}" data-a="nt:${k}">${k}</button>`).join("")}</div>`+card(N.lbl,macros(N))+
`<p class="h">Refeições</p>`+MEALS.map((m,i)=>row(m.n,`H ${alvo(i,"h")} · P ${alvo(i,"p")} · G ${alvo(i,"g")} g`,"meal:"+i)).join("")+
card("Pré e pós-treino","<p>Antes (1–3 h): a refeição antes do treino leva a maior parte dos hidratos; pouca gordura e fibra. Semana B: lanche pré-treino 60–90' antes do almoço-treino (ex.: banana + pão com mel).</p><p>Durante (&gt; 75'): 30–60 g de hidratos por hora.</p><p>Pós-treino (até 1 h): 30 g de proteína + os hidratos indicados na refeição Pós-treino.</p><p>Água: 2,7–3,1 L/dia + 500–750 ml por hora de treino; repor 150% do peso perdido.</p>")+
card("Cálculo","<p>Proteína 170 g todos os dias; hidratos 390 / 312 / 234 g (duro / normal / descanso); gordura 80 g. kcal = 4×P + 4×H + 9×G. Valores estimados. Se o peso cair mais de 0,5 kg/semana, somar 200 kcal em hidratos.</p>");
const M=MEALS[S.meal];
if(!S.grp)return `<button class="back" data-a="meal:-1">‹ Refeições (${t})</button><p class="big">${M.n}</p>`+["h","p","g","v"].map(g=>row(GRP[g],g==="v"?"porção":alvo(S.meal,g)+" g","grp:"+g)).join("")+card("Combinações típicas",M.c.map(c=>`<p>• ${c}</p>`).join(""))+`<p class="small">Escolha 1 alimento por grupo. Pode dividir: metade de um, metade de outro.</p>`;
const L=FOODS[S.grp];
if(S.food<0)return `<button class="back" data-a="grp:">‹ ${M.n}</button><p class="big">${GRP[S.grp]}${S.grp!=="v"?" · "+alvo(S.meal,S.grp)+" g":""}</p>`+L.map((x,i)=>row(x[0],x[2],"food:"+i)).join("");
const x=L[S.food],a=alvo(S.meal,S.grp);let b;
if(S.grp==="v")b=`<p class="num">${x[2]==="fruta"?"1 peça / 150 g":"150–250 g"}</p><p>Legumes à vontade no almoço e jantar; fruta 2–3 peças por dia. Não conta para a dose de hidratos (exceto banana, maçã, laranja e tâmaras, que estão em Hidratos).</p>`;
else{const g=Math.round(a/x[1]*100/5)*5;b=`<p class="num">${x[3]?Math.round(g/55*2)/2+" ovos":g+" g"}</p>${x[3]?`<p>≈ ${g} g sem casca</p>`:""}<p>para ${a} g de ${GRP[S.grp].toLowerCase()} · ${x[1]} g por 100 g (${x[2]})</p><p class="small">Pesar no estado indicado. Valores médios (tabela INSA/PortFIR), arredondados a 5 g.</p>`}
return `<button class="back" data-a="food:-1">‹ ${GRP[S.grp]}</button>`+card(`${M.n} · ${GRP[S.grp]}`,`<p class="big">${x[0]} (${x[2]})</p>`+b)}
function regV(){const sem=semK(hoje),L=S.logs.filter(l=>semK(l.d)===sem),n=v=>parseFloat(String(v).replace(",","."));
const tot=k=>L.reduce((a,l)=>a+(n(l[k])||0),0),avg=k=>{const v=L.map(l=>n(l[k])).filter(x=>!isNaN(x));return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):"—"};
const f=FASES[faseDe(hoje)],F=S.f,inp=(k,l,t="number")=>`<label>${l}<input data-f="${k}" type="${t}" ${t==="number"?'inputmode="decimal"':""} value="${esc(F[k])}"></label>`;
return card("Esta semana",kv("km",tot("km").toFixed(1))+kv("Minutos",tot("min"))+kv("Sessões",L.length)+kv("FC média",avg("fc"))+kv("RPE médio",avg("rpe"))+kv("Remadas/min",avg("spm"))+(f?kv("Alvo km",f.km):""))+
card("Novo treino",`<div class="form">${inp("d","Data","date")}${inp("km","km")}${inp("min","Tempo (min)")}${inp("fc","FC média")}${inp("rpe","RPE (1–10)")}${inp("spm","Remadas/min")}${inp("notas","Notas (maré, vento, dores)","text")}<button class="primary" data-a="save">Guardar treino</button><p class="small">Guardado só neste iPhone (armazenamento da app). Envie também as capturas ao domingo.</p></div>`)+
S.logs.map((l,i)=>card(esc(l.d),`<p>${esc(l.km)} km · ${esc(l.min)} min · FC ${esc(l.fc)} · RPE ${esc(l.rpe)} · ${esc(l.spm)} rpm</p>${l.notas?`<p>${esc(l.notas)}</p>`:""}<button class="del" data-a="del:${i}">Apagar</button>`)).join("")}
function infoV(){return card("Porquê este plano","<p>O plano do clube parece um bloco pré-controlos de 2000 m e pista. Em pré-época, 4 meses após o regresso, o que mais sobe o nível é base aeróbia, técnica e força.</p><p>• ~80% em Z1–Z2 • 1 qualidade/semana em nov, 2 em dez • limiar longo primeiro, ritmo de 5 km depois • sem sprints 100%, só acelerações • força máxima no ginásio.</p>")+
card("Ponto de partida","<p>Outubro: 13 treinos, 106,6 km (média 8,2 km / 50').</p><p>5 km contínuo: 20:53 (2'05''/500).</p><p>Subida do Arade: 1:01h, 12.º sénior, ~3,5' parado a esvaziar o barco.</p><p>Corrigir: saídas rápidas demais e recuperações paradas. Treinar água agitada 1×/semana; bomba ou barco de maratona em provas de fundo.</p>")+
card("Fonte dos alimentos","<p>Valores médios por 100 g da Tabela da Composição de Alimentos do INSA (portfir.insa.pt) e rótulos típicos (whey, skyr, manteiga de amendoim). Cru e cozinhado têm valores diferentes: pesar sempre no estado indicado. Os valores podem variar por marca.</p>")+
card("Suplementos","<p>D3, multivitamínico, ZMA, creatina (3–5 g/dia), proteína e ómega 3: permitidos. Preferir marcas com certificação de lote (ex.: Informed Sport).</p>")+
card("Notas","<p>Data da prova assumida 19–20 dez: confirmar. Falar das adaptações com o treinador do clube.</p>")}
const TABS=[["hoje","Hoje",hojeV],["semana","Semana",semanaV],["plano","Plano",planoV],["gym","Ginásio",gymV],["comida","Nutrição",nutV],["registo","Registo",regV],["info","Info",infoV]];
function render(){const dp=Math.ceil((new Date("2026-12-19T12:00:00")-new Date(hoje+"T12:00:00"))/864e5);
document.getElementById("cd").textContent=dp>0?`faltam ${dp} dias (19 dez, a confirmar)`:"prova: confirmar data";
document.getElementById("wk").innerHTML=["A","B"].map(w=>`<button class="pill ${S.wk===w?"on":""}" data-a="wk:${w}">Semana ${w} ${w==="A"?"(livre)":"(filha)"}</button>`).join("");
document.getElementById("app").innerHTML=TABS.find(t=>t[0]===S.tab)[2]();
document.getElementById("nav").innerHTML=TABS.map(t=>`<button class="${S.tab===t[0]?"on":""}" data-a="tab:${t[0]}">${t[1]}</button>`).join("")}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const[k,v]=b.dataset.a.split(":");
if(k==="tab"){S.tab=v;S.meal=-1;S.grp=null;S.food=-1;scrollTo(0,0)}else if(k==="wk"){S.wk=v;localStorage.setItem("k1-wk",v)}
else if(k==="dia")S.dia=+v;else if(k==="nt")S.nt=v;else if(k==="meal"){S.meal=+v;S.grp=null;S.food=-1}else if(k==="grp"){S.grp=v||null;S.food=-1}else if(k==="food")S.food=+v;
else if(k==="save"){S.logs.unshift({...S.f});localStorage.setItem(KEY,JSON.stringify(S.logs));S.f={d:hoje,km:"",min:"",fc:"",rpe:"",spm:"",notas:""}}
else if(k==="del"){if(!confirm("Apagar este registo?"))return;S.logs.splice(+v,1);localStorage.setItem(KEY,JSON.stringify(S.logs))}
render()});
document.addEventListener("input",e=>{const k=e.target.dataset&&e.target.dataset.f;if(k)S.f[k]=e.target.value});
render();
