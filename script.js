const yearNode = document.querySelector("#year");
if (yearNode) yearNode.textContent = new Date().getFullYear();

const page = document.querySelector("[data-page]");
requestAnimationFrame(() => page?.classList.add("active"));

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navLinks?.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks?.classList.remove("open");
        menuButton?.setAttribute("aria-expanded", "false");
    });
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((section) => observer.observe(section));

const glow = document.querySelector(".cursor-glow");
document.addEventListener("pointermove", (event) => {
    if (!glow) return;
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
});

document.addEventListener("DOMContentLoaded", () => {
    const projectTrack = document.querySelector(".project-grid");
    const previousButton = document.querySelector(".project-prev");
    const nextButton = document.querySelector(".project-next");

    // Prevent errors on pages without the project carousel
    if (!projectTrack || !previousButton || !nextButton) {
        return;
    }

    function getScrollDistance() {
        const card = projectTrack.querySelector(".project-card");

        if (!card) {
            return 0;
        }

        const trackStyles = window.getComputedStyle(projectTrack);
        const gap = parseFloat(trackStyles.gap) || 0;

        return card.getBoundingClientRect().width + gap;
    }

    function updateArrowState() {
        const maximumScroll =
            projectTrack.scrollWidth - projectTrack.clientWidth;

        previousButton.disabled = projectTrack.scrollLeft <= 5;

        nextButton.disabled =
            projectTrack.scrollLeft >= maximumScroll - 5;
    }

    previousButton.addEventListener("click", () => {
        projectTrack.scrollBy({
            left: -getScrollDistance(),
            behavior: "smooth"
        });
    });

    nextButton.addEventListener("click", () => {
        projectTrack.scrollBy({
            left: getScrollDistance(),
            behavior: "smooth"
        });
    });

    projectTrack.addEventListener("scroll", updateArrowState);

    window.addEventListener("resize", updateArrowState);

    updateArrowState();
});
