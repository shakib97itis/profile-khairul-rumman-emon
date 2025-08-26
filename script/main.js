// menu section started
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuOpenIcon = document.getElementById("menu-open");
const menuCloseIcon = document.getElementById("menu-close");

menuBtn.addEventListener("click", () => {
  if (mobileMenu.classList.contains("max-h-0")) {
    mobileMenu.classList.remove("max-h-0");
    mobileMenu.style.maxHeight = "176px"; // dynamic height
  } else {
    mobileMenu.style.maxHeight = "0px";
    mobileMenu.classList.add("max-h-0");
  }
  menuOpenIcon.classList.toggle("hidden");
  menuCloseIcon.classList.toggle("hidden");
});
// menu section ended

// slider section started
const slider = document.getElementById("slider");
const dots = document.querySelectorAll(".dot");
let index = 0;
const total = slider.children.length;
let interval;

function showSlide(i) {
  index = (i + total) % total;
  slider.style.transform = `translateX(${-index * 100}%)`;

  dots.forEach((dot, dIndex) => {
    dot.classList.toggle("bg-white", dIndex === index);
    dot.classList.toggle("bg-white/50", dIndex !== index);
  });
}

function startAutoSlide() {
  interval = setInterval(() => {
    if (index === total - 1) {
      index = 0;
    } else {
      index++;
    }
    showSlide(index);
  }, 3000);
}

function resetAutoSlide() {
  clearInterval(interval);
  startAutoSlide();
}

document.getElementById("next").addEventListener("click", () => {
  if (index === total - 1) {
    index = 0;
  } else {
    index++;
  }
  showSlide(index);
  resetAutoSlide();
});

document.getElementById("prev").addEventListener("click", () => {
  if (index === 0) {
    index = total - 1;
  } else {
    index--;
  }
  showSlide(index);
  resetAutoSlide();
});

dots.forEach((dot, dIndex) => {
  dot.addEventListener("click", () => {
    index = dIndex;
    showSlide(index);
    resetAutoSlide();
  });
});

let startX = 0;
slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
slider.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) {
    if (index === total - 1) {
      index = 0;
    } else {
      index++;
    }
    showSlide(index);
    resetAutoSlide();
  } else if (endX - startX > 50) {
    if (index === 0) {
      index = total - 1;
    } else {
      index--;
    }
    showSlide(index);
    resetAutoSlide();
  }
});

showSlide(index);
startAutoSlide();
// slider section ended

// scroll top button started
const scrollBtn = document.getElementById("scrollTopBtn");

// show/hide button on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollBtn.classList.remove("opacity-0", "pointer-events-none");
    scrollBtn.classList.add("opacity-70");
  } else {
    scrollBtn.classList.add("opacity-0", "pointer-events-none");
    scrollBtn.classList.remove("opacity-70");
  }
});

// scroll to top smoothly
scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
// scroll top button ended

// contact form started
document.getElementById('contact-form').addEventListener('submit', (e) => {
  console.log("WORKING")
  e.preventDefault();

  const name = e.target[0].value;
  const email = e.target[1].value;
  const message = e.target[2].value;

  const templateParams = {
    name,
    email,
    message
  }
  console.log(templateParams)
  emailjs.send("service_awfmp2r", "template_935xakn", templateParams);
});
// contact form ended

