window.greetingLocked = true;

document.addEventListener("DOMContentLoaded", function () {
    const sliderContent = [
      "Echoes",
      "Ethereal",
      "Neon Void",
      "Mystics",
      "Horizons",
      "Dystopian",
    ];
    const slider = document.querySelector(".slider");
    let activeSlide = 0;

    document.addEventListener("click", function () {
      if (window.greetingLocked) return;
      const currentSlide = slider.querySelector(".slide:not(.exiting)"); 
      const slideTheme = activeSlide % 2 ? "dark" : "light";
      activeSlide = (activeSlide + 1) % sliderContent.length;

      if (currentSlide) {
        const existingImgs = currentSlide.querySelectorAll("img");
        gsap.to(existingImgs, {
          top: "0%",
          duration: 1.5,
          ease: "power3.inOut",
        });
        // shrink the current slide with a circular clip so the transition feels round
        gsap.to(currentSlide, {
          clipPath: "circle(0% at 50% 50%)",
          duration: 1.4,
          ease: "power3.inOut",
        });
        currentSlide.classList.add("exiting");
      }

      const newSlide = document.createElement("div");
      newSlide.classList.add("slide");
      newSlide.classList.add(slideTheme);
      // start as a tiny circle at center so it can expand smoothly
      newSlide.style.clipPath = "circle(0% at 50% 50%)"; 

      const newSlideImg1 = document.createElement("div");
      newSlideImg1.className = "slide-img slide-img-1";
      const img1 = document.createElement("img");
      img1.src = `./assets/slider-${activeSlide + 1}-1.jpg`;
      img1.style.top = "100%";
      newSlideImg1.appendChild(img1);
      newSlide.appendChild(newSlideImg1);

      const newSlideContent = document.createElement("div");
      newSlideContent.classList.add("slide-content");
      newSlideContent.innerHTML = `<h1 style="scale: 1.5">${sliderContent[activeSlide]}</h1>`;
      newSlide.appendChild(newSlideContent);

      const newSlideImg2 = document.createElement("div");
      newSlideImg2.className = "slide-img slide-img-2";
      const img2 = document.createElement("img");
      img2.src = `./assets/slider-${activeSlide + 1}-2.jpg`;
      img2.style.top = "100%";
      newSlideImg2.appendChild(img2);
      newSlide.appendChild(newSlideImg2);

      slider.appendChild(newSlide);

      gsap.to(newSlide, {
        clipPath: "circle(150% at 50% 50%)",
        duration: 1.5,
        ease: "power3.inOut",
        onStart: () => {
          gsap.to([img1, img2], {
            top: "50%",
            duration: 1.5,
            ease: "power3.inOut",
          });
        },
        onComplete: () => {
          removeExtraSlides(slider);
        },
      });

      gsap.to(".slide-content h1", {
        scale: 1,
        duration: 1.5,
        ease: "power4.inOut",
      });
    });

    function removeExtraSlides(container) {
      while (container.children.length > 5) {
        container.removeChild(container.firstChild);
      }
    }
  });

  /*greeting seq*/
  (function () {
    const greetings = [
      { lang: 'Japanese', text: 'こんにちは' },
      { lang: 'English', text: 'Hello' },
      { lang: 'Korean', text: '안녕하세요' },
      { lang: 'Thai', text: 'สวัสดี' },
      { lang: 'Indonesian', text: 'Halo' },
      { lang: 'Spanish', text: 'Hola' },
      { lang: 'French', text: 'Bonjour' },
      { lang: 'German', text: 'Hallo' },
      { lang: 'Italian', text: 'Ciao' },
      { lang: 'Chinese', text: '你好' },
      { lang: 'Brand', text: 'RAFF' },
    ];

    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;

    greetingElement.textContent = greetings[0].text;
    greetingElement.classList.add('fade-in-slow');

    const initialHold = 3000;
    const fastInterval = 120;

    
    const quickSeq = greetings
      .filter(g => g.text !== greetings[0].text && g.text !== 'RAFF')
      .map(g => g.text);
    quickSeq.push('RAFF');

    setTimeout(() => {
      greetingElement.classList.remove('fade-in-slow');

      quickSeq.forEach((text, idx) => {
        setTimeout(() => {
          greetingElement.textContent = text;

          greetingElement.classList.remove('fade-in-fast');
          void greetingElement.offsetWidth;
          greetingElement.classList.add('fade-in-fast');

          if (idx === quickSeq.length - 1) {
            greetingElement.classList.remove('fade-in-fast');
            void greetingElement.offsetWidth;
            greetingElement.classList.add('fade-in-slow');

            const greetingHero = document.getElementById('greetingHero');
            if (greetingHero) {
              greetingHero.classList.add('awaiting-dismiss');

              const performDismiss = (originX, originY) => {
                // animate the overlay clip-path to shrink to a circle at the RAFF origin
                // and scale down the text slightly for a morph feel
                gsap.to(greetingElement, { scale: 0.6, opacity: 0.4, duration: 0.45, ease: 'power1.out' });
                gsap.to(greetingHero, {
                  clipPath: `circle(0px at ${originX}px ${originY}px)`,
                  duration: 0.85,
                  ease: 'power3.inOut',
                  onComplete: () => {
                    // remove overlay and unlock slider then advance
                    window.greetingLocked = false;
                    greetingHero.remove();
                    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                  }
                });
              };

              // dismiss handler anchored to the center of the RAFF text
              const dismiss = (evt) => {
                // compute RAFF center coordinates (prefer RAFF element center to match 'from RAFF' transition)
                const rect = greetingElement.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;

                // perform the morph animation from RAFF into slide
                performDismiss(Math.round(cx), Math.round(cy));

                // cleanup listeners
                greetingHero.removeEventListener('click', dismiss);
                document.removeEventListener('click', docDismiss);
              };

              // if user clicks anywhere, also dismiss (origin will still be RAFF center, so it morphs from RAFF)
              const docDismiss = (evt) => dismiss(evt);

              // attach listeners once
              greetingHero.addEventListener('click', dismiss, { once: true });
              document.addEventListener('click', docDismiss, { once: true });
            } else {
              // fallback: if not present, just unlock so slider works
              window.greetingLocked = false;
            }
          }
        }, idx * fastInterval);
      });
    }, initialHold);
  })();