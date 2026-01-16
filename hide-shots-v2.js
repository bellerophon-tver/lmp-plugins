// index.js - Lampa plugin to remove "Shots"
(function () {
	'use strict';
	
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

    // Возвращаем объект плагина (если требуется API)
    return {
        name: 'remove-shots'
    };
})()
