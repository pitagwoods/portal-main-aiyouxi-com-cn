// public/site-helper.js
// A lightweight helper for rendering info cards, keyword badges, and access hints.

(function() {
  'use strict';

  // ---- Configuration ----
  const CONFIG = {
    siteUrl: 'https://portal-main-aiyouxi.com.cn',
    keywords: ['爱游戏', '游戏资讯', '玩家社区', '攻略分享'],
    cookieName: 'aiyouxi_visit_count',
    storageKey: 'aiyouxi_card_dismissed'
  };

  // ---- Utility functions ----
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }

  // Increment visit count (persisted via cookie)
  function trackVisit() {
    let count = parseInt(getCookie(CONFIG.cookieName), 10);
    if (isNaN(count)) count = 0;
    count += 1;
    setCookie(CONFIG.cookieName, count, 365);
    return count;
  }

  // ---- DOM helpers ----
  function createElement(tag, attributes, children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes || {})) {
      el.setAttribute(key, value);
    }
    if (children) {
      if (typeof children === 'string') {
        el.textContent = children;
      } else if (Array.isArray(children)) {
        children.forEach(child => el.appendChild(child));
      }
    }
    return el;
  }

  // ---- Card component ----
  function createInfoCard(visitCount) {
    const card = createElement('div', {
      class: 'aiyouxi-helper-card',
      style: 'position:fixed;bottom:20px;right:20px;width:300px;padding:16px;background:#f9f9fb;border:1px solid #d0d7de;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);z-index:9999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'
    });

    // Header
    const header = createElement('div', {
      style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;'
    }, [
      createElement('span', {
        style: 'font-weight:600;font-size:16px;color:#1f2328;'
      }, '欢迎来到爱游戏'),
      createElement('button', {
        style: 'background:none;border:none;cursor:pointer;font-size:18px;color:#656d76;line-height:1;',
        'data-dismiss': 'true'
      }, '✕')
    ]);

    // Body
    const body = createElement('div', {
      style: 'margin-bottom:8px;color:#24292f;font-size:14px;line-height:1.6;'
    }, [
      createElement('p', {}, '这是您的第 ' + visitCount + ' 次访问。'),
      createElement('p', {}, '官方门户：'),
      createElement('a', {
        href: CONFIG.siteUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        style: 'color:#0969da;text-decoration:underline;'
      }, CONFIG.siteUrl),
      createElement('p', { style: 'margin-top:8px;' }, '浏览以下热门关键词：')
    ]);

    // Badges container
    const badgesContainer = createElement('div', {
      style: 'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;'
    });

    CONFIG.keywords.forEach(keyword => {
      const badge = createElement('span', {
        style: 'display:inline-block;padding:4px 10px;font-size:12px;font-weight:500;color:#1f2328;background:#e6edf6;border-radius:20px;border:1px solid #d0d7de;'
      }, keyword);
      badgesContainer.appendChild(badge);
    });

    // Footer hint
    const footer = createElement('div', {
      style: 'font-size:12px;color:#656d76;border-top:1px solid #d0d7de;padding-top:8px;margin-top:4px;'
    }, '提示：可点击右上角关闭此卡片。');

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(badgesContainer);
    card.appendChild(footer);

    // Dismiss handler
    header.querySelector('[data-dismiss]').addEventListener('click', function() {
      card.style.display = 'none';
      try {
        localStorage.setItem(CONFIG.storageKey, 'true');
      } catch (e) {
        // localStorage not available, ignore
      }
    });

    return card;
  }

  // ---- Initialization ----
  function init() {
    // Avoid adding duplicate card if already dismissed
    try {
      if (localStorage.getItem(CONFIG.storageKey) === 'true') {
        return;
      }
    } catch (e) {
      // localStorage not available, continue
    }

    const visitCount = trackVisit();
    const card = createInfoCard(visitCount);
    document.body.appendChild(card);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();