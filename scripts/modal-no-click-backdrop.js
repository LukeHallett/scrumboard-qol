const observer = new MutationObserver(function (mutations, observer) {
    mutations.forEach(function (mutation) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 1) {
                const node = mutation.addedNodes[i];

                if (node.classList.contains('modal-backdrop')) {
                    node.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });