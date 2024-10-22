document.addEventListener('DOMContentLoaded', () => {
    const details = document.querySelector('details');

    if(!details?.querySelector('ul')) {
        details.classList.add('hidden');
    }
})