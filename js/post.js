document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const details = document.querySelector('details');
    const rootElement = document.documentElement;
    let hasCssClassesBeenAdded = false;

    function scrollToTop () {
        rootElement.scrollTo({
        top: 0,
        behavior: "smooth"
        })
    }

    function handleScroll() {
        const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
        
        if ((rootElement.scrollTop / scrollTotal ) > 0.40 ) {
            scrollToTopBtn.classList.add("showBtn")
            
            if(!hasCssClassesBeenAdded) {
                setTimeout(() => {
                    scrollToTopBtn.firstElementChild.classList.add("animate__animated", "animate__bounce");
                    hasCssClassesBeenAdded = true;
                }, 300);

                scrollToTopBtn.firstElementChild.addEventListener("animationend", () => {
                    scrollToTopBtn.firstElementChild.classList.remove("animate__animated", "animate__bounce");
                });
            }
        } else {
            scrollToTopBtn.classList.remove("showBtn");
            scrollToTopBtn.firstElementChild.classList.remove("animate__animated", "animate__bounce");
            hasCssClassesBeenAdded = false;
        }
    }

    document.addEventListener("scroll", handleScroll);

    scrollToTopBtn?.addEventListener("click", scrollToTop);

    if(!details?.querySelector('ul')) {
        details.classList.add('hidden');
    }
})