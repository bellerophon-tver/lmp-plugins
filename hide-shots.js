(function() {
  'use strict';

  const SELECTOR = '.full-start__button.shots-view-button.selector.view--online';

  function removeOnce(node) {
    if (!node) return;
    // Скрыть (CSS) — безопаснее, чтобы не ломать скрипты страницы
    //node.style.setProperty('display','none','important');
    // Или полностью удалить из DOM:
    node.remove();
  }

  // Немедленная попытка удалить, если элемент уже есть
  document.querySelectorAll(SELECTOR).forEach(removeOnce);

  // Наблюдатель за динамическим добавлением элементов
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const added of m.addedNodes) {
        if (!(added instanceof Element)) continue;
        if (added.matches && added.matches(SELECTOR)) {
          removeOnce(added);
        }
        // если элемент содержит искомый потомок
        const found = added.querySelectorAll && added.querySelectorAll(SELECTOR);
        if (found && found.length) found.forEach(removeOnce);
      }
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });
})()
