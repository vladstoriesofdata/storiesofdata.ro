// The five charts use the original slideshow's data, geometry and transition timings.
export async function initCfoHero() {
  const root = document.querySelector('[data-cfo-hero]');
  if (!root) return;
  if (!window.d3) await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
    script.onload = resolve; script.onerror = reject; document.head.append(script);
  });
  const d3 = window.d3, ro = root.dataset.locale === 'ro';
  const ink = '#14213D', muted = '#565F73', red = '#B23A3A', amber = '#C6801B';
  const el = root.querySelector('#capability-inner');
  const labels = ro ? ['Benchmark creștere venituri','EBITDA% vs target','Alertă Cash Balance','Reconciliere','Realizat vs. buget'] : ['Revenue growth benchmark','EBITDA% vs target','Cash Balance alert','Reconciliation','Actual vs. budget'];
  const descriptions = ro ? [
    'Vezi rata ta de creștere alături de media pieței, nu izolat.',
    'Urmărește marja față de target-ul pe care l-ai stabilit, actualizat automat.',
    'Fii avertizat cu luni înainte ca soldul să scadă sub prag, nu după.',
    'Vezi momentul în care sistemele tale încep să nu mai fie de acord, înainte să devină o problemă reală.',
    'Află încă din timpul lunii dacă ești peste sau sub plan.',
  ] : ['See your growth rate alongside the market average, in context.','Track your margin against your target, updated automatically.','Get warned months before your balance falls below the threshold.','See when your systems start to disagree, before it becomes a real problem.','Know during the month whether you are above or below plan.'];
  const textStyle = (s, size = 9) => s.attr('font-family','IBM Plex Mono, monospace').attr('font-size',size).attr('fill',ink);
  function render(index) {
    const width = el.clientWidth || 260;
    if (index === 0) {
      const data = [{label:ro?'Compania ta':'Your company',value:2,color:'#6E6E7D'},{label:ro?'Media pieței':'Market average',value:4,color:'#C7CAD1'}];
      const x = d3.scaleLinear().domain([0,5.2]).range([0,width-126]);
      const svg = d3.select(el).append('svg').attr('width',width).attr('height',62);
      data.forEach((item,i) => {
        const g = svg.append('g').attr('transform',`translate(96,${i*28+8})`);
        g.append('text').attr('x',-8).attr('y',12).attr('text-anchor','end').attr('font-family','Inter, sans-serif').attr('font-size',10).attr('fill',ink).text(item.label);
        g.append('rect').attr('height',13).attr('width',0).attr('fill',item.color).attr('rx',2).transition().delay(100+i*150).duration(700).ease(d3.easeCubicOut).attr('width',x(item.value));
        textStyle(g.append('text').attr('x',6).attr('y',10).attr('opacity',0),10).attr('font-weight',600).text('0%').transition().delay(100+i*150).duration(700).ease(d3.easeCubicOut).attr('opacity',1).attr('x',x(item.value)+6).tween('text',function(){const n=d3.interpolateNumber(0,item.value);return t=>this.textContent=n(t).toFixed(1)+'%';});
      });
    } else if (index === 1 || index === 4) {
      const budget = index === 4, current = budget ? 96 : 18;
      el.innerHTML = `<p class="mini-kpi">0%</p><span class="mini-delta ${budget?'pos':'neg'}">${budget?(ro?'din bugetul lunii curente':'of this month’s budget'):'vs 22% target'}</span>${budget?'<div class="mini-track"><div class="mini-fill"></div></div>':'<div class="ebitda-chart"></div>'}`;
      d3.select(el.querySelector('.mini-kpi')).transition().delay(100).duration(700).tween('text',function(){const n=d3.interpolateNumber(0,current);return t=>this.textContent=Math.round(n(t))+'%';});
      if (budget) d3.select(el.querySelector('.mini-fill')).style('background',amber).transition().delay(100).duration(700).ease(d3.easeCubicOut).style('width','96%');
      else {
        const x=d3.scaleLinear().domain([0,30]).range([4,width-4]);
        const svg=d3.select(el.querySelector('.ebitda-chart')).append('svg').attr('width',width).attr('height',34);
        svg.append('rect').attr('x',4).attr('y',10).attr('height',10).attr('width',0).attr('fill',red).attr('rx',2).transition().delay(100).duration(700).ease(d3.easeCubicOut).attr('width',x(18)-4);
        const marker=svg.append('g').attr('opacity',0);
        marker.append('line').attr('x1',x(22)).attr('x2',x(22)).attr('y1',4).attr('y2',26).attr('stroke',ink).attr('stroke-width',1.4).attr('stroke-dasharray','2 2');
        textStyle(marker.append('text').attr('x',x(22)).attr('y',34).attr('text-anchor','middle'),8).attr('fill',muted).text('target');
        marker.transition().delay(600).duration(300).attr('opacity',1);
      }
    } else {
      const cash=index===2, height=110, right=cash?8:68;
      const a=cash?Array.from({length:5},(_,i)=>170/Math.pow(.955,4-i)):[2020,2140,2080,2260,2350,2400];
      const b=cash?Array.from({length:5},(_,i)=>170*Math.pow(.955,i)):[2010,2110,2020,2150,2190,2200];
      const all=cash?a.concat(b.slice(1)):a.concat(b), count=cash?9:6;
      const x=d3.scaleLinear().domain([0,count-1]).range([4,width-right]);
      const y=d3.scaleLinear().domain([Math.min(...all,cash?150:Infinity)*(cash?.92:.97),Math.max(...all)*(cash?1.08:1.03)]).range([94,8]);
      const svg=d3.select(el).append('svg').attr('width',width).attr('height',height);
      const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'].slice(0,count);
      svg.append('g').attr('class','axis').attr('transform','translate(0,94)').call(d3.axisBottom(d3.scalePoint().domain(months).range([4,width-right])).tickValues([months[0],months[cash?4:2],months[count-1]]).tickSize(0));
      if(cash){
        const id='capCashGrad_'+Date.now();
        const grad=svg.append('defs').append('linearGradient').attr('id',id).attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1');
        grad.append('stop').attr('offset','0%').attr('stop-color',ink).attr('stop-opacity',.2); grad.append('stop').attr('offset','100%').attr('stop-color',ink).attr('stop-opacity',0);
        svg.append('path').datum(a).attr('d',d3.area().x((_,i)=>x(i)).y0(94).y1(y).curve(d3.curveMonotoneX)).attr('fill',`url(#${id})`).attr('opacity',0).transition().delay(100).duration(500).attr('opacity',1);
        svg.append('line').attr('x1',4).attr('x2',width-right).attr('y1',y(150)).attr('y2',y(150)).attr('stroke',red).attr('stroke-dasharray','3 3');
      } else svg.append('path').datum(a).attr('d',d3.area().x((_,i)=>x(i)).y0((_,i)=>y(b[i])).y1(y).curve(d3.curveMonotoneX)).attr('fill',red).attr('fill-opacity',.12).attr('opacity',0).transition().delay(400).duration(500).attr('opacity',1);
      const path=svg.append('path').datum(a).attr('d',d3.line().x((_,i)=>x(i)).y(y).curve(d3.curveMonotoneX)).attr('fill','none').attr('stroke',ink).attr('stroke-width',2);
      const length=path.node().getTotalLength(); path.attr('stroke-dasharray',`${length} ${length}`).attr('stroke-dashoffset',length).transition().delay(100).duration(600).ease(d3.easeLinear).attr('stroke-dashoffset',0);
      svg.append('path').datum(b).attr('d',d3.line().x((_,i)=>x(i+(cash?4:0))).y(y).curve(d3.curveMonotoneX)).attr('fill','none').attr('stroke',amber).attr('stroke-width',2).attr('stroke-dasharray',cash?'4 3':'4 3').attr('opacity',0).transition().delay(cash?700:600).duration(400).attr('opacity',1);
      const notes=svg.append('g').attr('opacity',0);
      if(cash){
        svg.append('circle').attr('cx',x(4)).attr('cy',y(170)).attr('r',0).attr('fill',ink).transition().delay(650).duration(200).attr('r',3);
        const bx=x(7), near=bx>width-right-55;
        notes.append('line').attr('x1',bx).attr('x2',bx).attr('y1',8).attr('y2',94).attr('stroke',red).attr('stroke-width',1.2).attr('stroke-dasharray','2 3');
        textStyle(notes.append('text').attr('x',bx+(near?-5:5)).attr('y',16).attr('text-anchor',near?'end':'start'),8).attr('font-weight',600).attr('fill',red).text(ro?'prag depășit':'threshold crossed');
      } else {
        textStyle(notes.append('text').attr('x',x(5)+6).attr('y',y(a[5])+3)).attr('font-weight',600).text('SAGA');
        textStyle(notes.append('text').attr('x',x(5)+6).attr('y',y(b[5])+3)).attr('font-weight',600).attr('fill',amber).text(ro?'CRM-ul tău':'Your CRM');
      }
      notes.transition().delay(cash?1100:1000).duration(300).attr('opacity',1);
    }
  }
  let active=0, timer;
  const dots=labels.map((label,i)=>{const button=document.createElement('button');button.type='button';button.className='cap-dot';button.setAttribute('aria-label',label);button.addEventListener('click',()=>{if(i===active)return;active=i;show(i);restart();});root.querySelector('#cap-dots').append(button);return button;});
  function show(i){
    for(const [selector,value] of [['#cap-eyebrow',labels[i]],['#cap-text',descriptions[i]]]) d3.select(root.querySelector(selector)).interrupt().transition().duration(200).style('opacity',0).on('end',function(){this.textContent=value;d3.select(this).transition().duration(200).style('opacity',1);});
    d3.select(el).interrupt().transition().duration(250).style('opacity',0).on('end',()=>{el.innerHTML='';render(i);d3.select(el).transition().duration(250).style('opacity',1);});
    dots.forEach((dot,j)=>{dot.classList.toggle('active',j===i);dot.setAttribute('aria-pressed',String(j===i));});
  }
  function restart(){clearInterval(timer);timer=setInterval(()=>{active=(active+1)%5;show(active);},5000);}
  show(0); if(!matchMedia('(prefers-reduced-motion: reduce)').matches)restart();
}
