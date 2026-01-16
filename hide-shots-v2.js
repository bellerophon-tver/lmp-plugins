// Удаляет пункт "Shots" только в окне выбора источника (source selector)
(function () {
	'use strict';
    const isShotsItem = (item) => {
    if (!item) return false;
    const id = (item.id || '').toString().toLowerCase();
    const slug = (item.slug || '').toString().toLowerCase();
    const title = (item.title || '').toString().toLowerCase();
    return id === 'shots' || slug === 'shots' || title === 'shots';
  };

  const removeShotsFromList = (list) => {
    if (!Array.isArray(list)) return list;
    return list.filter(item => {
      if (isShotsItem(item)) return false;
      if (Array.isArray(item.items)) item.items = removeShotsFromList(item.items);
      return true;
    });
  };

  // Патч для функции, которая строит диалог выбора источника.
  // Название метода может отличаться в реализации Lampa — перечислены популярные варианты.
  const patch = (obj, method) => {
    if (!obj || typeof obj[method] !== 'function') return;
    const orig = obj[method];
    obj[method] = function() {
      const res = orig.apply(this, arguments);

      try {
        // Если функция возвращает список источников — отфильтровываем.
        if (Array.isArray(res)) return removeShotsFromList(res);

        // Если функция создаёт/открывает диалог и принимает список в аргументах —
        // ищем первый аргумент-список и очищаем его перед вызовом оригинала.
      } catch (e) {}

      return res;
    };
  };

  // Популярные места: Source selector API, Player.selectSource, Lampa.Selector.source и пр.
  patch(Lampa && Lampa.Player, 'selectSource');         // Lampa.Player.selectSource()
  patch(Lampa && Lampa.Selector, 'source');             // Lampa.Selector.source()
  patch(Lampa && Lampa.Chooser, 'sources');             // Lampa.Chooser.sources()
  patch(Lampa, 'sources');                              // Lampa.sources()

  // Патч вариантов, где метод принимает список аргументов (перехват входных данных)
  const patchWithArgs = (obj, method) => {
    if (!obj || typeof obj[method] !== 'function') return;
    const orig = obj[method];
    obj[method] = function() {
      try {
        // клонируем аргументы и очистим массивы источников
        const args = Array.from(arguments);
        for (let i = 0; i < args.length; i++) {
          if (Array.isArray(args[i])) args[i] = removeShotsFromList(args[i]);
        }
        return orig.apply(this, args);
      } catch (e) {
        return orig.apply(this, arguments);
      }
    };
  };

  patchWithArgs(Lampa && Lampa.Player, 'openSources');  // пример: Player.openSources(list)
  patchWithArgs(Lampa && Lampa.Selector, 'open');       // Selector.open(list)

  // Наблюдатель за динамическим рендерингом окна выбора источников в DOM.
  try {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;

          // Пробуем найти контейнер выбора источников по классам/атрибутам.
          // Популярные варианты: .source-selector, .sources-list, .choose-source
          const containers = node.matches && (node.matches('.source-selector, .sources-list, .choose-source')) ?
            [node] : Array.from(node.querySelectorAll('.source-selector, .sources-list, .choose-source'));

          containers.forEach(cont => {
            // Находим элементы списка и удаляем элементы с текстом или data-* = "shots"
            const items = cont.querySelectorAll('[data-id], [data-slug], .item, li, a, button');
            items.forEach(el => {
              const dataId = (el.getAttribute && el.getAttribute('data-id') || '').toLowerCase();
              const dataSlug = (el.getAttribute && el.getAttribute('data-slug') || '').toLowerCase();
              const txt = (el.textContent || '').trim().toLowerCase();
              if (dataId === 'shots' || dataSlug === 'shots' || txt === 'shots') el.remove();
            });
          });
        });
      });
    });

    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
  } catch (e) {}

  return { name: 'remove-shots-source' };
})()
