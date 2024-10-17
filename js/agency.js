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
        const servicesSectionHeading = document.querySelector("#services .section-heading");
        const portfolioSectionHeading = document.querySelector("#portfolio .section-heading");
        const clientsSectionHeading = document.querySelector("#clients .section-heading");
        const teamSectionHeading = document.querySelector("#team .section-heading");
        const contactSectionHeading = document.querySelector("#contact .section-heading");

        const callback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    new Typewriter(entry.target, {
                        delay: 50,
                        strings: entry.target.dataset.text,
                        autoStart: true,
                        stringSplitter: (input) => {
                            return Array.from(input);
                        }
                    });

                    observer.unobserve(entry.target);
                }
            })
        }

        const observer = new IntersectionObserver(callback);

        [
            servicesSectionHeading,
            portfolioSectionHeading,
            clientsSectionHeading,
            teamSectionHeading,
            contactSectionHeading
        ].forEach((element) => {
            observer.observe(element);
        });
    }
})