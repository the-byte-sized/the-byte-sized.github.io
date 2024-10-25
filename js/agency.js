document.addEventListener("DOMContentLoaded", () => {
    if (Typewriter) {
        const sectionHeadings = document.querySelectorAll(".section-heading");

        const sectionHeadingsCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        new Typewriter(entry.target, {
                            delay: entry.target.dataset.delay || 50,
                            strings: entry.target.dataset.text,
                            autoStart: entry.target.dataset.autoStart || true,
                            stringSplitter: (input) => {
                                return Array.from(input);
                            }
                        });
                    }, 325);
                    
                    observer.unobserve(entry.target);
                }
            })
        }

        const sectionHeadingsObserver = new IntersectionObserver(sectionHeadingsCallback);

        sectionHeadings.forEach((element) => {
            sectionHeadingsObserver.observe(element);
        });
    }


    const lazyLoadedBgsCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.setProperty('background-image', `url('${entry.target.dataset.backgroundImage}')`);
                
                observer.unobserve(entry.target);
            }
        })
    }

    const lazyLoadedBgsObserver = new IntersectionObserver(lazyLoadedBgsCallback, {
        rootMargin: "-100px 0px 0px 0px"
    });

    document.querySelectorAll('[data-lazy-load-bg]').forEach((element) => {
        lazyLoadedBgsObserver.observe(element);
    });
    
    const servicesSection = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    const callback = ((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting === false) {
                nav.style.setProperty('transform', 'translateY(0px)');
                nav.style.setProperty('background-color', 'rgb(0 0 0 / 0.75)');
            } else {
                nav.style.setProperty('transform', 'translateY(30px)');
                nav.style.setProperty('background-color', 'transparent');
            }
        })        
    });
    
    const observer = new IntersectionObserver(callback, {
        rootMargin: "-120px 0px 0px 0px"
    })
    
    observer.observe(servicesSection);
    
    console.log(servicesSection);
})