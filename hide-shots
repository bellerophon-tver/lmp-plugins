(function () {
    'use strict';
    
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
            // Скрыть "Shots" из главного меню и карточек
            setInterval(() => {
                // Удаление из бокового меню
                let shots_menu = document.querySelector('.menu--right .selector[data-name*="shots"], .menu .item[data-menu*="shots"]');
                if (shots_menu) shots_menu.remove();
                
                // Скрытие из карточек фильмов/сериалов
                let shots_items = document.querySelectorAll('.full-max .items-line .item[data-type*="shots"], a[href*="shots"]');
                shots_items.forEach(item => {
                    item.style.display = 'none';
                    item.remove();
                });
                
                // CSS для надежности
                let style = document.createElement('style');
                style.textContent = `
                    [data-menu*="shots"], [data-type*="shots"], .shots-block, .moments { display: none !important; visibility: hidden !important; }
                    .menu .selector[href*="shots"] { display: none !important; }
                `;
                document.head.appendChild(style);
            }, 500);
        }
    });
    
    // Блокировка переходов на Shots
    Lampa.Modal.follow('open', function () {
        if (window.location.hash.includes('shots') || document.querySelector('.view--shots')) {
            window.history.back();
        }
    });
})();
