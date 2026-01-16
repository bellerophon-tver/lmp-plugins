// index.js - Lampa plugin to remove "Shots"
module.exports = function () {
    const removeShots = (menu) => {
        if (!menu || !Array.isArray(menu))
            return menu;
        return menu.filter(item => {
            // основные проверки: id, slug, title (на случай локализации)
            const id = (item.id || '').toString().toLowerCase();
            const slug = (item.slug || '').toString().toLowerCase();
            const title = (item.title || '').toString().toLowerCase();
            if (id === 'shots' || slug === 'shots' || title === 'shots')
                return false;

            // рекурсивно чистим вложенные меню
            if (Array.isArray(item.items)) {
                item.items = removeShots(item.items);
            }
            return true;
        });
    };

    // Патчим создание главного меню
    const origMenuBuild = Lampa.Menu && Lampa.Menu.build;
    if (origMenuBuild && typeof origMenuBuild === 'function') {
        Lampa.Menu.build = function () {
            const res = origMenuBuild.apply(this, arguments);
            try {
                if (Array.isArray(res))
                    return removeShots(res);
            } catch (e) {}
            return res;
        };
    }

    // Патчим любые функции, возвращающие меню коллекций/навигации
    const patchMethod = (obj, name) => {
        if (!obj || !obj[name] || typeof obj[name] !== 'function')
            return;
        const orig = obj[name];
        obj[name] = function () {
            const res = orig.apply(this, arguments);
            try {
                if (Array.isArray(res))
                    return removeShots(res);
            } catch (e) {}
            return res;
        };
    };

    // Примеры точек патча (зависят от версии Lampa)
    patchMethod(Lampa, 'menu'); // Lampa.menu()
    patchMethod(Lampa, 'navigation'); // Lampa.navigation()
    patchMethod(Lampa.Core && Lampa.Core, 'menu'); // Core.menu()

    // Наблюдатель за динамическими вставками в DOM (на случай runtime-рендеринга)
    try {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (!(node instanceof HTMLElement))
                        return;
                    // удаляем элементы по data-id/data-slug или по тексту
                    const targets = node.querySelectorAll('[data-id="shots"], [data-slug="shots"], *');
                    targets.forEach(el => {
                        const attrId = (el.getAttribute && el.getAttribute('data-id')) || '';
                        const attrSlug = (el.getAttribute && el.getAttribute('data-slug')) || '';
                        const txt = (el.textContent || '').trim().toLowerCase();
                        if (attrId.toLowerCase() === 'shots' || attrSlug.toLowerCase() === 'shots' || txt === 'shots') {
                            el.remove();
                        }
                    });
                });
            });
        });

        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });
    } catch (e) {}

    // Возвращаем объект плагина (если требуется API)
    return {
        name: 'remove-shots'
    };
};
