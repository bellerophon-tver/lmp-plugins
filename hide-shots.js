(function () {
    'use strict';
    function startPlugin() {
        window.hideshots = !0;
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                setInterval(() => {
                    // Главное меню
                    let shots_menu = document.querySelector('.menu--right .selector[data-name*="shots"], .menu .item[data-menu*="shots"], .menu-row [data-menu*="shots"]');
                    if (shots_menu)
                        shots_menu.remove();

                    // Карточки и каталог
                    let shots_items = document.querySelectorAll('.full-max .items-line .item[data-type*="shots"], a[href*="shots"], .item-shots');
                    shots_items.forEach(item => {
                        item.style.display = 'none';
                        item.remove();
                    });

                    // Окно выбора источника (player sources)
                    let source_shots = document.querySelectorAll('.selector[data-title*="Shots"], .menu-row .selector[data-name*="shots"], .player-sources [data-type*="shots"], .full-player-sources li[data-source*="shots"]');
                    source_shots.forEach(item => {
                        item.style.display = 'none';
                        item.remove();
                    });

                    // CSS стили
                    let style = document.createElement('style');
                    style.id = 'hide-shots-style';
                    style.textContent = `
                    [data-menu*="shots"], [data-type*="shots"], [data-name*="shots"], 
                    [data-title*="Shots"], [data-source*="shots"],
                    .shots-block, .moments, .player-sources .shots,
                    .menu .selector[href*="shots"], .full-player-sources [data-type*="shots"] { 
                        display: none !important; 
                        visibility: hidden !important; 
                        height: 0 !important; 
                        opacity: 0 !important;
                    }
                `;
                    if (!document.getElementById('hide-shots-style')) {
                        document.head.appendChild(style);
                    }
                }, 500);
            }
        })
    }

    if (!window.hideshots)
        startPlugin()
})()
