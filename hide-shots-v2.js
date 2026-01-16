(function () {
    'use strict';
    function startPlugin() {
        window.hideshots = !0;
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                setInterval(() => {
                    ocument.querySelectorAll('.selector').forEach(selector => {
                        const span = selector.querySelector('span.title');
                        if (span && span.textContent.trim() === 'Shots') {
                            selector.remove();
                        }
                    }
                    }, 500);
                }
            })
        }

        if (!window.hideshots)
            startPlugin()
    })()
