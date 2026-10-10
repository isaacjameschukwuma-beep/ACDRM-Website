// Detail page for "General" documents listed in assets/js/general-docs.js.
// No backend needed: everything comes from that list.
document.addEventListener("DOMContentLoaded", () => {
  const docs = window.ACDRM_GENERAL_DOCS || [];
  const id = new URLSearchParams(window.location.search).get("id");
  const doc = docs.find(d => d.id === id);

  if (!doc) {
    window.location.href = "research.html";
    return;
  }

  document.title = `${doc.title} - ACDRM`;
  document.getElementById("pub-registry-tag").textContent = doc.label || "General";
  document.getElementById("pub-title").textContent = doc.title;
  document.getElementById("pub-date").textContent =
    new Date(doc.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const coverImg = document.getElementById("pub-cover-img");
  coverImg.src = `../${doc.cover}`;
  coverImg.alt = doc.title;
  document.getElementById("pub-cover").hidden = false;

  const downloadLink = document.getElementById("pub-download-link");
  const downloadCard = document.querySelector(".download-action-card");
  if (doc.file) {
    downloadLink.href = `../${doc.file}`;
    downloadLink.setAttribute("download", doc.file.split("/").pop());
    downloadLink.removeAttribute("target");
  } else if (downloadCard) {
    downloadCard.style.display = "none";
  }

  const paragraphs = (doc.body && doc.body.length ? doc.body : [doc.summary || ""])
    .map(text => `<p>${text}</p>`)
    .join("");
  document.getElementById("pub-abstract-body").innerHTML = paragraphs;

  document.getElementById("loading-state").style.display = "none";
  document.getElementById("content-state").style.display = "block";

  // Other General documents, or hide the section when this is the only one
  const others = docs.filter(d => d.id !== doc.id).slice(0, 3);
  const moreSection = document.getElementById("more-docs-section");
  if (others.length === 0) {
    if (moreSection) moreSection.style.display = "none";
  } else {
    document.getElementById("related-publications-target").innerHTML = others.map(d => `
      <a class="rel-card" href="document.html?id=${d.id}">
        <div class="rel-photo"><img src="../${d.cover}" alt="${d.title}" loading="lazy"></div>
        <div class="rel-body">
          <div class="rc">${d.label || "General"}</div>
          <h3>${d.title}</h3>
        </div>
      </a>
    `).join("");
  }

  if (window.AOS) window.AOS.refresh();
});
