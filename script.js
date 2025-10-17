document.addEventListener("DOMContentLoaded", function () {
  lucide.createIcons();

  const header = document.getElementById("page-header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("bg-white/95", "backdrop-blur-md", "shadow-md");
        header.classList.remove("bg-white/80", "backdrop-blur-sm");
      } else {
        header.classList.remove("bg-white/95", "backdrop-blur-md", "shadow-md");
        header.classList.add("bg-white/80", "backdrop-blur-sm");
      }
    };
    window.addEventListener("scroll", handleScroll);
  }

  const slider = document.getElementById("testimonial-slider");
  if (slider) {
    const testimonials = slider.children;
    const totalTestimonials = testimonials.length;
    const prevButton = document.getElementById("prev-testimonial");
    const nextButton = document.getElementById("next-testimonial");
    const dotsContainer = document.getElementById("testimonial-dots");
    let currentTestimonial = 0;
    let autoPlayInterval;

    if (dotsContainer) {
      for (let i = 0; i < totalTestimonials; i++) {
        const dot = document.createElement("button");
        dot.classList.add("w-2", "h-2", "rounded-full", "transition-all");
        dot.addEventListener("click", () => {
          goToTestimonial(i);
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    const dots = dotsContainer ? dotsContainer.children : [];

    const updateSlider = () => {
      slider.style.transform = `translateX(-${currentTestimonial * 100}%)`;
      for (let i = 0; i < dots.length; i++) {
        if (i === currentTestimonial) {
          dots[i].classList.add("bg-blue-600", "w-8");
          dots[i].classList.remove("bg-gray-300");
        } else {
          dots[i].classList.remove("bg-blue-600", "w-8");
          dots[i].classList.add("bg-gray-300");
        }
      }
    };

    const goToTestimonial = (index) => {
      currentTestimonial = index;
      updateSlider();
    };

    const next = () => {
      currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
      updateSlider();
    };

    const prev = () => {
      currentTestimonial =
        (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
      updateSlider();
    };

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(next, 6000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    if (nextButton && prevButton) {
      nextButton.addEventListener("click", () => {
        next();
        resetAutoPlay();
      });
      prevButton.addEventListener("click", () => {
        prev();
        resetAutoPlay();
      });
    }

    updateSlider();
    startAutoPlay();
  }

  const accordions = document.querySelectorAll("#faq-accordion");
  if (accordions.length > 0) {
    accordions.forEach((accordion) => {
      const triggers = accordion.querySelectorAll(".accordion-trigger");

      triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
          const content = trigger.nextElementSibling;
          const item = trigger.parentElement;
          const icon = trigger.querySelector('[data-lucide="chevron-down"]');
          const isOpen = item.classList.contains("open");

          const allItems = accordion.querySelectorAll(".accordion-trigger");
          allItems.forEach((otherTrigger) => {
            const otherItem = otherTrigger.parentElement;
            if (
              otherTrigger !== trigger &&
              otherItem.classList.contains("open")
            ) {
              otherItem.classList.remove("open");
              otherTrigger.nextElementSibling.style.maxHeight = null;
              otherTrigger.querySelector(
                '[data-lucide="chevron-down"]'
              ).style.transform = "rotate(0deg)";
            }
          });

          if (isOpen) {
            item.classList.remove("open");
            content.style.maxHeight = null;
            if (icon) icon.style.transform = "rotate(0deg)";
          } else {
            item.classList.add("open");
            content.style.maxHeight = content.scrollHeight + "px";
            if (icon) icon.style.transform = "rotate(180deg)";
          }
        });
      });
    });
  }
});
