document.addEventListener("DOMContentLoaded", () => {
    if (Hiraku) {
        new Hiraku(".js-offcanvas", {
            btn: ".js-offcanvas-btn",
            fixedHeader: ".js-fixed-header",
            direction: "left",
            breakpoint: 767,
            width: '50%'
        });
    }

    if (Typewriter) {
        const sectionHeadings = document.querySelectorAll(".section-heading");
        const sectionHeadingWrappers = document.querySelectorAll(".section-heading-wrapper");

        sectionHeadingWrappers.forEach((el) => {
            setTimeout(() => {
                const clonedNode = el.cloneNode(true);

                clonedNode.style.setProperty("position", 'absolute');

                clonedNode.style.setProperty('left', '-200vw');

                clonedNode.style.setProperty('top', '-200vh');

                const appended = document.body.appendChild(clonedNode);

                const sectionHeading = appended.querySelector('.section-heading');

                sectionHeading.textContent = sectionHeading.dataset.text;

                el.style.setProperty("height", getComputedStyle(appended).height);

                appended.remove();
            }, 300);
        });

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

    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    const headerObserverCallback = ((entries, _observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting === false) {
                nav.style.setProperty('transform', 'translateY(0px)');
                nav.style.setProperty('background-color', 'rgb(0 0 0 / 0.75)');
                nav.style.setProperty('padding', '8px 0px');

            } else {
                nav.style.setProperty('transform', 'translateY(30px)');
                nav.style.setProperty('background-color', 'transparent');
            }
        })
    });

    const headerObserver = new IntersectionObserver(headerObserverCallback, {
        rootMargin: "-120px 0px 0px 0px"
    })

    headerObserver.observe(header);
})