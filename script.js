// ═══════════════════════════════════════════════════════════
// LEARN DATA — nested structure, read-only
// ═══════════════════════════════════════════════════════════
const EXAMPLE_NESTED = {
  aim: "Increase students earning college math credit within one year from 5% to 50%",
  primaryDrivers: [
    {
      id: "pd1", label: "Instructional systems",
      sub: "Year-long pathway around college-level content",
      secondaryDrivers: [
        { id: "sd1", label: "Reduce transitions and sustain enrollment across semesters", changeIdeas: [] }
      ]
    },
    {
      id: "pd2", label: "Productive persistence",
      sub: "Students persist through challenges using effective strategies",
      secondaryDrivers: [
        { id: "sd2", label: "Deliberate focus on \u201cstarting strong\u201d", changeIdeas: [
          { id: "ci1", label: "Opening lessons engage interest and assure early success" },
          { id: "ci2", label: "Direct interventions to influence student mindsets" },
          { id: "ci3", label: "Real-time tracking data for possible student disengagement" },
          { id: "ci4", label: "Week 1 activities to establish supportive classroom connections" },
          { id: "ci5", label: "Develop supportive classroom norms for productive struggle" },
          { id: "ci6", label: "Professional development on \u201cstarting strong\u201d" }
        ]},
        { id: "sd3", label: "Promote students\u2019 ties to peers, faculty, and pathway", changeIdeas: [] }
      ]
    },
    {
      id: "pd3", label: "Language and literacy",
      sub: "Students can understand problems, reason mathematically, communicate results",
      secondaryDrivers: [
        { id: "sd5", label: "Enhance faculty skills and beliefs regarding student engagement", changeIdeas: [] }
      ]
    },
    {
      id: "pd4", label: "Advancing teaching",
      sub: "Implement effective teaching within two years of pathway adoption",
      secondaryDrivers: [
        { id: "sd6", label: "Build shared instructional practices across the network", changeIdeas: [] }
      ]
    }
  ]
};

// Nodes in the highlighted example path (Learn tab)
const HIGHLIGHT_PATH = new Set(['aim', 'pd2', 'sd2', 'ci1', 'ci2', 'ci3', 'ci4', 'ci5', 'ci6']);

// ═══════════════════════════════════════════════════════════
// BUILD DATA — flat structure with explicit parent links
// ═══════════════════════════════════════════════════════════

// Convert nested EXAMPLE_NESTED → flat buildState
function nestedToFlat(nested) {
  const state = {
    aim: nested.aim,
    primaryDrivers: [],
    secondaryDrivers: [],
    changeIdeas: []
  };
  nested.primaryDrivers.forEach(pd => {
    state.primaryDrivers.push({ id: pd.id, label: pd.label });
    pd.secondaryDrivers.forEach(sd => {
      state.secondaryDrivers.push({ id: sd.id, label: sd.label, parentId: pd.id });
      sd.changeIdeas.forEach(ci => {
        state.changeIdeas.push({ id: ci.id, label: ci.label, parentId: sd.id });
      });
    });
  });
  return state;
}

const BLANK_FLAT = {
  aim: "Your aim statement here",
  primaryDrivers: [
    { id: "pd1", label: "Primary driver 1" }
  ],
  secondaryDrivers: [
    { id: "sd1", label: "Secondary driver 1", parentId: "pd1" }
  ],
  changeIdeas: [
    { id: "ci1", label: "Change idea 1", parentId: "sd1" }
  ]
};

let buildState = nestedToFlat(EXAMPLE_NESTED);

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════
function uid() { return 'n' + Math.random().toString(36).slice(2, 7); }

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', (i === 0 && tab === 'learn') || (i === 1 && tab === 'build'))
  );
  document.getElementById('learn-panel').classList.toggle('active', tab === 'learn');
  document.getElementById('build-panel').classList.toggle('active', tab === 'build');
  if (tab === 'build') renderBuild();
}

// ═══════════════════════════════════════════════════════════
// LEARN — step-through rendering (uses nested EXAMPLE_NESTED)
// ═══════════════════════════════════════════════════════════
let currentStep = 0;

const STEPS = [
  {
    title: "The worked example",
    text: "We will build a Driver Diagram using a real example from <em>Learning to Improve</em> (Bryk et al., 2015). The problem: in community colleges, only 5% of developmental math students earned college-level math credit within one year. Step through to see how an improvement team mapped their theory of change."
  },
  {
    title: "Step 1 — The Aim",
    text: "The <strong>Aim</strong> anchors the entire diagram. A good aim is precise: it names <em>what</em>, <em>how much</em>, <em>for whom</em>, and <em>by when</em>. Vague aims produce vague theories. Notice that 5% \u2192 50% is a specific, measurable commitment, not aspirational language."
  },
  {
    title: "Step 2 — Primary Drivers",
    text: "<strong>Primary drivers</strong> are the major system conditions that, if changed, would move toward the AIM. They are <em>not</em> activities: they name the state of the system you need to change. The team identified four: the design of instruction, student persistence, language skills, and teaching practice."
  },
  {
    title: "Step 3 — Secondary Drivers",
    text: "<strong>Secondary drivers</strong> make primary drivers actionable. Each one belongs to a single primary driver and names a more specific condition to change. Together they form a <em>nested theory</em>: if these secondary conditions improve, the primary driver improves, and the system moves toward the AIM."
  },
  {
    title: "Step 4 — Change Ideas",
    text: "<strong>Change ideas</strong> are concrete, testable interventions that we use to build knowledge about what it takes to improve the system. Each feeds a <strong>PDSA cycle:</strong> Plan (predict the change), Do (try it small), Study (compare prediction to result), Act (iterate/adapt/abandon in response to what's learned). The diagram shows where each idea sits in the theory, so you know exactly what you are testing and why."
  },
  {
    title: "Step 5 — The full theory",
    text: "Every arrow reads right-to-left: <em>if this change idea activates this secondary driver, which shifts this primary driver, the aim improves</em>. The full diagram is the team\u2019s shared theory of improvement \u2014 visible, challengeable, and testable. Switch to the <strong>Build</strong> tab to construct your own."
  }
];

function renderLearn() {
  const data = EXAMPLE_NESTED;
  const showAim = currentStep >= 1;
  const showPd  = currentStep >= 2;
  const showSd  = currentStep >= 3;
  const showCi  = currentStep >= 4;

  let html = '';

  // Aim
  html += `<div class="col-aim">
    <div class="node node-aim ${showAim ? 'visible' : 'hidden'}" id="learn-aim">
      <span class="node-label" style="font-size:11px;letter-spacing:.05em;text-transform:uppercase;font-family:var(--font-sans);">Aim</span>
      ${escHtml(data.aim)}
    </div>
  </div>`;

  html += `<div class="col-gap"></div>`;

  // Primary drivers
  html += `<div class="col-pd">`;
  data.primaryDrivers.forEach(pd => {
    html += `<div class="node node-pd ${showPd ? 'visible' : 'hidden'}" id="learn-${pd.id}">
      <span class="node-label">${escHtml(pd.label)}</span>
      <span class="node-sub">${escHtml(pd.sub)}</span>
    </div>`;
  });
  html += `</div>`;

  html += `<div class="col-gap"></div>`;

  // Secondary drivers
  html += `<div class="col-sd">`;
  data.primaryDrivers.forEach(pd => {
    html += `<div class="col-sd-inner">`;
    pd.secondaryDrivers.forEach(sd => {
      html += `<div class="node node-sd ${showSd ? 'visible' : 'hidden'}" id="learn-${sd.id}">${escHtml(sd.label)}</div>`;
    });
    html += `</div>`;
  });
  html += `</div>`;

  html += `<div class="col-gap"></div>`;

  // Change ideas — only render SDs that have CIs
  html += `<div class="col-ci">`;
  data.primaryDrivers.forEach(pd => {
    pd.secondaryDrivers.forEach(sd => {
      if (sd.changeIdeas.length === 0) return;
      html += `<div class="col-ci-inner">`;
      sd.changeIdeas.forEach(ci => {
        html += `<div class="node node-ci ${showCi ? 'visible' : 'hidden'}" id="learn-${ci.id}">${escHtml(ci.label)}</div>`;
      });
      html += `</div>`;
    });
  });
  html += `</div>`;

  document.getElementById('learn-body').innerHTML = html;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    // Highlight the example path
    HIGHLIGHT_PATH.forEach(id => {
      const el = document.getElementById('learn-' + id);
      if (el) el.classList.add('node-highlight');
    });
    drawLearnArrows(showAim, showPd, showSd, showCi, data);
    // Scroll last visible node into view
    if (currentStep > 0) {
      const visible = document.querySelectorAll('#learn-panel .node.visible');
      if (visible.length > 0) {
        visible[visible.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }));
}

function updateStep() {
  const s = STEPS[currentStep];
  document.getElementById('step-desc').innerHTML = `<h3>${s.title}</h3><p>${s.text}</p>`;
  document.getElementById('step-label').textContent = `Step ${currentStep} of ${STEPS.length - 1}`;
  document.getElementById('prev-btn').disabled = currentStep === 0;
  document.getElementById('next-btn').disabled = currentStep === STEPS.length - 1;
  renderLearn();
}

function nextStep() { if (currentStep < STEPS.length - 1) { currentStep++; updateStep(); } }
function prevStep() { if (currentStep > 0) { currentStep--; updateStep(); } }

// ═══════════════════════════════════════════════════════════
// BUILD — flat model with explicit parent-link dropdowns
// ═══════════════════════════════════════════════════════════
function renderBuild() {
  const data = buildState;
  let html = '';

  // Aim
  html += `<div class="col-aim">
    <div class="node node-aim visible" id="build-aim"
         contenteditable="true" spellcheck="false"
         oninput="buildState.aim = this.innerText; scheduleBuildArrows()">
      <span class="node-label" style="font-size:10px;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-sans);font-style:normal;">Aim</span>
      ${escHtml(data.aim)}
    </div>
  </div>`;

  html += `<div class="col-gap"></div>`;

  // Primary drivers
  html += `<div class="col-pd">`;
  data.primaryDrivers.forEach((pd, pi) => {
    html += `<div class="node node-pd visible" id="build-${pd.id}"
      contenteditable="true" spellcheck="false"
      oninput="buildState.primaryDrivers[${pi}].label = this.innerText; refreshLinkSelects(); scheduleBuildArrows()">
      <div class="node-controls">
        <button class="node-btn" title="Delete primary driver" onclick="deletePD('${pd.id}')">×</button>
      </div>
      ${escHtml(pd.label)}
    </div>`;
  });
  html += `<button class="add-btn" onclick="addPD()">+ Add primary driver</button>`;
  html += `</div>`;

  html += `<div class="col-gap"></div>`;

  // Secondary drivers — each has a "Links to primary driver" dropdown
  html += `<div class="col-sd">`;
  data.secondaryDrivers.forEach((sd, si) => {
    const pdOptions = data.primaryDrivers.map(pd =>
      `<option value="${pd.id}" ${sd.parentId === pd.id ? 'selected' : ''}>${escHtml(pd.label.substring(0, 30))}${pd.label.length > 30 ? '…' : ''}</option>`
    ).join('');
    html += `<div class="node node-sd visible" id="build-${sd.id}">
      <div class="node-controls">
        <button class="node-btn" title="Delete secondary driver" onclick="deleteSD('${sd.id}')">×</button>
      </div>
      <div contenteditable="true" spellcheck="false"
           oninput="buildState.secondaryDrivers[${si}].label = this.innerText; refreshLinkSelects(); scheduleBuildArrows()"
           >${escHtml(sd.label)}</div>
      <span class="node-link-label">\u2190 Links to</span>
      <select class="node-link-select" onchange="linkSD('${sd.id}', this.value)">
        <option value="">— unlinked —</option>
        ${pdOptions}
      </select>
    </div>`;
  });
  html += `<button class="add-btn" onclick="addSD()">+ Add secondary driver</button>`;
  html += `</div>`;

  html += `<div class="col-gap"></div>`;

  // Change ideas — each has a "Links to secondary driver" dropdown
  html += `<div class="col-ci">`;
  data.changeIdeas.forEach((ci, cii) => {
    const sdOptions = data.secondaryDrivers.map(sd =>
      `<option value="${sd.id}" ${ci.parentId === sd.id ? 'selected' : ''}>${escHtml(sd.label.substring(0, 30))}${sd.label.length > 30 ? '…' : ''}</option>`
    ).join('');
    html += `<div class="node node-ci visible" id="build-${ci.id}">
      <div class="node-controls">
        <button class="node-btn" title="Delete change idea" onclick="deleteCI('${ci.id}')">×</button>
      </div>
      <div contenteditable="true" spellcheck="false"
           oninput="buildState.changeIdeas[${cii}].label = this.innerText; refreshLinkSelects(); scheduleBuildArrows()"
           >${escHtml(ci.label)}</div>
      <span class="node-link-label">\u2190 Links to</span>
      <select class="node-link-select" onchange="linkCI('${ci.id}', this.value)">
        <option value="">— unlinked —</option>
        ${sdOptions}
      </select>
    </div>`;
  });
  html += `<button class="add-btn" onclick="addCI()">+ Add change idea</button>`;
  html += `</div>`;

  document.getElementById('build-body').innerHTML = html;
  scheduleBuildArrows();
}

// Refresh just the option text in dropdowns without full re-render
// (avoids resetting contenteditable cursor position)
function refreshLinkSelects() {
  // Rebuild SD parent options
  buildState.secondaryDrivers.forEach(sd => {
    const sel = document.querySelector(`#build-${sd.id} .node-link-select`);
    if (!sel) return;
    const current = sd.parentId;
    sel.innerHTML = '<option value="">— unlinked —</option>' +
      buildState.primaryDrivers.map(pd =>
        `<option value="${pd.id}" ${current === pd.id ? 'selected' : ''}>${escHtml(pd.label.substring(0, 30))}${pd.label.length > 30 ? '…' : ''}</option>`
      ).join('');
  });
  // Rebuild CI parent options
  buildState.changeIdeas.forEach(ci => {
    const sel = document.querySelector(`#build-${ci.id} .node-link-select`);
    if (!sel) return;
    const current = ci.parentId;
    sel.innerHTML = '<option value="">— unlinked —</option>' +
      buildState.secondaryDrivers.map(sd =>
        `<option value="${sd.id}" ${current === sd.id ? 'selected' : ''}>${escHtml(sd.label.substring(0, 30))}${sd.label.length > 30 ? '…' : ''}</option>`
      ).join('');
  });
}

// Link mutation functions
function linkSD(sdId, pdId) {
  const sd = buildState.secondaryDrivers.find(s => s.id === sdId);
  if (sd) { sd.parentId = pdId || null; scheduleBuildArrows(); }
}

function linkCI(ciId, sdId) {
  const ci = buildState.changeIdeas.find(c => c.id === ciId);
  if (ci) { ci.parentId = sdId || null; scheduleBuildArrows(); }
}

// CRUD
function addPD() {
  buildState.primaryDrivers.push({ id: uid(), label: 'New primary driver' });
  renderBuild();
}

function deletePD(id) {
  if (buildState.primaryDrivers.length <= 1) return;
  buildState.primaryDrivers = buildState.primaryDrivers.filter(pd => pd.id !== id);
  // Unlink any SDs that pointed to this PD
  buildState.secondaryDrivers.forEach(sd => { if (sd.parentId === id) sd.parentId = null; });
  renderBuild();
}

function addSD() {
  buildState.secondaryDrivers.push({ id: uid(), label: 'New secondary driver', parentId: null });
  renderBuild();
}

function deleteSD(id) {
  buildState.secondaryDrivers = buildState.secondaryDrivers.filter(sd => sd.id !== id);
  // Unlink any CIs that pointed to this SD
  buildState.changeIdeas.forEach(ci => { if (ci.parentId === id) ci.parentId = null; });
  renderBuild();
}

function addCI() {
  buildState.changeIdeas.push({ id: uid(), label: 'New change idea', parentId: null });
  renderBuild();
}

function deleteCI(id) {
  buildState.changeIdeas = buildState.changeIdeas.filter(ci => ci.id !== id);
  renderBuild();
}

function loadExample() { buildState = nestedToFlat(EXAMPLE_NESTED); renderBuild(); }
function loadBlank()   { buildState = JSON.parse(JSON.stringify(BLANK_FLAT)); renderBuild(); }

// Debounced arrow redraw for build (avoids thrashing during typing)
let buildArrowTimer = null;
function scheduleBuildArrows() {
  clearTimeout(buildArrowTimer);
  buildArrowTimer = setTimeout(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => drawBuildArrows()));
  }, 60);
}

// ═══════════════════════════════════════════════════════════
// ARROW DRAWING
// ═══════════════════════════════════════════════════════════
function setupSvg(prefix) {
  const svg = document.getElementById(prefix + '-arrows');
  const canvas = document.getElementById(prefix + '-canvas');
  const w = canvas.scrollWidth;
  const h = canvas.scrollHeight;
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.style.width = w + 'px';
  svg.style.height = h + 'px';
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const arrowColor = '#b0aaa0';
  const hlColor    = '#6b7c93';
  svg.innerHTML = `<defs>
    <marker id="ah-${prefix}" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 Z" fill="${arrowColor}" />
    </marker>
    <marker id="ah-hl-${prefix}" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 Z" fill="${hlColor}" />
    </marker>
  </defs>
  <g id="${prefix}-base-layer"></g>
  <g id="${prefix}-highlight-layer"></g>`;

  const cr = canvas.getBoundingClientRect();
  return { svg, cr, arrowColor, hlColor,
    base: document.getElementById(`${prefix}-base-layer`),
    hl:   document.getElementById(`${prefix}-highlight-layer`) };
}

function relPos(el, cr) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    left:  r.left - cr.left,
    right: r.right - cr.left,
    cy:    r.top + r.height / 2 - cr.top
  };
}

function bezier(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

function addArrow(ctx, fromEl, toEl, highlight) {
  if (!fromEl || !toEl) return;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  // from.left → to.right + marker offset so arrowhead lands at node edge
  path.setAttribute('d', bezier(fromEl.left, fromEl.cy, toEl.right + 10, toEl.cy));
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', highlight ? ctx.hlColor : ctx.arrowColor);
  path.setAttribute('stroke-width', highlight ? '2.2' : '1.2');
  path.setAttribute('marker-end', `url(#ah-${highlight ? 'hl-' : ''}${ctx.prefix})`);
  (highlight ? ctx.hl : ctx.base).appendChild(path);
}

// Learn arrows — driven by nested EXAMPLE_NESTED
function drawLearnArrows(showAim, showPd, showSd, showCi, data) {
  const ctx = setupSvg('learn');
  ctx.prefix = 'learn';
  const aimEl = relPos(document.getElementById('learn-aim'), ctx.cr);

  data.primaryDrivers.forEach(pd => {
    const pdEl = relPos(document.getElementById('learn-' + pd.id), ctx.cr);
    if (showAim && showPd) {
      const hl = HIGHLIGHT_PATH.has(pd.id) && HIGHLIGHT_PATH.has('aim');
      addArrow(ctx, pdEl, aimEl, hl);
    }
    pd.secondaryDrivers.forEach(sd => {
      const sdEl = relPos(document.getElementById('learn-' + sd.id), ctx.cr);
      if (showPd && showSd) {
        const hl = HIGHLIGHT_PATH.has(sd.id) && HIGHLIGHT_PATH.has(pd.id);
        addArrow(ctx, sdEl, pdEl, hl);
      }
      sd.changeIdeas.forEach(ci => {
        const ciEl = relPos(document.getElementById('learn-' + ci.id), ctx.cr);
        if (showSd && showCi) {
          const hl = HIGHLIGHT_PATH.has(ci.id) && HIGHLIGHT_PATH.has(sd.id);
          addArrow(ctx, ciEl, sdEl, hl);
        }
      });
    });
  });
}

// Build arrows — driven by flat buildState with explicit parentId links
function drawBuildArrows() {
  const ctx = setupSvg('build');
  ctx.prefix = 'build';
  const data = buildState;
  const aimEl = relPos(document.getElementById('build-aim'), ctx.cr);

  // PD → Aim (all PDs always link to aim)
  data.primaryDrivers.forEach(pd => {
    const pdEl = relPos(document.getElementById('build-' + pd.id), ctx.cr);
    addArrow(ctx, pdEl, aimEl, false);
  });

  // SD → its parent PD (only if parentId is set)
  data.secondaryDrivers.forEach(sd => {
    if (!sd.parentId) return;
    const sdEl = relPos(document.getElementById('build-' + sd.id), ctx.cr);
    const pdEl = relPos(document.getElementById('build-' + sd.parentId), ctx.cr);
    addArrow(ctx, sdEl, pdEl, false);
  });

  // CI → its parent SD (only if parentId is set)
  data.changeIdeas.forEach(ci => {
    if (!ci.parentId) return;
    const ciEl = relPos(document.getElementById('build-' + ci.id), ctx.cr);
    const sdEl = relPos(document.getElementById('build-' + ci.parentId), ctx.cr);
    addArrow(ctx, ciEl, sdEl, false);
  });
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════
function exportJSON() {
  const blob = new Blob([JSON.stringify(buildState, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'driver-diagram.json';
  a.click();
}

function exportImage() {
  const canvas = document.getElementById('build-canvas');
  document.querySelectorAll('.node-controls, .add-btn, .node-link-select, .node-link-label')
    .forEach(el => el.style.display = 'none');
  html2canvas(canvas, { backgroundColor: '#fafaf8', scale: 2, useCORS: true }).then(c => {
    document.querySelectorAll('.node-controls, .node-link-select, .node-link-label')
      .forEach(el => el.style.display = '');
    document.querySelectorAll('.add-btn')
      .forEach(el => el.style.display = '');
    const a = document.createElement('a');
    a.download = 'driver-diagram.png';
    a.href = c.toDataURL('image/png');
    a.click();
  });
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
updateStep();

window.addEventListener('keydown', e => {
  if (!document.getElementById('learn-panel').classList.contains('active')) return;
  if (e.key === 'ArrowRight') nextStep();
  if (e.key === 'ArrowLeft')  prevStep();
});

window.addEventListener('resize', () => {
  if (document.getElementById('learn-panel').classList.contains('active')) {
    renderLearn();
  } else {
    scheduleBuildArrows();
  }
});