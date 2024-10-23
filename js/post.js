document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn")
    const details = document.querySelector('details');
    const rootElement = document.documentElement;

    function scrollToTop () {
        rootElement.scrollTo({
        top: 0,
        behavior: "smooth"
        })
    }

    function handleScroll() {
        const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
        
        if ((rootElement.scrollTop / scrollTotal ) > 0.80 ) {
            scrollToTopBtn.classList.add("showBtn")
        } else {
        scrollToTopBtn.classList.remove("showBtn")
        }
    }

    document.addEventListener("scroll", handleScroll);

    scrollToTopBtn?.addEventListener("click", scrollToTop);

    if(!details?.querySelector('ul')) {
        details.classList.add('hidden');
    }
})