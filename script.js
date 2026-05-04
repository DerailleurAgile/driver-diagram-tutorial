// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════
const EXAMPLE = {
  aim: "Increase students earning college math credit within one year from 5% to 50%",
  primaryDrivers: [
    {
      id: "pd1", label: "Instructional systems",
      sub: "Year-long pathway around college-level content",
      secondaryDrivers: [
        { id: "sd1", label: "Reduce transitions and sustain enrollment across semesters", changeIdeas: [
          { id: "ci1", label: "Opening lessons engage interest and assure early success" },
          { id: "ci2", label: "Direct interventions to influence student mindsets" }
        ]},
        { id: "sd2", label: "Deliberate focus on \u201cstarting strong\u201d", changeIdeas: [
          { id: "ci3", label: "Real-time tracking data for possible student disengagement" }
        ]}
      ]
    },
    {
      id: "pd2", label: "Productive persistence",
      sub: "Students persist through challenges using effective strategies",
      secondaryDrivers: [
        { id: "sd3", label: "Promote students' ties to peers, faculty, and pathway", changeIdeas: [
          { id: "ci4", label: "Week 1 activities to establish supportive classroom connections" },
          { id: "ci5", label: "Develop supportive classroom norms for productive struggle" }
        ]},
        { id: "sd4", label: "Create math that matters: course material students see as valuable", changeIdeas: [
          { id: "ci6", label: "Professional development on \u201cstarting strong\u201d" }
        ]}
      ]
    },
    {
      id: "pd3", label: "Language and literacy",
      sub: "Students can understand problems, reason mathematically, communicate results",
      secondaryDrivers: [
        { id: "sd5", label: "Enhance faculty skills and beliefs regarding student engagement", changeIdeas: [
          { id: "ci7", label: "Faculty learning communities focused on student thinking" }
        ]}
      ]
    },
    {
      id: "pd4", label: "Advancing teaching",
      sub: "Implement effective teaching within two years of pathway adoption",
      secondaryDrivers: [
        { id: "sd6", label: "Build shared instructional practices across the network", changeIdeas: [
          { id: "ci8", label: "Structured lesson study cycles using network protocols" }
        ]}
      ]
    }
  ]
};

const BLANK = {
  aim: "Your aim statement here",
  primaryDrivers: [
    {
      id: "pd1", label: "Primary driver 1",
      sub: "What system condition must change?",
      secondaryDrivers: [
        { id: "sd1", label: "Secondary driver 1a", changeIdeas: [
          { id: "ci1", label: "Change idea" }
        ]}
      ]
    }
  ]
};

let buildState = JSON.parse(JSON.stringify(EXAMPLE));

// ═══════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('active', (i===0&&tab==='learn')||(i===1&&tab==='build')));
  document.getElementById('learn-panel').classList.toggle('active', tab==='learn');
  document.getElementById('build-panel').classList.toggle('active', tab==='build');
  if (tab === 'build') renderBuild();
}

// ═══════════════════════════════════════════════════════════
// LEARN STEPS
// ═══════════════════════════════════════════════════════════
let currentStep = 0;
const STEPS = [
  {
    title: "The worked example",
    text: "We will build a Driver Diagram using a real example from <em>Learning to Improve</em> (Bryk et al., 2015). The problem: in community colleges, only 5% of developmental math students earned college-level math credit within one year. Step through to see how an improvement team mapped their theory of change."
  },
  {
    title: "Step 1 — The Aim",
    text: "The Aim anchors the entire diagram. A good aim is precise: it names <em>what</em>, <em>how much</em>, <em>for whom</em>, and <em>by when</em>. Vague aims produce vague theories. Notice that 5% → 50% is a specific, measurable commitment — not aspirational language."
  },
  {
    title: "Step 2 — Primary Drivers",
    text: "Primary drivers are the major system conditions that, if changed, would move the aim. They are <em>not</em> activities — they name the state of the system you need to change. The team identified four: the design of instruction, student persistence, language skills, and teaching practice."
  },
  {
    title: "Step 3 — Secondary Drivers",
    text: "Secondary drivers make primary drivers actionable. Each one belongs to a single primary driver and names a more specific condition to change. Together they form a <em>nested theory</em>: if these secondary conditions improve, the primary driver improves, and the aim moves."
  },
  {
    title: "Step 4 — Change Ideas",
    text: "Change ideas are concrete, testable interventions. They are hypotheses, not instructions. Each change idea feeds a PDSA cycle: Plan (predict the change), Do (try it small), Study (compare prediction to result), Act (adapt). The diagram shows where each idea sits in the theory — so you know what you are testing."
  },
  {
    title: "Step 5 — The full theory",
    text: "Every arrow reads right-to-left: <em>if this change idea activates this secondary driver, which shifts this primary driver, the aim improves</em>. The full diagram is the team's shared theory of improvement — visible, challengeable, and testable. Switch to the <strong>Build</strong> tab to construct your own."
  }
];

function renderLearn() {
  const body = document.getElementById('learn-body');
  const data = EXAMPLE;

  const showAim = currentStep >= 1;
  const showPd  = currentStep >= 2;
  const showSd  = currentStep >= 3;
  const showCi  = currentStep >= 4;

  let html = '';

  // Aim column
  html += `<div class="col-aim">
    <div class="node node-aim ${showAim?'visible':'hidden'}" id="learn-aim">
      <span class="node-label" style="font-size:11px;letter-spacing:.05em;text-transform:uppercase;font-family:var(--font-sans);">Aim</span>
      ${data.aim}
    </div>
  </div>`;

  html += `<div class="col-gap"></div>`;

  // PD column
  html += `<div class="col-pd">`;
  data.primaryDrivers.forEach(pd => {
    html += `<div class="node node-pd ${showPd?'visible':'hidden'}" id="learn-${pd.id}">
      <span class="node-label">${pd.label}</span>
      <span class="node-sub">${pd.sub}</span>
    </div>`;
  });
  html += `</div>`;

  html += `<div class="col-gap"></div>`;

  // SD column - remove the extra margin-bottom from inner containers to keep distribution even
  html += `<div class="col-sd">`;
  data.primaryDrivers.forEach(pd => {
    html += `<div class="col-sd-inner">`; // Removed manual gap adjustments here
    pd.secondaryDrivers.forEach(sd => {
      html += `<div class="node node-sd ${showSd?'visible':'hidden'}" id="learn-${sd.id}">${sd.label}</div>`;
    });
    html += `</div>`;
  });
  html += `</div>`;

  html += `<div class="col-gap"></div>`;

  // CI column - ensure the inner containers don't throw off the vertical centering
  html += `<div class="col-ci">`;
  data.primaryDrivers.forEach(pd => {
    html += `<div class="col-ci-inner">`; // Removed manual 'margin-bottom: 14px'
    pd.secondaryDrivers.forEach(sd => {
      sd.changeIdeas.forEach(ci => {
        html += `<div class="node node-ci ${showCi?'visible':'hidden'} ${showCi?'node-highlight':''}" id="learn-${ci.id}">${ci.label}</div>`;
      });
    });
    html += `</div>`;
  });
  html += `</div>`;

  body.innerHTML = html;

  // Draw arrows and apply highlights
  requestAnimationFrame(() => requestAnimationFrame(() => {
      HIGHLIGHT_PATH.forEach(id => {
        const el = document.getElementById('learn-' + id);
        if (el) el.classList.add('node-highlight');
      });
      
      drawArrows('learn', showAim, showPd, showSd, showCi, data);

      // AUTO-FOCUS SCROLL
      if (currentStep > 0) {
        const visibleNodes = document.querySelectorAll('#learn-panel .node.visible');
        if (visibleNodes.length > 0) {
          // We target the last node because the diagram flows left-to-right
          visibleNodes[visibleNodes.length - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest', // Prevents jumping vertically
            inline: 'center'  // Centers the new node/column horizontally
          });
        }
      }
  }));
}

// Nodes belonging to the highlighted example path in Learn mode
const HIGHLIGHT_PATH = new Set(['aim', 'pd2', 'sd2', 'ci3']);

function drawArrows(prefix, showAim, showPd, showSd, showCi, data) {
  const svg = document.getElementById(prefix + '-arrows');
  const canvas = document.getElementById(prefix + '-canvas');

  const w = canvas.scrollWidth;
  const h = canvas.scrollHeight;
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.style.width = w + 'px';
  svg.style.height = h + 'px';
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const cr = canvas.getBoundingClientRect();
  const arrowColor = '#b0aaa0';
  const highlightColor = '#6b7c93';

  // Marker setup: Triangle is 10px wide. 
  // refX=0 means the line stops at the vertical base of the triangle.
  svg.innerHTML = `<defs>
    <marker id="ah-${prefix}" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 Z" fill="${arrowColor}" />
    </marker>
    <marker id="ah-hl-${prefix}" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 Z" fill="${highlightColor}" />
    </marker>
  </defs>
  <g id="${prefix}-base-layer"></g>
  <g id="${prefix}-highlight-layer"></g>`;

  const baseLayer = document.getElementById(`${prefix}-base-layer`);
  const highlightLayer = document.getElementById(`${prefix}-highlight-layer`);

  function rel(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      left: r.left - cr.left,
      right: r.right - cr.left,
      cy: (r.top + r.height / 2) - cr.top
    };
  }

  function curve(x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }

  function arrow(fromId, toId, fromEl, toEl, show, forceHighlight = false) {
    if (!fromEl || !toEl || !show) return;

    // Check if this specific connection is part of the predefined highlight path
    const isPathHighlight = prefix === 'learn' && HIGHLIGHT_PATH.has(fromId) && HIGHLIGHT_PATH.has(toId);
    const isHighlight = isPathHighlight || forceHighlight;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // POSITION FIX: The marker is 10 units wide in its viewBox.
    // By ending the line at +10, the triangle base starts at +10 and the tip 
    // reaches exactly to +0 (the node's right edge).
    path.setAttribute('d', curve(fromEl.left, fromEl.cy, toEl.right + 10, toEl.cy));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', isHighlight ? highlightColor : arrowColor);
    path.setAttribute('stroke-width', isHighlight ? '2.2' : '1.2');
    path.setAttribute('marker-end', `url(#ah-${isHighlight ? 'hl-' : ''}${prefix})`);

    if (isHighlight) {
      highlightLayer.appendChild(path);
    } else {
      baseLayer.appendChild(path);
    }
  }

  // --- CONNECTIVITY LOGIC ---
  const aimEl = rel(document.getElementById(prefix + '-aim'));

  if (prefix === 'learn') {
    // 1) PDs to Aim
    data.primaryDrivers.forEach(pd => {
      const pdEl = rel(document.getElementById('learn-' + pd.id));
      arrow(pd.id, 'aim', pdEl, aimEl, showAim && showPd);
    });

    // 2) Strong Start to Productive Persistence (Highlighted)
    const sd2El = rel(document.getElementById('learn-sd2'));
    const pd2El = rel(document.getElementById('learn-pd2'));
    arrow('sd2', 'pd2', sd2El, pd2El, showPd && showSd);

    // 3) ALL Change Ideas to Strong Start (All Highlighted)
    data.primaryDrivers.forEach(pd => {
      pd.secondaryDrivers.forEach(sd => {
        sd.changeIdeas.forEach(ci => {
          const ciEl = rel(document.getElementById('learn-' + ci.id));
          // Passing 'true' as the last argument forces these to highlight
          arrow(ci.id, 'sd2', ciEl, sd2El, showSd && showCi, true);
        });
      });
    });
  } else {
    // BUILD Mode logic
    data.primaryDrivers.forEach(pd => {
      const pdEl = rel(document.getElementById('build-' + pd.id));
      arrow(pd.id, 'aim', pdEl, aimEl, true);
      pd.secondaryDrivers.forEach(sd => {
        const sdEl = rel(document.getElementById('build-' + sd.id));
        arrow(sd.id, pd.id, sdEl, pdEl, true);
        sd.changeIdeas.forEach(ci => {
          const ciEl = rel(document.getElementById('build-' + ci.id));
          arrow(ci.id, sd.id, ciEl, sdEl, true);
        });
      });
    });
  }
}

function updateStep() {
  const s = STEPS[currentStep];
  document.getElementById('step-desc').innerHTML = `<h3>${s.title}</h3><p>${s.text}</p>`;
  document.getElementById('step-label').textContent = `Step ${currentStep} of ${STEPS.length-1}`;
  document.getElementById('prev-btn').disabled = currentStep === 0;
  document.getElementById('next-btn').disabled = currentStep === STEPS.length-1;
  renderLearn();
}

function nextStep() { if (currentStep < STEPS.length-1) { currentStep++; updateStep(); } }
function prevStep() { if (currentStep > 0) { currentStep--; updateStep(); } }

// ═══════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════
function uid() { return 'n'+Math.random().toString(36).slice(2,7); }

function renderBuild() {
  const body = document.getElementById('build-body');
  const data = buildState;
  let html = '';

  // Aim - Use 'build-' prefix
  html += `<div class="col-aim">
    <div class="node node-aim visible" id="build-aim" contenteditable="true" spellcheck="false" oninput="buildState.aim=this.innerText;drawArrows('build',true,true,true,true,buildState)">
      <span class="node-label" style="font-size:10px;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-sans);font-style:normal;">Aim</span>
      ${escHtml(data.aim)}
    </div>
  </div>`;

  html += `<div class="col-gap"></div>`;

  // PD - Use 'build-' prefix
  html += `<div class="col-pd">`;
  data.primaryDrivers.forEach((pd,pi) => {
    html += `<div class="node node-pd visible" id="build-${pd.id}" contenteditable="true" spellcheck="false" oninput="buildState.primaryDrivers[${pi}].label=this.innerText;drawArrows('build',true,true,true,true,buildState)">
      <div class="node-controls">
        <button class="node-btn" title="Delete" onclick="deletePD(${pi})">×</button>
      </div>
      ${escHtml(pd.label)}
    </div>`;
  });
  html += `<button class="add-btn" onclick="addPD()">+ Add primary driver</button>`;
  html += `</div>`;

  // ... (Follow the same pattern for SD and CI using 'build-' prefix for IDs)
  // ...

  body.innerHTML = html;
  requestAnimationFrame(() => requestAnimationFrame(() => drawArrows('build', true, true, true, true, buildState)));
}

function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function addPD() {
  buildState.primaryDrivers.push({ id:uid(), label:'New primary driver', sub:'', secondaryDrivers:[{ id:uid(), label:'New secondary driver', changeIdeas:[{id:uid(),label:'Change idea'}] }] });
  renderBuild();
}
function deletePD(pi) { if(buildState.primaryDrivers.length>1){ buildState.primaryDrivers.splice(pi,1); renderBuild(); } }
function addSD(pi) { buildState.primaryDrivers[pi].secondaryDrivers.push({id:uid(),label:'New secondary driver',changeIdeas:[{id:uid(),label:'Change idea'}]}); renderBuild(); }
function deleteSD(pi,si) { if(buildState.primaryDrivers[pi].secondaryDrivers.length>1){ buildState.primaryDrivers[pi].secondaryDrivers.splice(si,1); renderBuild(); } }
function addCI(pi,si) { buildState.primaryDrivers[pi].secondaryDrivers[si].changeIdeas.push({id:uid(),label:'New change idea'}); renderBuild(); }
function deleteCI(pi,si,cii) { if(buildState.primaryDrivers[pi].secondaryDrivers[si].changeIdeas.length>1){ buildState.primaryDrivers[pi].secondaryDrivers[si].changeIdeas.splice(cii,1); renderBuild(); } }
function loadExample() { buildState=JSON.parse(JSON.stringify(EXAMPLE)); renderBuild(); }
function loadBlank()   { buildState=JSON.parse(JSON.stringify(BLANK));   renderBuild(); }

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════
function exportJSON() {
  const blob = new Blob([JSON.stringify(buildState, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='driver-diagram.json'; a.click();
}

function exportImage() {
  const canvas = document.getElementById('build-canvas');
  // Hide controls
  document.querySelectorAll('.node-controls,.add-btn').forEach(el=>el.style.display='none');
  html2canvas(canvas, { backgroundColor:'#fafaf8', scale:2, useCORS:true }).then(c=>{
    document.querySelectorAll('.node-controls').forEach(el=>el.style.display='');
    document.querySelectorAll('.add-btn').forEach(el=>el.style.display='');
    const a=document.createElement('a'); a.download='driver-diagram.png'; a.href=c.toDataURL('image/png'); a.click();
  });
}



// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
updateStep();
window.addEventListener('keydown', (e) => {
  // Only trigger if we are in the 'learn' panel
  const isLearnActive = document.getElementById('learn-panel').classList.contains('active');
  
  if (isLearnActive) {
    if (e.key === 'ArrowRight') {
      nextStep();
    } else if (e.key === 'ArrowLeft') {
      prevStep();
    }
  }
});