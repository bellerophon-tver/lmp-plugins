// index.js - Lampa plugin to remove "Shots"
(function () {
	'use strict';
	document.querySelectorAll('.selector').forEach(selector => {
        const span = selector.querySelector('span.title');
        if (span && span.textContent.trim() === 'Shots') {
            selector.remove();
        }
    });
})()
