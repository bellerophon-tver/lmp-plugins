(function () {
    'use strict';
    function deleteShotsPlugin() {
        window.hideShots = !0;
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                setInterval(() => {
                    e.object.activity.render().find('.view--online').remove();
                }, 500);
            }
        });
    }
    if (!window.hideShots)
        deleteShotsPlugin()
})()
