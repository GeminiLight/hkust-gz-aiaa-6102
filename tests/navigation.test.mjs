import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');

function element(initialClasses = []) {
  const classes = new Set(initialClasses);
  return {
    attributes: {}, listeners: {}, focused: false,
    classList: {
      add: (value) => classes.add(value),
      remove: (value) => classes.delete(value),
      contains: (value) => classes.has(value),
      toggle: (value, force) => force ? classes.add(value) : classes.delete(value),
    },
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(key, callback) { this.listeners[key] = callback; },
    focus() { this.focused = true; },
    querySelectorAll() { return []; },
  };
}

function boot(storage, systemDark = false) {
  const html = element();
  const toggle = element();
  const menuButton = element();
  const menu = element(['hidden']);
  const events = {};
  const mediaEvents = {};
  vm.runInNewContext(source, {
    document: {
      documentElement: html,
      getElementById: (id) => ({ 'theme-toggle': toggle, 'mobile-menu-btn': menuButton, 'mobile-menu': menu })[id] || null,
      querySelectorAll: () => [],
      querySelector: () => null,
    },
    window: {
      localStorage: storage,
      matchMedia: () => ({
        matches: systemDark,
        addEventListener: (name, callback) => { mediaEvents[name] = callback; },
      }),
      addEventListener: (name, callback) => { events[name] = callback; },
      scrollY: 0,
    },
  });
  return { html, toggle, menuButton, menu, events, mediaEvents };
}

test('manual theme survives reload and system theme changes', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const first = boot(storage);
  first.toggle.listeners.click();
  assert.equal(values.get('aiaa-theme'), 'dark');
  first.mediaEvents.change();
  assert.equal(first.html.classList.contains('dark'), true);
  const reloaded = boot(storage);
  assert.equal(reloaded.html.classList.contains('dark'), true);
  assert.equal(reloaded.toggle.attributes['aria-pressed'], 'true');
});

test('theme toggle still works when browser storage is unavailable', () => {
  const page = boot({ getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } });
  page.toggle.listeners.click();
  assert.equal(page.html.classList.contains('dark'), true);
});

test('Escape closes the mobile menu and returns focus to its button', () => {
  const page = boot({ getItem: () => null });
  page.menuButton.listeners.click();
  assert.equal(page.menu.classList.contains('hidden'), false);
  assert.equal(page.menuButton.attributes['aria-label'], 'Close menu');
  page.events.keydown({ key: 'Escape' });
  assert.equal(page.menu.classList.contains('hidden'), true);
  assert.equal(page.menuButton.attributes['aria-expanded'], 'false');
  assert.equal(page.menuButton.focused, true);
});
