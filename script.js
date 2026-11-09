const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];

function closeMenu() {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
}

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        navigation.classList.toggle("is-open", !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const activeId = entry.target.id === "graphic-design" ? "work" : entry.target.id;
            navLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${activeId}`;
                link.classList.toggle("is-active", isActive);
                if (isActive) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
}

const trackRows = document.querySelectorAll(".track-row");
const playerMedia = document.querySelector("#player-media");
const currentCover = document.querySelector("#current-cover");
const currentTrack = document.querySelector("#current-track");
const currentArtist = document.querySelector("#current-artist");
const audioNotice = document.querySelector(".audio-notice span:last-child");
const youtubeFallback = document.querySelector("#youtube-fallback");

trackRows.forEach((track) => {
    track.addEventListener("click", () => {
        trackRows.forEach((row) => {
            const isSelected = row === track;
            row.classList.toggle("is-selected", isSelected);
            if (isSelected) row.setAttribute("aria-current", "true");
            else row.removeAttribute("aria-current");
        });

        if (playerMedia && currentTrack && currentArtist && track.dataset.video) {
            const player = document.createElement("iframe");
            player.title = `${track.dataset.title} by ${track.dataset.artist}`;
            player.src = `https://www.youtube.com/embed/${encodeURIComponent(track.dataset.video)}?autoplay=1&rel=0`;
            player.allow = "autoplay; encrypted-media; picture-in-picture";
            player.allowFullscreen = true;
            player.referrerPolicy = "strict-origin-when-cross-origin";
            playerMedia.replaceChildren(player);
            currentTrack.textContent = track.dataset.title;
            currentArtist.textContent = track.dataset.artist;
            if (audioNotice) audioNotice.textContent = "YouTube playback requested.";
            if (youtubeFallback) {
                youtubeFallback.href = `https://www.youtube.com/watch?v=${encodeURIComponent(track.dataset.video)}`;
                youtubeFallback.hidden = false;
            }
        }
    });
});