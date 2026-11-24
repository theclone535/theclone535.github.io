/* Animated code background.
   Columns of syntax-coloured code type themselves out behind the page,
   like a few editor windows running at once.
   Snippets come from js/code-snippets.js. Settings are just below. */
(() => {
  const SETTINGS = {
    enabled: true,
    strength: 0.24,       // how visible the code is (0 to 1)
    dimWhenScrolled: 0.5, // fades to this fraction once you scroll past the intro
    typingSpeed: [18, 34], // characters per second, per column (min, max)
    fontSize: 13,
    lineHeight: 21,
    columnWidth: 520,
  };

  const canvas = document.querySelector(".code-bg");
  if (!canvas || !SETTINGS.enabled || typeof CODE_SNIPPETS === "undefined" || !CODE_SNIPPETS.length) {
    canvas?.remove();
    return;
  }

  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const FONT = `${SETTINGS.fontSize}px ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace`;

  /* ---------- Syntax colouring ---------- */
  const COLORS = {
    text: "#17203b",
    keyword: "#3346a8",
    type: "#13706f",
    string: "#8f5f0a",
    number: "#a3366a",
    comment: "#6b7590",
    gutter: "#8a93a8",
  };

  const KEYWORDS = new Set(
    (
      "if else for while return switch case break continue const static void class struct public private protected " +
      "virtual override auto new delete this true false nullptr null readonly var bool int float double uint8 " +
      "using namespace import from def in not and or is None True False print enumerate len self lambda with as"
    ).split(" ")
  );
  const MACROS = /^(UCLASS|UPROPERTY|UFUNCTION|GENERATED_BODY|SerializeField)$/;

  const TOKEN = /(\/\/.*$|#.*$)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?f?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;

  function tokenize(line, language) {
    const out = [];
    let m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(line))) {
      const [text, comment, str, num, word] = m;
      let color = COLORS.text;
      if (comment) {
        // "#" only starts a comment in Python
        if (comment.startsWith("#") && language !== "python") {
          out.push({ text: "#", color });
          TOKEN.lastIndex = m.index + 1;
          continue;
        }
        color = COLORS.comment;
      } else if (str) color = COLORS.string;
      else if (num) color = COLORS.number;
      else if (word) {
        if (KEYWORDS.has(word) || MACROS.test(word)) color = COLORS.keyword;
        else if (/^[A-Z]/.test(word)) color = COLORS.type;
      }
      out.push({ text, color });
    }
    return out;
  }

  const SNIPPETS = CODE_SNIPPETS.map((s) =>
    s.code.split("\n").map((line) => ({ tokens: tokenize(line, s.language), length: line.length }))
  );

  /* ---------- Columns ---------- */
  let width = 0;
  let height = 0;
  let charWidth = 7.8;
  let columns = [];

  const rand = (min, max) => min + Math.random() * (max - min);

  function makeColumn(index, count) {
    const col = {
      x: (width / count) * index,
      w: width / count,
      speed: rand(...SETTINGS.typingSpeed),
      snippet: Math.floor(Math.random() * SNIPPETS.length),
      line: 0,
      char: 0,
      pause: 0,
      lines: [],   // finished lines: { tokens, num }
      lineNum: 1,
      scroll: 0,
      target: 0,
    };
    // Start part-way through, so the screen isn't empty on load
    const rows = visibleRows();
    const prefill = reduceMotion.matches ? rows + 2 : Math.max(0, rows - Math.floor(rand(3, 9)));
    for (let i = 0; i < prefill; i++) finishLine(col);
    col.scroll = col.target;
    return col;
  }

  function visibleRows() {
    return Math.floor((height - 32) / SETTINGS.lineHeight);
  }

  function currentLine(col) {
    return SNIPPETS[col.snippet][col.line];
  }

  function finishLine(col) {
    const line = currentLine(col);
    col.lines.push({ tokens: line.tokens, num: col.lineNum++ });
    col.char = 0;
    col.line++;
    if (col.line >= SNIPPETS[col.snippet].length) {
      // Blank line, then the next snippet
      col.lines.push({ tokens: [], num: col.lineNum++ });
      col.snippet = (col.snippet + 1) % SNIPPETS.length;
      col.line = 0;
      col.lineNum = 1;
      col.pause = 1.4;
    } else {
      col.pause = rand(0.15, 0.5);
    }
    // Scroll so the line being typed stays near the bottom
    const contentH = (col.lines.length + 1) * SETTINGS.lineHeight;
    col.target = Math.max(0, contentH - (height - 40));
    // Forget lines that have scrolled well out of view
    const drop = col.lines.length - (visibleRows() + 6);
    if (drop > 0) {
      col.lines.splice(0, drop);
      col.scroll -= drop * SETTINGS.lineHeight;
      col.target -= drop * SETTINGS.lineHeight;
    }
  }

  function step(col, dt) {
    col.scroll += (col.target - col.scroll) * Math.min(1, dt * 6);
    if (col.pause > 0) {
      col.pause -= dt;
      return;
    }
    col.char += col.speed * dt;
    const line = currentLine(col);
    // Skip leading indentation instantly, like an editor's auto-indent
    if (col.char < 1) {
      const indent = line.tokens[0]?.text.match(/^\s+$/) ? line.tokens[0].text.length : 0;
      col.char = Math.max(col.char, indent);
    }
    if (col.char >= line.length) finishLine(col);
  }

  /* ---------- Drawing ---------- */
  function drawTokens(tokens, x, y, limit = Infinity) {
    let used = 0;
    for (const t of tokens) {
      if (used >= limit) break;
      const text = used + t.text.length > limit ? t.text.slice(0, limit - used) : t.text;
      if (text.trim()) {
        ctx.fillStyle = t.color;
        ctx.fillText(text, x + used * charWidth, y);
      }
      used += text.length;
    }
    return used;
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    // Phones have text over the code everywhere, so keep it fainter there
    const strength = width < 700 ? SETTINGS.strength * 0.7 : SETTINGS.strength;
    const lh = SETTINGS.lineHeight;
    const gutterW = charWidth * 4;

    for (const col of columns) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(col.x, 0, col.w - 28, height);
      ctx.clip();

      const left = col.x + 24;
      const codeX = left + gutterW;
      const top = 24 + lh * 0.75 - col.scroll;

      ctx.globalAlpha = strength;
      col.lines.forEach((line, i) => {
        const y = top + i * lh;
        if (y < -lh || y > height + lh) return;
        ctx.fillStyle = COLORS.gutter;
        ctx.fillText(String(line.num).padStart(3, " "), left, y);
        drawTokens(line.tokens, codeX, y);
      });

      // Line being typed, plus the cursor
      const y = top + col.lines.length * lh;
      ctx.fillStyle = COLORS.gutter;
      ctx.fillText(String(col.lineNum).padStart(3, " "), left, y);
      const typed = reduceMotion.matches ? 0 : drawTokens(currentLine(col).tokens, codeX, y, Math.floor(col.char));

      ctx.restore();

      if (!reduceMotion.matches && Math.floor(time / 530) % 2 === 0) {
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#ffc53d";
        ctx.fillRect(codeX + typed * charWidth, y - SETTINGS.fontSize + 1, charWidth, SETTINGS.fontSize + 3);
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Setup and loop ---------- */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = FONT;
    ctx.textBaseline = "alphabetic";
    charWidth = ctx.measureText("M").width;

    const count = Math.max(1, Math.round(width / SETTINGS.columnWidth));
    columns = Array.from({ length: count }, (_, i) => makeColumn(i, count));
    draw();
  }

  let last = 0;
  function frame(time) {
    requestAnimationFrame(frame);
    if (document.hidden || reduceMotion.matches) return;
    const dt = Math.min((time - last) / 1000, 0.1);
    if (dt < 1 / 32) return; // about 30 fps is plenty
    last = time;
    columns.forEach((col) => step(col, dt));
    draw(time);
  }

  // Strong behind the intro, quieter behind the content
  function fadeOnScroll() {
    const t = Math.min(1, window.scrollY / (window.innerHeight * 0.6));
    canvas.style.opacity = String(1 - t * (1 - SETTINGS.dimWhenScrolled));
  }

  let resizeTimer;
  // Only rebuild when the width changes: mobile browsers resize height while scrolling
  let lastWidth = window.innerWidth;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth !== lastWidth || Math.abs(window.innerHeight - height) > 150) {
        lastWidth = window.innerWidth;
        resize();
      }
    }, 150);
  });
  addEventListener("scroll", fadeOnScroll, { passive: true });
  reduceMotion.addEventListener?.("change", resize);

  resize();
  fadeOnScroll();
  requestAnimationFrame(frame);
})();
