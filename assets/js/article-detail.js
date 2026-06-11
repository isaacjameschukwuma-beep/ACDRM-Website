document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = 'https://acdrm-backend.onrender.com/api/v1/content';

  const urlParams = new URLSearchParams(window.location.search);
  const articleIdentifier = urlParams.get("id") || urlParams.get("slug");

  if (!articleIdentifier) {
    console.error("Routing Error: No identification token metadata found in URL context.");
    window.location.href = "research.html";
    return;
  }

  async function hydrateArticlePage() {
    try {
      const response = await fetch(`${API_BASE_URL}/${articleIdentifier}`);
      console.log(response)
      
      if (!response.ok) {
        throw new Error(`HTTP network error condition observed. Status: ${response.status}`);
      }
      
      const payload = await response.json();
      
      const article = payload.data || payload.document || payload;
      
      if (!article || !article.title) {
        throw new Error("Target payload parsing empty or failed validation filters.");
      }

      document.title = `${article.title} - ACDRM News & Insights`;
      document.getElementById("art-category").textContent = article.category || article.status || "Insight";
      document.getElementById("art-title").textContent = article.title;
      document.getElementById("art-author").textContent = article.author || "ACDRM Editorial";
      document.getElementById("art-date").textContent = formatDate(article.createdAt);
      document.getElementById("art-read-time").textContent = article.readTime ? `${article.readTime} min read` : "5 min read";
      
      const coverImgNode = document.getElementById("art-cover-img");
      coverImgNode.src = article.coverImage || "../assets/img/hero/hero-2.jpg";
      coverImgNode.alt = article.title;

      const descriptionBlock = article.description 
        ? `
          <div class="article-lead-abstract" style="
            font-size: 1.22rem; 
            line-height: 1.75; 
            color: var(--text-muted-color, #4a5568); 
            font-weight: 500;
            padding-left: 20px; 
            border-left: 4px solid var(--accent-color, #d4af37); 
            margin-bottom: 35px;
            font-style: italic;
          ">
            ${article.description}
          </div>
        ` 
        : '';

      const dynamicBodyText = article.contentBody || article.content || article.body;
      const bodyBlock = dynamicBodyText 
        ? `<div class="article-core-markup" style="line-height: 1.8; font-size: 1.05rem;">${dynamicBodyText}</div>`
        : '<p class="text-muted">No supplementary content body available for this entry.</p>';

      document.getElementById("art-content-body").innerHTML = `${descriptionBlock}${bodyBlock}`;

      initializeShareUtilities(article.title);
      fetchRelatedInsights(article.category || article.status, article._id || article.id);

      if (window.AOS) {
        window.AOS.refresh();
      }

    } catch (error) {
      console.error("Hydration execution failed context dump:", error);
      document.getElementById("art-content-body").innerHTML = `
        <div style="text-align: center; padding: 40px 0;">
          <i class="bi bi-exclamation-triangle" style="font-size: 48px; color: var(--gold-color);"></i>
          <h2 style="margin-top: 16px;">Failed to load article details.</h2>
          <p>The requested publication might have been archived or moved.</p>
          <a href="research.html" class="btn-outline-hero" style="margin-top: 16px; display: inline-block; padding: 8px 16px; border: 1px solid var(--accent-color); text-decoration: none; border-radius: 4px;">Return to Research Hub</a>
        </div>
      `;
    }
  }

  async function fetchRelatedInsights(category, currentId) {
    const targetGrid = document.getElementById("related-posts-target");
    if (!targetGrid) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${currentId}/related?type=ARTICLE`);
      if (!response.ok) return;
      
      const payload = await response.json();
      const records = payload.data || payload.documents || payload.document || [];

      const filtered = records.filter(item => item._id !== currentId).slice(0, 3);

      if (filtered.length === 0) {
        targetGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; font-size: 14px; padding: 20px 0;">No related articles found.</p>`;
        return;
      }

      targetGrid.innerHTML = filtered.map((item, idx) => `
        <a class="rel-card" href="article.html?id=${item._id || item.id}" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
          <div class="rel-photo">
            <img src="${item.coverImage || '../assets/img/hero/hero-1.jpg'}" alt="${item.title}">
          </div>
          <div class="rel-body">
            <div class="rc">${item.category || item.status || 'Article'}</div>
            <h3>${item.title}</h3>
          </div>
        </a>
      `).join("");

    } catch (err) {
      console.error("Fail safely on peer insight pipeline:", err);
    }
  }

  function initializeShareUtilities(title) {
    const currentUrl = encodeURIComponent(window.location.href);
    const sharedText = encodeURIComponent(title);

    document.getElementById("share-linkedin").href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
    document.getElementById("share-x").href = `https://x.com/intent/tweet?url=${currentUrl}&text=${sharedText}`;
    document.getElementById("share-email").href = `mailto:?subject=${sharedText}&body=Check out this research entry from ACDRM: ${currentUrl}`;
    
    const copyBtn = document.getElementById("share-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            const originalInner = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i class="bi bi-check2" style="color: var(--green-color)"></i>`;
            setTimeout(() => { copyBtn.innerHTML = originalInner; }, 2000);
          })
          .catch(err => console.error("Clipboard writing error:", err));
      });
    }
  }

  // Pure textual formatting utility context
  function formatDate(rawString) {
    if (!rawString) return "2026";
    const dateObj = new Date(rawString);
    if (isNaN(dateObj.getTime())) return rawString;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  hydrateArticlePage();
});