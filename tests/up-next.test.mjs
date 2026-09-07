import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const mainScript = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');

function makeClassList() {
  const classes = new Set();
  return {
    add(...names) {
      names.forEach((name) => classes.add(name));
    },
    contains(name) {
      return classes.has(name);
    },
    remove(...names) {
      names.forEach((name) => classes.delete(name));
    },
    toggle(name, force) {
      if (force === undefined ? !classes.has(name) : force) classes.add(name);
      else classes.delete(name);
    },
  };
}

function makeSession({ id, date, name }) {
  const attributes = new Map([
    ['id', id],
    ['data-date', date],
  ]);
  const badge = { textContent: id === 'week-1' ? 'Week 1' : 'Week 2' };
  const image = {
    getAttribute(attribute) {
      if (attribute === 'src') return `images/speakers/${id}.png`;
      if (attribute === 'alt') return name;
      return null;
    },
  };
  const leftColumn = {
    querySelector(selector) {
      if (selector === '.font-serif') return { textContent: name };
      if (selector === '.p-4 .text-slate-500') return { textContent: 'Test University' };
      return null;
    },
  };
  const rightColumn = {
    querySelector(selector) {
      if (selector === 'p.text-lg.font-semibold') return { textContent: 'Test Talk' };
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };

  return {
    classList: makeClassList(),
    getAttribute(attribute) {
      return attributes.get(attribute) ?? null;
    },
    setAttribute(attribute, value) {
      attributes.set(attribute, value);
    },
    querySelector(selector) {
      if (selector === 'img') return image;
      if (selector === '.week-badge') return badge;
      if (selector === '.grid > div:first-child') return leftColumn;
      if (selector === '.grid > div:last-child') return rightColumn;
      return null;
    },
  };
}

function renderFeaturedAt(nowIso) {
  const RealDate = Date;
  class FixedDate extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : [nowIso]));
    }

    static now() {
      return new RealDate(nowIso).getTime();
    }
  }

  const sessions = [
    makeSession({ id: 'week-1', date: '2026-09-02', name: 'Li Jiang' }),
    makeSession({ id: 'week-2', date: '2026-09-09', name: 'Guangcong Wang' }),
  ];
  const featuredContainer = { innerHTML: '' };
  const document = {
    documentElement: { classList: makeClassList() },
    getElementById(id) {
      return id === 'featured-seminar' ? featuredContainer : null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll(selector) {
      return selector === '.speaker-session' ? sessions : [];
    },
  };
  const window = {
    addEventListener() {},
    matchMedia() {
      return { addEventListener() {}, matches: false };
    },
    scrollTo() {},
    scrollY: 0,
    setTimeout() {},
  };

  vm.runInNewContext(mainScript, { Date: FixedDate, document, window });
  return featuredContainer.innerHTML;
}

test('keeps the Sep 2 speaker before and during the seminar', () => {
  assert.match(renderFeaturedAt('2026-09-02T10:30:00+08:00'), /Li Jiang/);
  assert.match(renderFeaturedAt('2026-09-02T11:30:00+08:00'), /Li Jiang/);
});

test('moves Up Next to Guangcong Wang when the Sep 2 seminar ends', () => {
  assert.match(renderFeaturedAt('2026-09-02T11:50:00+08:00'), /Guangcong Wang/);
  assert.match(renderFeaturedAt('2026-09-02T14:00:00+08:00'), /Guangcong Wang/);
});

test('uses the current Weekly AI Seminar Zoom meeting', () => {
  const featuredHtml = renderFeaturedAt('2026-09-07T12:00:00+08:00');
  const currentZoomUrl = 'https://hkust-gz-edu-cn.zoom.us/j/96951141900?pwd=QrbBaW1aMGvkgZqCpaJkoiDteIhUwf.1';

  assert.ok(featuredHtml.includes(`href="${currentZoomUrl}"`));
  assert.doesNotMatch(featuredHtml, /97777467473/);
});
