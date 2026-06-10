document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api/v1/content'
    : 'https://acdrm-backend.onrender.com/api/v1/content';

  const urlParams = new URLSearchParams(window.location.search);
  const identifier = urlParams.get("id") || urlParams.get("slug");

  if (!identifier) {
    console.error("Routing Error: No identification token metadata found in URL context.");
    window.location.href = "research.html";
    return;
  }

  async function hydratePublicationPage() {
    try {
      const response = await fetch(`${API_BASE_URL}/${identifier}`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const payload = await response.json();
      let pub = payload.data || payload.document || payload;
      
      if (Array.isArray(pub)) pub = pub[0];
      if (!pub || !pub.title) throw new Error("Invalid publication schema entry parsed from content registry.");

      // 1. Hydrate Text Meta Nodes
      document.title = `${pub.title} - ACDRM Publication`;
      
      const registryTagNode = document.getElementById("pub-registry-tag");
      if (registryTagNode) {
        registryTagNode.textContent = pub.category || pub.type || "Research & Analysis";
      }
      
      const titleNode = document.getElementById("pub-title");
      if (titleNode) titleNode.textContent = pub.title;
      
      const institutionNode = document.getElementById("pub-institution");
      if (institutionNode) {
        institutionNode.textContent = pub.author || pub.institution || "ACDRM Research Division";
      }
      
      const dateNode = document.getElementById("pub-date");
      if (dateNode) {
        dateNode.textContent = pub.createdAt 
          ? new Date(pub.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) 
          : "2026";
      }

      // 2. Handle the Download Asset Card via Existing DOM Nodes
      const pdfTargetAsset = pub.pdf || pub.pdfUrl || pub.fileAsset;
      const downloadLinkNode = document.getElementById("pub-download-link");
      const downloadCardNode = document.querySelector(".download-action-card");

      if (pdfTargetAsset && downloadLinkNode) {
        downloadLinkNode.href = pdfTargetAsset;
        if (downloadCardNode) downloadCardNode.style.display = "flex"; 
      } else if (downloadCardNode) {
        downloadCardNode.style.display = "none";
      }

      // 3. Assemble Abstract and Text Body Content
      const abstractHTML = pub.description ? `
        <p style="font-size: 1.15rem; line-height: 1.7; color: #2d3748; font-style: italic; margin-bottom: 25px;">
          ${pub.description}
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;" />
      ` : '';

      const bodyContent = pub.contentBody || pub.content || pub.body || '';
      const bodyHTML = bodyContent 
        ? `<div class="pub-main-body" style="line-height: 1.8; font-size: 1.05rem;">${bodyContent}</div>`
        : '<p class="text-muted italic">No further textual addendums attached to this index configuration.</p>';

      const abstractBodyNode = document.getElementById("pub-abstract-body");
      if (abstractBodyNode) {
        abstractBodyNode.innerHTML = `${abstractHTML}${bodyHTML}`;
      }

      // 4. Synchronize Visual Layout Transitions
      const loadingStateNode = document.getElementById("loading-state");
      const contentStateNode = document.getElementById("content-state");
      
      if (loadingStateNode) loadingStateNode.style.display = "none";
      if (contentStateNode) contentStateNode.style.display = "block";

      // Trigger context query execution block for related publications
      const currentId = pub._id || pub.id;
      if (currentId) {
        fetchRelatedPublications(currentId);
      }

      // Refresh scroll animation layouts
      if (window.AOS) {
        window.AOS.refresh();
      }

    } catch (error) {
      console.error("Publication Hydration Error Context:", error);
      renderFailureLayoutState(error.message);
    }
  }

  function renderFailureLayoutState(errorMessage) {
    const loadingNode = document.getElementById("loading-state");
    if (loadingNode) {
      loadingNode.innerHTML = `
        <div style="text-align: center; padding: 40px 0; color: #b91c1c;">
          <i class="bi bi-exclamation-triangle" style="font-size: 32px; display: block; margin-bottom: 12px;"></i>
          <p style="font-weight: 600; margin-top: 8px;">Failed to parse catalog criteria for this asset entry.</p>
          <p style="font-size: 13px; color: #666;">${errorMessage}</p>
        </div>
      `;
    }
  }

  async function fetchRelatedPublications(currentId) {
    const targetGrid = document.getElementById("related-publications-target");
    if (!targetGrid) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${currentId}/related?type=PUBLICATION`);
      if (!response.ok) return;
      
      const payload = await response.json();
      const records = payload.data || payload.documents || payload.document || [];

      const filtered = records.filter(item => item._id !== currentId).slice(0, 3);

      if (filtered.length === 0) {
        targetGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; font-size: 14px; padding: 20px 0;">No related publications found.</p>`;
        return;
      }

      targetGrid.innerHTML = filtered.map((item, idx) => `
        <a class="rel-card" href="publication.html?id=${item._id || item.id}" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
          <div class="rel-photo">
            <img src="${item.coverImage || '../assets/img/hero/hero-1.jpg'}" alt="${item.title}">
          </div>
          <div class="rel-body">
            <div class="rc">${item.category || item.type || 'Publication'}</div>
            <h3>${item.title}</h3>
          </div>
        </a>
      `).join("");

    } catch (err) {
      console.error("Fail safely on peer publication pipeline:", err);
    }
  }

  hydratePublicationPage();
});