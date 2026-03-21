// ==UserScript==
// @name         x to fxtwitter (goated edition)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Replaces x.com with fxtwitter.com, strips tracking params, intercepts share buttons & right-clicks.
// @author       PochitaMan
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    // captures link with username and anything past that, strips tracking params
    const twitterRegex = /https?:\/\/(?:x|twitter)\.com\/([a-zA-Z0-9_]+(?:\/[^?\s]*)?)(?:\?\S*)?/g;
    // intercept ctrl+c & highlighting text
    document.addEventListener('copy', (event) => {
        const selection = window.getSelection().toString();
        if (!selection) return;
        const newLink = selection.replace(twitterRegex, 'https://fxtwitter.com/$1');
        if (newLink !== selection) {
            event.clipboardData.setData('text/plain', newLink);
            event.preventDefault();
        }
    }, true);
    // intercet 'copy link' button
    const originalWriteText = navigator.clipboard.writeText;
    navigator.clipboard.writeText = function(text) {
        try {
            if (typeof text === 'string') {
                text = text.replace(twitterRegex, 'https://fxtwitter.com/$1');
            }
        } catch (error) {
            console.error("fxtwitter Script Error (Clipboard):", error);
            // fall back to default justin case
        }
        return originalWriteText.call(this, text);
    };
    // intercept right click -> copy link
    document.addEventListener('contextmenu', (event) => {
        const link = event.target.closest('a');
        if (link && link.href) {
            const newHref = link.href.replace(twitterRegex, 'https://fxtwitter.com/$1');

            if (newHref !== link.href) {
                const originalHref = link.href;
                link.href = newHref;

                // revert the link after the browser's context menu grabs it
                setTimeout(() => {
                    link.href = originalHref;
                }, 50);
            }
        }
    });
})();