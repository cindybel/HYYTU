/* Clip browser + project-path compatibility layer.
   The game is served both from localhost and from a GitHub Pages project subfolder.
   Older content uses root-relative media paths such as /video/foo.mp4, which point to
   the wrong host root on GitHub Pages. Resolve those paths without rewriting working
   gameplay systems. */
(() => {
  const scriptUrl = document.currentScript?.src || window.location.href;
  const projectRoot = new URL('../', scriptUrl);
  const portablePrefixes = ['/video/', '/audio/', '/images/', '/assets/'];

  function resolveAsset(value) {
    if (typeof value !== 'string' || !value) return value;
    if (!portablePrefixes.some(prefix => value.startsWith(prefix))) return value;
    return new URL(value.slice(1), projectRoot).href;
  }

  window.VJAssetUrl = resolveAsset;

  // Keep legacy code working: main.js assigns root-relative URLs directly to media elements.
  const patchSrcProperty = (prototype) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'src');
    if (!descriptor?.get || !descriptor?.set || descriptor.set.__vjPortable) return;
    const setter = function(value) { descriptor.set.call(this, resolveAsset(value)); };
    setter.__vjPortable = true;
    Object.defineProperty(prototype, 'src', {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: descriptor.get,
      set: setter,
    });
  };

  try { patchSrcProperty(HTMLMediaElement.prototype); } catch {}
  try { patchSrcProperty(HTMLImageElement.prototype); } catch {}

  // Video posters have a separate property from src.
  try {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'poster');
    if (descriptor?.get && descriptor?.set && !descriptor.set.__vjPortable) {
      const setter = function(value) { descriptor.set.call(this, resolveAsset(value)); };
      setter.__vjPortable = true;
      Object.defineProperty(HTMLVideoElement.prototype, 'poster', {
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable,
        get: descriptor.get,
        set: setter,
      });
    }
  } catch {}
})();

window.ClipBrowser = {
  mount(host, clips, choose, initial = 0) {
    host.classList.add('clip-browser');
    host.innerHTML = '';
    let page = 0;
    let selected = initial;

    const groups = [
      ['warmup', 'Warm-up / break'],
      ['groove', 'Groove'],
      ['rise', 'Montée'],
      ['peak', 'Peak'],
      ['legacy', 'Clips précédents'],
    ];

    const bar = document.createElement('div');
    bar.className = 'clip-browser-bar';

    const label = document.createElement('label');
    label.textContent = 'Ambiance ';
    const filter = document.createElement('select');
    filter.dataset.clipEnergy = '';
    filter.setAttribute('aria-label', 'Ambiance des clips');
    for (const [id, name] of groups) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      filter.append(option);
    }
    filter.value = clips[initial]?.energy || 'warmup';
    label.append(filter);

    const previous = document.createElement('button');
    const next = document.createElement('button');
    const count = document.createElement('span');
    previous.type = next.type = 'button';
    previous.textContent = '‹';
    next.textContent = '›';
    previous.setAttribute('aria-label', 'Clips précédents');
    next.setAttribute('aria-label', 'Clips suivants');
    previous.dataset.clipsPrev = '';
    next.dataset.clipsNext = '';
    count.setAttribute('aria-live', 'polite');
    bar.append(label, previous, count, next);

    const grid = document.createElement('div');
    grid.className = 'clip-browser-grid';
    host.append(bar, grid);

    function draw() {
      const list = clips
        .map((clip, index) => ({ clip, index }))
        .filter(({ clip }) => (clip.energy || 'legacy') === filter.value);
      const pages = Math.max(1, Math.ceil(list.length / 6));
      page = Math.min(page, pages - 1);
      count.textContent = `${page + 1} / ${pages} · ${list.length} clips`;
      previous.disabled = page === 0;
      next.disabled = page >= pages - 1;
      grid.replaceChildren();

      for (const { clip, index } of list.slice(page * 6, page * 6 + 6)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'clip-card';
        button.dataset.resoluteClip = button.dataset.clip = String(index);
        button.setAttribute('aria-pressed', String(index === selected));
        button.title = clip.label;
        if(window.ClipProgression){button.disabled=!ClipProgression.unlocked(clip);button.title+=` · ${ClipProgression.label(clip)}`;}

        if (clip.poster) {
          const img = document.createElement('img');
          img.src = window.VJAssetUrl?.(clip.poster) || clip.poster;
          img.alt = '';
          img.loading = 'lazy';
          button.append(img);
        }

        const text = document.createElement('span');
        text.textContent = clip.label;
        button.append(text);
        if(window.ClipProgression){const tier=document.createElement('small');tier.textContent=ClipProgression.label(clip);button.append(tier);}
        button.onclick = () => {
          if (choose(index) === false) return;
          selected = index;
          grid.querySelectorAll('button').forEach(card => {
            card.setAttribute('aria-pressed', String(Number(card.dataset.clip) === index));
          });
        };
        grid.append(button);
      }
    }

    filter.onchange = () => { page = 0; draw(); };
    previous.onclick = () => { page--; draw(); };
    next.onclick = () => { page++; draw(); };
    draw();
  },
};
