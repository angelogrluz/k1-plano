"use strict";
const assert=require("assert");
const fs=require("fs");
const NUTX=require("./nut.js");
const {MBF,MBI,mbSolve,mbQty}=require("./mb.js");

function r1(v){return Math.round(v*10)/10}
function r0(v){return Math.round(v)}

// Rótulo por 100 g, arredondamento consistente (não a linha já arredondada da embalagem).
assert.strictEqual(r0(372*14.5/100),54);
assert.strictEqual(r1(71.5*14.5/100),10.4);
assert.strictEqual(r1(7.1*14.5/100),1);
assert.strictEqual(r1(5.3*14.5/100),0.8);
assert.strictEqual(r1(6.5*14.5/100),0.9);
assert.strictEqual(r0(374*21/100),79);
assert.strictEqual(r1(79*21/100),16.6);
assert.strictEqual(r1(3.2*21/100),0.7);
assert.strictEqual(r1(5.9*21/100),1.2);
assert.strictEqual(r1(2.2*21/100),0.5);
assert.notStrictEqual(r1(79*21/100),17);

const fruta=NUTX.rounded(NUTX.macros("barraFruta",14.5));
assert.deepStrictEqual({P:fruta.P,H:fruta.H,G:fruta.G,K:fruta.K,fibra:fruta.fibra},{P:1,H:10,G:1,K:54,fibra:0.9});
const arando=NUTX.rounded(NUTX.macros("barraArando",21));
assert.deepStrictEqual({P:arando.P,H:arando.H,G:arando.G,K:arando.K,fibra:arando.fibra},{P:1,H:17,G:1,K:79,fibra:0.5});
// 1 casa na porção da barra; o total da refeição arredonda a soma crua, não a soma das porções já arredondadas.
assert.strictEqual(r1(NUTX.macros("barraFruta",14.5).H),10.4);
assert.strictEqual(r1(NUTX.macros("barraArando",21).H),16.6);

const GOLD={
"manha-2fruta":{P:17,H:24,G:7,K:228,fibra:1.9},
"manha-arando-iogurte":{P:17,H:23,G:8,K:234,fibra:0.5},
"manha-fruta-clem":{P:16,H:22,G:6,K:208,fibra:0.9},
"manha-banana":{P:16,H:25,G:5,K:211,fibra:0},
"manha-tostas":{P:19,H:25,G:7,K:232,fibra:0},
"manha-clem-tostas":{P:18,H:25,G:6,K:229,fibra:0},
"pre-fruta:duro":{P:20,H:80,G:3,K:428,fibra:0.9},
"pre-fruta:normal":{P:18,H:65,G:3,K:352,fibra:0.9},
"pre-arando:duro":{P:20,H:81,G:3,K:427,fibra:0.5},
"pre-arando:normal":{P:17,H:66,G:2,K:351,fibra:0.5},
"pre-tostas:duro":{P:19,H:80,G:3,K:426,fibra:0.5},
"pre-tostas:normal":{P:17,H:67,G:3,K:362,fibra:0.5},
"pre-clementina:duro":{P:20,H:79,G:3,K:425,fibra:0.9},
"pre-clementina:normal":{P:19,H:64,G:3,K:362,fibra:0.9},
"pre-rest-fruta:descanso":{P:16,H:24,G:1,K:172,fibra:0.9},
"pre-rest-arando:descanso":{P:16,H:23,G:1,K:163,fibra:0.5},
"pre-rest-banana:descanso":{P:15,H:26,G:1,K:171,fibra:0},
"pre-rest-clem:descanso":{P:18,H:28,G:1,K:189,fibra:0},
"pre-cottage:descanso":{P:15,H:25,G:5,K:205,fibra:0}
};
const TGT={
duro:{manha:{p:15,h:25,g:10},pre:{p:15,h:80,g:3}},
normal:{manha:{p:15,h:20,g:10},pre:{p:15,h:65,g:3}},
descanso:{manha:{p:15,h:20,g:10},pre:{p:15,h:25,g:3}}
};
for(const p of NUTX.PLATES){
  for(const day of ["duro","normal","descanso"]){
    const items=p.items[day];
    if(!items)continue;
    const key=p.items.duro&&p.items.normal&&p.items.descanso&&p.meal==="Lanche da manhã"?p.id:p.id+":"+day;
    const g=GOLD[p.meal==="Lanche da manhã"?p.id:p.id+":"+day];
    assert.ok(g, "sem ouro para "+p.id+" "+day);
    const R=NUTX.rounded(NUTX.sum(items));
    assert.deepStrictEqual({P:R.P,H:R.H,G:R.G,K:R.K,fibra:R.fibra},g,p.id+" "+day);
    items.forEach(it=>assert.ok(it.house.includes(NUTX.fmtG(it.g)), it.house));
    const slot=p.meal==="Lanche da manhã"?"manha":"pre";
    const t=TGT[day][slot];
    if(p.digest){
      assert.ok(Math.abs(R.H-t.h)<=3, p.id+" H "+R.H+" vs "+t.h);
      assert.ok(R.G<=4, p.id+" gordura "+R.G);
      assert.ok(R.P>=14&&R.P<=21, p.id+" P "+R.P);
      assert.ok(R.fibra<=2, p.id+" fibra");
    }else if(p.later){
      assert.strictEqual(day,"descanso");
      assert.ok(R.G<=6&&R.H>=20&&R.H<=28);
    }else if(slot==="manha"){
      assert.ok(R.P>=14&&R.P<=20, "P "+R.P);
      assert.ok(R.H>=20&&R.H<=26, "H "+R.H);
      assert.ok(R.G>=4&&R.G<=9, "G "+R.G);
      assert.ok(R.K>=190&&R.K<=250, "K "+R.K);
    }else{
      assert.ok(Math.abs(R.H-t.h)<=4, p.id+" H "+R.H);
      assert.ok(R.G<=3, p.id+" G "+R.G);
      assert.ok(R.P>=14&&R.P<=20, p.id+" P "+R.P);
    }
    const html=NUTX.formatPlate(p,day,t);
    assert.ok(html.includes("Total: P "+R.P+" g · H "+R.H+" g · G "+R.G+" g · "+R.K+" kcal"), html);
    assert.ok(html.includes("Alvo deste dia: P "+t.p+" g · H "+t.h+" g · G "+t.g+" g"));
    assert.ok(html.includes(items[0].house));
    if(items.some(it=>it.id.startsWith("barra")))assert.ok(html.includes("fibra da barra"));
    if(p.later)assert.ok(html.includes("60–90 min"));
    if(p.digest)assert.ok(html.includes("Antes do treino"));
  }
}

function visible(mealName,day){
  return NUTX.PLATES.filter(p=>p.meal===mealName&&p.items[day]).map(p=>NUTX.formatPlate(p,day,TGT[day][mealName==="Lanche da manhã"?"manha":"pre"])).join("\n");
}
for(const day of ["duro","normal","descanso"]){
  for(const meal of ["Lanche da manhã","Lanche pré-treino"]){
    const html=visible(meal,day);
    assert.ok(html.includes("barra de cereais de fruta"), meal+" "+day+" fruta");
    assert.ok(html.includes("barra de cereais integral com arando"), meal+" "+day+" arando");
    assert.ok(/banana/i.test(html), meal+" "+day+" banana");
    assert.ok(/clementina/i.test(html), meal+" "+day+" clementina");
    assert.ok(/tosta/i.test(html), meal+" "+day+" tosta");
  }
  assert.ok(/queijo cottage/i.test(visible("Lanche da manhã",day)));
}
assert.ok(/queijo cottage/i.test(visible("Lanche pré-treino","descanso")));
assert.ok(!/queijo cottage/i.test(visible("Lanche pré-treino","normal")));
assert.ok(!/queijo cottage/i.test(visible("Lanche pré-treino","duro")));

const app=fs.readFileSync("./app.js","utf8");
const sw=fs.readFileSync("./sw.js","utf8");
const html=fs.readFileSync("./index.html","utf8");
assert.ok(sw.includes('const C="k1-natal-v14"'));
assert.ok(!sw.includes("k1-natal-v13"));
assert.ok(sw.includes("./nut.js"));
assert.ok(html.includes('src="nut.js"'));
const src=app+fs.readFileSync("./mb.js","utf8")+fs.readFileSync("./nut.js","utf8");
for(const k of ["k1-natal-peso","k1-natal-registo","k1-wk","k1-gin-series","k1-historico","k1-mb-fav"])assert.ok(src.includes(k),k);
assert.ok(!/testosterona|AUT\b/i.test(fs.readFileSync("./nut.js","utf8")+app.slice(app.indexOf("snackNote")<0?0:0)));
assert.ok(!/testosterona|Nestlé|Continente|Auchan|Prozis|Gullón|Delic/i.test(fs.readFileSync("./nut.js","utf8")));

function grab(name){
  const line=app.split("\n").find(l=>l.startsWith("const "+name+"="));
  assert.ok(line,name);
  let expr=line.slice(("const "+name+"=").length);
  if(expr.endsWith(";"))expr=expr.slice(0,-1);
  return eval("("+expr+")");
}
const NUT=grab("NUT"),MEALS=grab("MEALS"),FOODS=grab("FOODS");
assert.deepStrictEqual(NUT.duro,{kcal:3160,p:170,h:440,g:80,lbl:NUT.duro.lbl});
assert.strictEqual(NUT.normal.kcal,2848);
assert.strictEqual(NUT.descanso.h,234);
const sumT=(day,i)=>MEALS.reduce((a,m)=>a+m.t[day][i],0);
assert.strictEqual(sumT("duro",0),440);assert.strictEqual(sumT("duro",1),170);assert.strictEqual(sumT("duro",2),80);
assert.strictEqual(sumT("normal",0),362);assert.strictEqual(sumT("normal",1),170);assert.strictEqual(sumT("normal",2),80);
assert.strictEqual(sumT("descanso",0),234);assert.strictEqual(sumT("descanso",1),170);assert.strictEqual(sumT("descanso",2),80);
const snap=MEALS.map(m=>({n:m.n,t:JSON.stringify(m.t),c:m.c.map(x=>x.n),h:m.h.slice(),p:m.p.slice(),g:m.g.slice()}));
NUTX.apply(MEALS,FOODS);
MEALS.forEach((m,i)=>{
  assert.strictEqual(JSON.stringify(m.t),snap[i].t);
  if(m.n!=="Lanche da manhã"&&m.n!=="Lanche pré-treino"){
    assert.deepStrictEqual(m.c.map(x=>x.n),snap[i].c);
    assert.deepStrictEqual(m.h,snap[i].h);
    assert.deepStrictEqual(m.p,snap[i].p);
    assert.deepStrictEqual(m.g,snap[i].g);
  }
});
const manha=MEALS.find(m=>m.n==="Lanche da manhã"),pre=MEALS.find(m=>m.n==="Lanche pré-treino");
for(const nome of ["Iogurte grego com maçã e amêndoas","Tostas com queijo fresco e fiambre","Bolachas de arroz com cottage","Banana + shake de whey (portátil)"])assert.ok(manha.c.some(c=>c.n===nome),nome);
for(const nome of ["Pão com mel e skyr","Bolachas de arroz, banana e whey","Tâmaras e iogurte grego (portátil)","Cereais com skyr"])assert.ok(pre.c.some(c=>c.n===nome),nome);
assert.ok(manha.h.includes(NUTX.CK));
assert.ok(pre.p.includes("Queijo cottage|—"));
assert.ok(!manha.h.some(k=>k.startsWith("Barra")));
assert.ok(!pre.h.some(k=>k.startsWith("Barra")));
assert.strictEqual(FOODS.h.find(f=>f.n==="Clementina").per,10);
assert.strictEqual(FOODS.h.find(f=>f.n==="Tostas").per,70);
assert.strictEqual(FOODS.h.find(f=>f.n==="Banana").per,21);
NUTX.apply(MEALS,FOODS);
assert.strictEqual(manha.c.filter(c=>c.pid==="manha-2fruta").length,1);

const same=[["Skyr",11,4,0.2],["Iogurte grego 0%",10,4,0],["Queijo cottage",12,3,4],["Banana",1.1,21,0.3],["Amêndoas",21,9,50],["Pão de mistura",9,50,2]];
for(const [n,P,H,G] of same){const f=MBF[MBI(n)];assert.strictEqual(f.P,P);assert.strictEqual(f.H,H);assert.strictEqual(f.G,G);}
const bf=MBF[MBI("Barra de cereais de fruta")],ba=MBF[MBI("Barra de cereais integral com arando")];
assert.strictEqual(bf.P,5.3);assert.strictEqual(bf.H,71.5);assert.strictEqual(bf.G,7.1);assert.strictEqual(bf.u,14.5);
assert.strictEqual(ba.P,5.9);assert.strictEqual(ba.H,79);assert.strictEqual(ba.G,3.2);assert.strictEqual(ba.u,21);
assert.strictEqual(MBF[MBI("Clementina")].H,10);
assert.strictEqual(MBF[MBI("Tostas")].H,70);
assert.strictEqual(mbQty(MBF[MBI("Ovo cozido")],50),"1 ovo (50 g)");
assert.strictEqual(mbQty(MBF[MBI("Ovo cozido")],100),"2 ovos (100 g)");
assert.strictEqual(mbQty(bf,14.5),"1 barra (14,5 g)");
assert.strictEqual(mbQty(bf,29),"2 barras (29 g)");
assert.strictEqual(mbQty(MBF[MBI("Clementina")],150),"2 clementinas (150 g)");
assert.strictEqual(mbQty(MBF[MBI("Tostas")],30),"3 tostas (30 g)");
assert.strictEqual(mbQty(MBF[MBI("Arroz branco")],200),"200 g");

function nearUnit(g,u){const n=g/u;assert.ok(Math.abs(n-Math.round(n))<1e-6,g+" / "+u);}
const lunch=mbSolve([MBI("Arroz branco"),MBI("Peito de frango"),MBI("Azeite")],{p:35,h:70,g:15});
assert.ok(isFinite(lunch.P)&&isFinite(lunch.H)&&isFinite(lunch.G)&&isFinite(lunch.K));
assert.ok(Math.abs(lunch.H-70)/70<0.2,lunch.H);
assert.ok(Math.abs(lunch.P-35)/35<0.25,lunch.P);
const egg=mbSolve([MBI("Ovo cozido"),MBI("Arroz branco")],{p:30,h:70,g:15});
nearUnit(egg.x[0],50);
const snack=mbSolve([MBI("Barra de cereais de fruta"),MBI("Skyr"),MBI("Banana")],{p:15,h:25,g:8});
nearUnit(snack.x[0],14.5);
assert.ok(snack.x[0]>=14.5&&snack.x[0]<=14.5*4);
assert.ok(isFinite(snack.K)&&snack.P>0&&snack.H>0);
const built=mbSolve([MBI("Barra de cereais integral com arando"),MBI("Queijo cottage"),MBI("Tostas"),MBI("Clementina")],{p:15,h:25,g:8});
nearUnit(built.x[0],21);
nearUnit(built.x[2],10);
nearUnit(built.x[3],75);
assert.ok(built.x.every(v=>isFinite(v)));

console.log("nut.test.js ok", Object.keys(GOLD).length, "placas");
