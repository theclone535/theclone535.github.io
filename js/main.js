/* Builds the page from js/projects.js. You normally won't need to edit this. */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const canHover = matchMedia("(hover: hover) and (pointer: fine)");

  const menu = $("#menu");
  const cursor = $(".cursor");
  const empty = $(".empty");
  const preview = $(".preview");
  const dialog = $("#project-dialog");

  let filter = "all";
  let shown = [];
  let active = 0;

  fillSite();
  buildFilters();
  render();

  /* ---------- Site text ---------- */
  function fillSite() {
    document.querySelectorAll('[data-site]').forEach((node) => {
      const value = SITE[node.dataset.site];
      if (value) node.textContent = value;
    });
    document.title = `${SITE.name} | Game developer`;
    $("#year").textContent = new Date().getFullYear();

    const about = $("#about-text");
    SITE.about.forEach((para) => about.append(el("p", null, para)));

    const skills = $("#skills");
    Object.entries(SITE.skills).forEach(([group, items]) => {
      const wrap = el("div", "skill-group");
      wrap.append(el("dt", null, group));
      const dd = el("dd");
      const ul = el("ul");
      items.forEach((item) => ul.append(el("li", null, item)));
      dd.append(ul);
      wrap.append(dd);
      skills.append(wrap);
    });

    const contact = $("#contact-list");
    SITE.contact
      .filter((c) => c.url)
      .forEach((c) => {
        const li = el("li");
        li.append(el("span", "contact-label", c.label));
        const a = el("a", "contact-link", c.text || c.url);
        a.href = c.url;
        if (!c.url.startsWith("mailto:")) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        li.append(a);
        contact.append(li);
      });
  }

  /* ---------- Filters ---------- */
  function buildFilters() {
    const group = $(".filters");
    FILTERS.forEach((f) => {
      const count = f.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.filters.includes(f.id)).length;
      if (count === 0) return;
      const btn = el("button", null, f.label);
      btn.type = "button";
      btn.dataset.filter = f.id;
      btn.setAttribute("aria-pressed", String(f.id === filter));
      btn.addEventListener("click", () => {
        filter = f.id;
        group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        render();
      });
      group.append(btn);
    });
  }

  /* ---------- Project list ---------- */
  function render() {
    shown = PROJECTS.filter((p) => filter === "all" || p.filters.includes(filter));
    menu.replaceChildren();

    shown.forEach((p, i) => {
      const li = el("li");
      const btn = el("button", "menu-item");
      btn.type = "button";
      btn.dataset.index = i;
      btn.append(el("span", "menu-title", p.title), el("span", "menu-engine", p.engine));
      li.append(btn);
      menu.append(li);
    });

    empty.hidden = shown.length > 0;
    cursor.hidden = shown.length === 0;
    preview.hidden = shown.length === 0;
    if (shown.length) select(0, { animate: false });
  }

  function buttons() {
    return menu.querySelectorAll(".menu-item");
  }

  function select(i, { focus = false, animate = true } = {}) {
    const list = buttons();
    if (!list.length) return;
    active = (i + list.length) % list.length;
    list.forEach((b, n) => b.classList.toggle("is-active", n === active));
    moveCursor(animate);
    updatePreview(shown[active]);
    if (focus) list[active].focus();
  }

  function moveCursor(animate = true) {
    const btn = buttons()[active];
    if (!btn) return;
    cursor.classList.toggle("no-anim", !animate);
    cursor.style.transform = `translateY(${btn.offsetTop}px)`;
    cursor.style.height = `${btn.offsetHeight}px`;
  }

  menu.addEventListener("pointerover", (e) => {
    const btn = e.target.closest(".menu-item");
    if (btn && canHover.matches) select(Number(btn.dataset.index));
  });
  menu.addEventListener("focusin", (e) => {
    const btn = e.target.closest(".menu-item");
    if (btn) select(Number(btn.dataset.index));
  });
  menu.addEventListener("click", (e) => {
    const btn = e.target.closest(".menu-item");
    if (btn) openProject(shown[Number(btn.dataset.index)]);
  });
  menu.addEventListener("keydown", (e) => {
    const moves = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: shown.length - 1 };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key], { focus: true });
    }
  });
  addEventListener("resize", () => moveCursor(false));
  document.fonts?.ready.then(() => moveCursor(false));

  /* ---------- Preview (desktop) ---------- */
  function updatePreview(p) {
    if (!p) return;
    const media = $(".preview-media");
    media.replaceChildren(mediaFor(p));
    $(".preview-title").textContent = p.title;
    $(".preview-summary").textContent = p.summary;
    fillFacts($(".preview-facts"), p);

    if (!reduceMotion.matches) {
      preview.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 160, easing: "ease-out" });
    }
  }
  $(".preview-media").addEventListener("click", () => openProject(shown[active]));
  $(".preview-open").addEventListener("click", () => openProject(shown[active]));

  function fillFacts(dl, p) {
    dl.replaceChildren();
    const rows = [
      ["Engine", p.engine],
      ["Role", p.role],
      ["Built with", (p.builtWith || []).join(", ")],
      ["Year", p.year],
    ];
    rows
      .filter(([, value]) => value)
      .forEach(([label, value]) => dl.append(el("dt", null, label), el("dd", null, value)));
  }

  /* Screenshot if there is one, otherwise an empty "viewport" placeholder */
  function mediaFor(p) {
    const frame = el("div", "media");
    const placeholder = () => {
      const ph = el("div", "placeholder");
      ph.style.setProperty("--ph", p.color || "#17203B");
      return ph;
    };
    if (p.image) {
      const img = el("img");
      img.src = p.image;
      img.alt = `Screenshot of ${p.title}`;
      img.loading = "lazy";
      img.addEventListener("error", () => img.replaceWith(placeholder()));
      frame.append(img);
    } else {
      frame.append(placeholder());
    }
    return frame;
  }

  /* ---------- Project window ---------- */
  function openProject(p) {
    if (!p) return;
    const mediaSlot = $(".dlg-media");
    mediaSlot.replaceChildren();
    if (p.youtube) {
      const frame = el("div", "media");
      const iframe = el("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(p.youtube)}`;
      iframe.title = `${p.title} video`;
      iframe.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      frame.append(iframe);
      mediaSlot.append(frame);
    } else if (p.image) {
      mediaSlot.append(mediaFor(p));
    }
    // No screenshot or video yet: the window is text only
    mediaSlot.hidden = !mediaSlot.hasChildNodes();

    $("#dlg-title").textContent = p.title;
    $(".dlg-summary").textContent = p.summary;
    fillFacts($(".dlg-facts"), p);

    const points = $(".dlg-points");
    points.replaceChildren(...(p.points || []).map((t) => el("li", null, t)));
    $(".dlg-points-heading").hidden = !(p.points && p.points.length);

    const links = $(".dlg-links");
    links.replaceChildren();
    (p.links || [])
      .filter((l) => l.url)
      .forEach((l) => {
        const a = el("a", "btn", l.label);
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noopener";
        links.append(a);
      });

    const credits = $(".dlg-credits");
    credits.textContent = p.credits || "";
    credits.hidden = !p.credits;

    dialog.showModal();
    dialog.scrollTop = 0;
  }

  $(".dlg-close").addEventListener("click", () => dialog.close());
  // Click outside the window to close
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  // Stop any video when closing, and return focus to the list
  dialog.addEventListener("close", () => {
    $(".dlg-media").replaceChildren();
    buttons()[active]?.focus({ preventScroll: true });
  });
})();
