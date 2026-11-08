// Lanches: porções fixas (barras pelo rótulo por 100 g; o resto aproximado).
// Porção = valor_por_100_g × gramas / 100.
// Gramas e fibra: 1 casa decimal. kcal da refeição: unidade.
// A linha "por barra" da barra integral arredonda os hidratos a 17 g;
// 79 g/100 g × 21 g = 16,59 → 16,6 g. A app usa sempre esta regra.
const NUTX=(function(){
const FOOD={
barraFruta:{n:"Barra de cereais de fruta",src:"rotulo",kcal:372,P:5.3,H:71.5,G:7.1,fibra:6.5},
barraArando:{n:"Barra de cereais integral com arando",src:"rotulo",kcal:374,P:5.9,H:79,G:3.2,fibra:2.2},
iogurte:{n:"Iogurte grego 0%",src:"aprox",P:10,H:4,G:0},
skyr:{n:"Skyr",src:"aprox",P:11,H:4,G:0.2},
cottage:{n:"Queijo cottage",src:"aprox",P:12,H:3,G:4},
banana:{n:"Banana",src:"aprox",P:1.1,H:21,G:0.3},
clementina:{n:"Clementina",src:"aprox",P:0.9,H:10,G:0.2},
tosta:{n:"Tostas",src:"aprox",P:12,H:70,G:5},
amendoa:{n:"Amêndoas",src:"aprox",P:21,H:9,G:50},
pao:{n:"Pão de mistura",src:"aprox",P:9,H:50,G:2}
};
const r1=v=>Math.round(v*10)/10,r0=v=>Math.round(v);
const fmtG=g=>{const x=r1(g);return Number.isInteger(x)?String(x):x.toFixed(1).replace(".",",");};
function macros(id,grams){const f=FOOD[id];if(!f)throw new Error("alimento em falta: "+id);const k=grams/100,P=f.P*k,H=f.H*k,G=f.G*k;return{P,H,G,fibra:f.fibra?f.fibra*k:0,K:f.kcal!=null?f.kcal*k:4*P+4*H+9*G};}
function sum(items){const s={P:0,H:0,G:0,K:0,fibra:0};items.forEach(it=>{const m=macros(it.id,it.g);s.P+=m.P;s.H+=m.H;s.G+=m.G;s.K+=m.K;s.fibra+=m.fibra});return s;}
function rounded(s){return{P:r0(s.P),H:r0(s.H),G:r0(s.G),K:r0(s.K),fibra:r1(s.fibra)};}
function formatPlate(plate,day,target){const items=plate.items[day];if(!items)return"";const R=rounded(sum(items));
const fibra=items.some(it=>FOOD[it.id].fibra)?` · fibra da barra ~${fmtG(R.fibra)} g`:"";
const badge=plate.later?'<p class="warn">Mais gordura do que o alvo de 3 g. Usar se o treino não for nos próximos 60–90 min.</p>':(plate.digest?'<p class="small">Antes do treino · pouca gordura e pouca fibra.</p>':"");
const tgtK=4*target.p+4*target.h+9*target.g;
return `<div class="kv" style="display:block"><p style="color:#f2f4f8;font-weight:600">${plate.n}</p><p>${items.map(it=>it.house).join(" + ")}</p><p>Total: P ${R.P} g · H ${R.H} g · G ${R.G} g · ${R.K} kcal${fibra}</p><p class="small">Alvo deste dia: P ${target.p} g · H ${target.h} g · G ${target.g} g · ${tgtK} kcal</p>${badge}</div>`;}
const all=items=>({duro:items,normal:items,descanso:items});
const it=(id,g,house)=>({id,g,house});
const PLATES=[
{id:"manha-2fruta",meal:"Lanche da manhã",n:"2 barras de fruta e cottage",items:all([
it("barraFruta",29,"2 barras (29 g) de barra de cereais de fruta"),
it("cottage",125,"125 g de queijo cottage (≈ ½ taça, valor aproximado)")])},
{id:"manha-arando-iogurte",meal:"Lanche da manhã",n:"Barra integral com arando, iogurte e amêndoas",items:all([
it("barraArando",21,"1 barra (21 g) de barra de cereais integral com arando"),
it("iogurte",125,"125 g de iogurte grego 0% (iogurte proteico, valor aproximado)"),
it("amendoa",15,"15 g de amêndoas (≈ 12 unidades, valor aproximado)")])},
{id:"manha-fruta-clem",meal:"Lanche da manhã",n:"Barra de fruta, clementina e cottage",items:all([
it("barraFruta",14.5,"1 barra (14,5 g) de barra de cereais de fruta"),
it("clementina",75,"1 clementina (75 g sem casca, valor aproximado)"),
it("cottage",125,"125 g de queijo cottage (≈ ½ taça, valor aproximado)")])},
{id:"manha-banana",meal:"Lanche da manhã",n:"Banana e cottage",items:all([
it("banana",100,"1 banana pequena (100 g sem casca, valor aproximado)"),
it("cottage",125,"125 g de queijo cottage (≈ ½ taça, valor aproximado)")])},
{id:"manha-tostas",meal:"Lanche da manhã",n:"Tostas e cottage",items:all([
it("tosta",30,"3 tostas (30 g, ≈ 10 g cada, valor aproximado)"),
it("cottage",125,"125 g de queijo cottage (≈ ½ taça, valor aproximado)")])},
{id:"manha-clem-tostas",meal:"Lanche da manhã",n:"Clementina, tostas e cottage",items:all([
it("clementina",75,"1 clementina (75 g sem casca, valor aproximado)"),
it("tosta",20,"2 tostas (20 g, ≈ 10 g cada, valor aproximado)"),
it("cottage",125,"125 g de queijo cottage (≈ ½ taça, valor aproximado)")])},
{id:"pre-fruta",meal:"Lanche pré-treino",n:"Barra de fruta, banana, skyr e pão",digest:true,items:{
duro:[it("barraFruta",14.5,"1 barra (14,5 g) de barra de cereais de fruta"),it("banana",120,"1 banana média (120 g sem casca, valor aproximado)"),it("skyr",100,"100 g de skyr (valor aproximado)"),it("pao",80,"80 g de pão de mistura (≈ 2 fatias, valor aproximado)")],
normal:[it("barraFruta",14.5,"1 barra (14,5 g) de barra de cereais de fruta"),it("banana",120,"1 banana média (120 g sem casca, valor aproximado)"),it("skyr",100,"100 g de skyr (valor aproximado)"),it("pao",50,"50 g de pão de mistura (≈ 1 fatia, valor aproximado)")]
}},
{id:"pre-arando",meal:"Lanche pré-treino",n:"Barra integral com arando, banana, skyr e pão",digest:true,items:{
duro:[it("barraArando",21,"1 barra (21 g) de barra de cereais integral com arando"),it("banana",120,"1 banana média (120 g sem casca, valor aproximado)"),it("skyr",100,"100 g de skyr (valor aproximado)"),it("pao",70,"70 g de pão de mistura (≈ 1 fatia e meia, valor aproximado)")],
normal:[it("barraArando",21,"1 barra (21 g) de barra de cereais integral com arando"),it("banana",120,"1 banana média (120 g sem casca, valor aproximado)"),it("skyr",100,"100 g de skyr (valor aproximado)"),it("pao",40,"40 g de pão de mistura (≈ 1 fatia pequena, valor aproximado)")]
}},
{id:"pre-tostas",meal:"Lanche pré-treino",n:"Barra integral com arando, tostas, banana e skyr",digest:true,items:{
duro:[it("barraArando",21,"1 barra (21 g) de barra de cereais integral com arando"),it("tosta",40,"4 tostas (40 g, ≈ 10 g cada, valor aproximado)"),it("banana",150,"1 banana grande (150 g sem casca, valor aproximado)"),it("skyr",100,"100 g de skyr (valor aproximado)")],
normal:[it("barraArando",21,"1 barra (21 g) de barra de cereais integral com arando"),it("tosta",30,"3 tostas (30 g, ≈ 10 g cada, valor aproximado)"),it("banana",120,"1 banana média (120 g sem casca, valor aproximado)"),it("skyr",100,"100 g de skyr (valor aproximado)")]
}},
{id:"pre-clementina",meal:"Lanche pré-treino",n:"Barra de fruta, clementinas, skyr e pão",digest:true,items:{
duro:[it("barraFruta",14.5,"1 barra (14,5 g) de barra de cereais de fruta"),it("clementina",150,"2 clementinas (150 g sem casca, valor aproximado)"),it("skyr",80,"80 g de skyr (valor aproximado)"),it("pao",100,"100 g de pão de mistura (≈ 2 fatias, valor aproximado)")],
normal:[it("barraFruta",14.5,"1 barra (14,5 g) de barra de cereais de fruta"),it("clementina",150,"2 clementinas (150 g sem casca, valor aproximado)"),it("skyr",100,"100 g de skyr (valor aproximado)"),it("pao",70,"70 g de pão de mistura (≈ 1 fatia e meia, valor aproximado)")]
}},
{id:"pre-rest-fruta",meal:"Lanche pré-treino",n:"Barra de fruta, iogurte e clementina",items:{
descanso:[it("barraFruta",14.5,"1 barra (14,5 g) de barra de cereais de fruta"),it("clementina",75,"1 clementina (75 g sem casca, valor aproximado)"),it("iogurte",150,"1 iogurte (150 g de iogurte grego 0%, valor aproximado)")]
}},
{id:"pre-rest-arando",meal:"Lanche pré-treino",n:"Barra integral com arando e iogurte",items:{
descanso:[it("barraArando",21,"1 barra (21 g) de barra de cereais integral com arando"),it("iogurte",150,"1 iogurte (150 g de iogurte grego 0%, valor aproximado)")]
}},
{id:"pre-rest-banana",meal:"Lanche pré-treino",n:"Banana e skyr",items:{
descanso:[it("banana",100,"1 banana pequena (100 g sem casca, valor aproximado)"),it("skyr",130,"130 g de skyr (valor aproximado)")]
}},
{id:"pre-rest-clem",meal:"Lanche pré-treino",n:"Clementinas, tosta e iogurte",items:{
descanso:[it("clementina",150,"2 clementinas (150 g sem casca, valor aproximado)"),it("tosta",10,"1 tosta (10 g, valor aproximado)"),it("iogurte",150,"1 iogurte (150 g de iogurte grego 0%, valor aproximado)")]
}},
{id:"pre-cottage",meal:"Lanche pré-treino",n:"Cottage, tostas e clementina",later:true,items:{
descanso:[it("cottage",100,"100 g de queijo cottage (valor aproximado)"),it("tosta",20,"2 tostas (20 g, ≈ 10 g cada, valor aproximado)"),it("clementina",75,"1 clementina (75 g sem casca, valor aproximado)")]
}}
];
const CK="Clementina|1 peça ≈ 75 g, valor aproximado";
function apply(MEALS,FOODS){
if(FOODS&&!FOODS.h.some(f=>f.n==="Clementina"))FOODS.h.push({n:"Clementina",per:10,st:"1 peça ≈ 75 g, valor aproximado"});
const by={};
MEALS.forEach(m=>{by[m.n]=m});
const manha=by["Lanche da manhã"],tarde=by["Lanche pré-treino"];
if(!manha||!tarde)throw new Error("lanches em falta");
if(!manha.h.includes(CK))manha.h.push(CK);
if(!tarde.p.includes("Queijo cottage|—"))tarde.p.push("Queijo cottage|—");
if(manha.c.some(c=>c.pid))return;
manha.snackNote="Lanche da manhã. Porções caseiras perto do alvo (P 15 g, H 20 g em dia normal ou de descanso, H 25 g em dia duro, G 10 g). A gordura fica muitas vezes um pouco abaixo dos 10 g. Barras: rótulo por 100 g, cálculo proporcional. Iogurte, cottage, tostas, banana, clementina e amêndoas: valores aproximados, sem marca.";
tarde.snackNote="Lanche da tarde e pré-treino. Em dia de treino o alvo leva muitos hidratos e pouca gordura; as opções com iogurte ou skyr, banana e pão são as que se digerem melhor e não substituem o pão com mel, as bolachas, as tâmaras nem os cereais. Cottage e tostas entram quando o treino não é já a seguir. Barras: rótulo por 100 g. O resto: valores aproximados, sem marca.";
const add=(meal,plates)=>{const combos=plates.map(p=>({n:p.n,fix:true,pid:p.id,plate:p}));meal.c=combos.concat(meal.c);};
add(manha,PLATES.filter(p=>p.meal==="Lanche da manhã"));
add(tarde,PLATES.filter(p=>p.meal==="Lanche pré-treino"));
}
return{FOOD,PLATES,macros,sum,rounded,formatPlate,fmtG,r0,r1,apply,CK};
})();
if(typeof module!=="undefined"&&module.exports)module.exports=NUTX;
if(typeof MEALS!=="undefined"&&typeof document!=="undefined")NUTX.apply(MEALS,typeof FOODS!=="undefined"?FOODS:null);
