// Writing analysis rules
const WEASEL_WORDS = [
  "many", "various", "very", "fairly", "several", "extremely",
  "exceedingly", "quite", "remarkably", "few", "surprisingly",
  "mostly", "largely", "huge", "tiny", "excellent", "interestingly",
  "significantly", "substantially", "clearly", "vast", "relatively",
  "completely", "literally", "really"
];

const PASSIVE_VOICE_HELPERS = [
  "am", "are", "were", "being", "is", "been", "was", "be"
];

const PASSIVE_VOICE_IRREGULARS = [
  "awoken", "been", "born", "beat", "become", "begun", "bent",
  "beset", "bet", "bid", "bidden", "bound", "bitten", "bled",
  "blown", "broken", "bred", "brought", "broadcast", "built",
  "burnt", "burst", "bought", "cast", "caught", "chosen",
  "clung", "come", "cost", "crept", "cut", "dealt", "dug",
  "dived", "done", "drawn", "dreamt", "driven", "drunk", "eaten",
  "fallen", "fed", "felt", "fought", "found", "fit", "fled",
  "flung", "flown", "forbidden", "forgotten", "foregone", "forgiven",
  "forsaken", "frozen", "gotten", "given", "gone", "ground",
  "grown", "hung", "heard", "hidden", "hit", "held", "hurt",
  "kept", "knelt", "knit", "known", "laid", "led", "leapt",
  "learnt", "left", "lent", "let", "lain", "lighted", "lost",
  "made", "meant", "met", "misspelt", "mistaken", "mown", "overcome",
  "overdone", "overtaken", "overthrown", "paid", "pled", "proven",
  "put", "quit", "read", "rid", "ridden", "rung", "risen", "run",
  "sawn", "said", "seen", "sought", "sold", "sent", "set", "sewn",
  "shaken", "shaven", "shorn", "shed", "shone", "shod", "shot",
  "shown", "shrunk", "shut", "sung", "sunk", "sat", "slept",
  "slain", "slid", "slung", "slit", "smitten", "sown", "spoken",
  "sped", "spent", "spilt", "spun", "spit", "split", "spread",
  "sprung", "stood", "stolen", "stuck", "stung", "stunk", "stridden",
  "struck", "strung", "striven", "sworn", "swept", "swollen",
  "swum", "swung", "taken", "taught", "torn", "told", "thought",
  "thrived", "thrown", "thrust", "trodden", "understood", "upheld",
  "upset", "woken", "worn", "woven", "wed", "wept", "wound",
  "won", "withheld", "withstood", "wrung", "written"
];

function createAnalysisPanel(text) {
  // Create a floating panel with split view
  const panel = document.createElement('div');
  panel.className = 'writegood-panel';
  panel.innerHTML = `
    <div class="writegood-header">
      <h3>WriteGood - Writing Analysis</h3>
      <button class="close-btn">×</button>
    </div>
    <div class="writegood-controls">
      <button id="weasel-toggle" class="toggle-btn active">Weasel Words</button>
      <button id="passive-toggle" class="toggle-btn active">Passive Voice</button>
      <button id="duplicate-toggle" class="toggle-btn active">Duplicates</button>
    </div>
    <div class="writegood-content">
      <div class="analyzed-text">${text}</div>
    </div>
  `;

  // Add enhanced styles
  const style = document.createElement('style');
  style.textContent = `
    .writegood-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50%;
      max-width: 1000px;
      height: 80vh;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
      display: flex;
      flex-direction: column;
    }
    .writegood-header {
      padding: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .writegood-controls {
      padding: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      gap: 10px;
      flex-wrap: nowrap;
    }
    .toggle-btn {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .toggle-btn:hover {
      background: #f0f0f0;
    }
    .toggle-btn.active {
      background: #007bff;
      color: white;
      border-color: #0056b3;
    }
    .writegood-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    .analyzed-text {
      flex: 1;
      white-space: pre-wrap;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      overflow-y: auto;
      line-height: 1.6;
    }
    .weasel-highlight {
      background-color: #ffd7d7;
    }
    .passive-highlight {
      background-color: #d7ffd7;
    }
    .duplicate-highlight {
      background-color: #d7d7ff;
    }
    .weasel-highlight.passive-highlight {
      background-color: #ffe7d7;
    }
    .weasel-highlight.duplicate-highlight {
      background-color: #ffd7ff;
    }
    .passive-highlight.duplicate-highlight {
      background-color: #d7ffff;
    }
    .weasel-highlight.passive-highlight.duplicate-highlight {
      background-color: #e7e7e7;
      font-weight: bold;
    }
    .close-btn {
      border: none;
      background: none;
      font-size: 20px;
      cursor: pointer;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(panel);

  const analyzedText = panel.querySelector('.analyzed-text');
  
  // Apply highlights immediately
  const applyAllHighlights = () => {
    const html = analyzedText.textContent;
    let workingHtml = html;
    
    // Create arrays to store matches and their positions
    let matches = [];
    
    if (panel.querySelector('#weasel-toggle').classList.contains('active')) {
      WEASEL_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        let match;
        while ((match = regex.exec(html)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            type: 'weasel'
          });
        }
      });
    }
    
    if (panel.querySelector('#passive-toggle').classList.contains('active')) {
      PASSIVE_VOICE_HELPERS.forEach(helper => {
        const regex = new RegExp(`\\b${helper}\\b\\s+(\\w+ed|${PASSIVE_VOICE_IRREGULARS.join('|')})\\b`, 'gi');
        let match;
        while ((match = regex.exec(html)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            type: 'passive'
          });
        }
      });
    }
    
    if (panel.querySelector('#duplicate-toggle').classList.contains('active')) {
      const words = html.match(/\b\w+\b/g) || [];
      for (let i = 0; i < words.length - 1; i++) {
        if (words[i].toLowerCase() === words[i + 1].toLowerCase()) {
          const regex = new RegExp(`\\b${words[i]}\\s+${words[i+1]}\\b`, 'gi');
          let match;
          while ((match = regex.exec(html)) !== null) {
            matches.push({
              start: match.index,
              end: match.index + match[0].length,
              text: match[0],
              type: 'duplicate'
            });
          }
        }
      }
    }
    
    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);
    
    // Merge overlapping matches
    let mergedMatches = [];
    let current = null;
    
    matches.forEach(match => {
      if (!current) {
        current = { ...match, types: [match.type] };
      } else if (match.start <= current.end) {
        current.end = Math.max(current.end, match.end);
        current.types.push(match.type);
        current.text = html.substring(current.start, current.end);
      } else {
        mergedMatches.push(current);
        current = { ...match, types: [match.type] };
      }
    });
    if (current) mergedMatches.push(current);
    
    // Apply highlights from end to start to maintain positions
    mergedMatches.reverse().forEach(match => {
      const classes = match.types.map(type => `${type}-highlight`).join(' ');
      const before = workingHtml.substring(0, match.start);
      const after = workingHtml.substring(match.end);
      workingHtml = before + `<span class="${classes}">${match.text}</span>` + after;
    });
    
    analyzedText.innerHTML = workingHtml;
  };

  panel.querySelector('#weasel-toggle').addEventListener('click', (e) => {
    e.target.classList.toggle('active');
    applyAllHighlights();
  });

  panel.querySelector('#passive-toggle').addEventListener('click', (e) => {
    e.target.classList.toggle('active');
    applyAllHighlights();
  });

  panel.querySelector('#duplicate-toggle').addEventListener('click', (e) => {
    e.target.classList.toggle('active');
    applyAllHighlights();
  });

  panel.querySelector('.close-btn').addEventListener('click', () => {
    panel.remove();
  });

  // Apply highlights immediately when panel opens
  applyAllHighlights();
}

function highlightWeaselWords(element) {
  let html = element.textContent;
  WEASEL_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    html = html.replace(regex, match => 
      `<span class="weasel-highlight">${match}</span>`
    );
  });
  element.innerHTML = html;
}

function highlightPassiveVoice(element) {
  let html = element.textContent;
  const sentences = html.match(/[^.!?]+[.!?]+/g) || [];
  
  PASSIVE_VOICE_HELPERS.forEach(helper => {
    const regex = new RegExp(`\\b${helper}\\b\\s+(\\w+ed|${PASSIVE_VOICE_IRREGULARS.join('|')})\\b`, 'gi');
    html = html.replace(regex, match =>
      `<span class="passive-highlight">${match}</span>`
    );
  });
  element.innerHTML = html;
}

function highlightDuplicates(element) {
  let html = element.textContent;
  const words = html.match(/\b\w+\b/g) || [];
  
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].toLowerCase() === words[i + 1].toLowerCase()) {
      const regex = new RegExp(`\\b${words[i]}\\s+${words[i+1]}\\b`, 'gi');
      html = html.replace(regex, match =>
        `<span class="duplicate-highlight">${match}</span>`
      );
    }
  }
  element.innerHTML = html;
}

function removeHighlights(element, className) {
  const highlights = element.getElementsByClassName(className);
  while (highlights.length > 0) {
    const highlight = highlights[0];
    highlight.outerHTML = highlight.textContent;
  }
}

// Modify the main analysis function
function analyzeText(text) {
  createAnalysisPanel(text);
}

// Keep the message listener
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "analyzeText") {
    analyzeText(message.text);
  }
}); 