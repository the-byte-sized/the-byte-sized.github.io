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
        const sectionHeadingWrappers = document.querySelectorAll(".section-heading-wrapper");
        
        sectionHeadingWrappers.forEach((el) => {
            const x = el.cloneNode(true);
            
            x.style.setProperty("position", 'absolute');
            
            x.style.setProperty('left', '-200vw');
            
            x.style.setProperty('top', '-200vh');
            
            const appended = document.body.appendChild(x);
            
            const sectionHeading = appended.querySelector('.section-heading');
            
            sectionHeading.textContent = sectionHeading.dataset.text;
            
            el.style.setProperty("height", getComputedStyle(appended).height);
            
            appended.remove();
        });
        
        const callback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const sectionHeading = entry.target.querySelector('.section-heading');
                        
                        new Typewriter(sectionHeading, {
                            delay: sectionHeading.dataset.delay || 50,
                            strings: sectionHeading.dataset.text,
                            autoStart: sectionHeading.dataset.autoStart || true,
                            stringSplitter: (input) => {
                                return Array.from(input);
                            }
                        });
                    }, 325);
                    
                    observer.unobserve(entry.target);
                }
            })
        }

        const observer = new IntersectionObserver(callback);

        sectionHeadingWrappers.forEach((element) => {
            observer.observe(element);
        });
    }
})