/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function () {
    $('.navbar-toggle:visible').click();
});

$('div.modal').on('show.bs.modal', function () {
    var modal = this;
    var hash = modal.id;
    window.location.hash = hash;
    window.onhashchange = function () {
        if (!location.hash) {
            $(modal).modal('hide');
        }
    }
});

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

    const lazyLoadedBgsObserver = new IntersectionObserver(lazyLoadedBgsCallback);

    document.querySelectorAll('[data-lazy-load-bg]').forEach((element) => {
        lazyLoadedBgsObserver.observe(element);
    });
})