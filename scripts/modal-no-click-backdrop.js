const head = document.getElementsByTagName('head');

if (head.length > 0) {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode('.modal-backdrop { pointer-events: none; }'));

    head[0].appendChild(style);
}