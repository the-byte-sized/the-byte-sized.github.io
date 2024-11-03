document.addEventListener('DOMContentLoaded', () => {
  const constrain = 200;
  const mouseOverContainer = document.querySelector(".intro-text");
  const ex1Layer = document.querySelector(".intro-heading");

  const contactSection = document.getElementById('contact');

  function transforms(x, y, el) {
    const box = el.getBoundingClientRect();
    const calcX = -(y - box.y - (box.height / 2)) / constrain;
    const calcY = (x - box.x - (box.width / 2)) / constrain;

    return "perspective(300px) "
      + "   rotateX(" + calcX + "deg) "
      + "   rotateY(" + calcY + "deg) ";
  };

  function transformElement(el, xyEl) {
    el.style.transform = transforms.apply(null, xyEl);
  }

  mouseOverContainer.onmousemove = function (e) {
    const xy = [e.clientX, e.clientY];
    const position = xy.concat([ex1Layer]);

    window.requestAnimationFrame(function () {
      transformElement(ex1Layer, position);
    });
  };

  if (contactSection) {
    const contactSectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            document.querySelector('input[name="name"]')?.focus({
              focusVisible: true
            });
          }, 0);
        }
      })
    }

    const contactSectionObserver = new IntersectionObserver(contactSectionObserverCallback);

    contactSectionObserver.observe(contactSection);
  }

  document.querySelectorAll('.input-group-addon').forEach(el => el.addEventListener('click', ({ currentTarget }) => { currentTarget?.parentNode.querySelector('input')?.focus() }))
})