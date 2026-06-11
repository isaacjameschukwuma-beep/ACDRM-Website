document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = 'https://acdrm-backend.onrender.com/api/v1/content';

  const urlParams = new URLSearchParams(window.location.search);
  // Support both ID tracking and SEO slug matching patterns
  const blogIdentifier = urlParams.get("id") || urlParams.get("slug");

  if (!blogIdentifier) {
    console.error("Routing Error: No identification token metadata found in URL context.");
    window.location.href = "research.html";
    return;
  }

  async function hydrateBlogPage() {
    try {
      // Correct target mapping to single-item document resource endpoint
      const response = await fetch(`${API_BASE_URL}/${blogIdentifier}`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const payload = await response.json();
      // Safe extraction wrapper handles varying backend envelope patterns
      const blog = payload.data || payload.document || payload;
      
      if (!blog || !blog.title) throw new Error("Invalid payload schema returned from content registry.");

      // Dynamic DOM Document Title Hydration
      document.title = `${blog.title} - ACDRM Blog`;
      
      // Node Text Injections
      document.getElementById("art-category").textContent = blog.category || blog.status || "Blog Insights";
      document.getElementById("art-title").textContent = blog.title;
      document.getElementById("art-author").textContent = blog.author || "ACDRM Editorial";
      
      // Date Normalization Layer
      document.getElementById("art-date").textContent = blog.createdAt 
        ? new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) 
        : "2026";
        
      // Read Time Fallback Logic
      const minutesToRead = blog.readTime || blog.readMins || "5";
      document.getElementById("art-read-time").textContent = `${minutesToRead} min read`;
      
      // Media Node Configuration
      const coverImgNode = document.getElementById("art-cover-img");
      coverImgNode.src = blog.coverImage || "../assets/img/hero/hero-2.jpg";
      coverImgNode.alt = blog.title;

      // Composition Layout Elements
      const abstractHTML = blog.description ? `
        <div class="blog-lead-summary" style="font-size: 1.2rem; line-height: 1.7; color: #4a5568; font-weight: 500; margin-bottom: 30px; border-left: 4px solid var(--accent-color, #d4af37); padding-left: 15px; font-style: italic;">
          ${blog.description}
        </div>
      ` : '';

      const dynamicBodyText = blog.contentBody || blog.content || blog.body || '';
      const bodyHTML = `<div class="blog-main-content" style="line-height: 1.8; font-size: 1.05rem;">${dynamicBodyText}</div>`;

      // Target Fragment Injection
      document.getElementById("art-content-body").innerHTML = `${abstractHTML}${bodyHTML}`;

      // Orchestrate UI Pipeline State Visibility
      document.getElementById("loading-state").style.display = "none";
      document.getElementById("content-state").style.display = "block";

      // Trigger Related Content Recommendations Gathering Pipeline
      const currentId = blog._id || blog.id;
      if (currentId && blog.type) {
        fetchRelatedContent(currentId, blog.type);
      }

      // Refresh Animation Node Calculation Matrix
      if (window.AOS) {
        window.AOS.refresh();
      }

    } catch (error) {
      console.error("Blog Hydration Failure:", error);
      
      // Clear out layout dependencies cleanly on exception
      const loadingNode = document.getElementById("loading-state");
      if (loadingNode) {
        loadingNode.innerHTML = `
          <div style="text-align: center; padding: 40px 0; color: #b91c1c;">
            <i class="bi bi-exclamation-triangle" style="font-size: 48px; display: block; margin-bottom: 12px;"></i>
            <p style="font-weight: 600;">Failed to load blog post details.</p>
            <p style="font-size: 14px; color: #666;">Verify the content server is running or the resource ID exists.</p>
          </div>
        `;
      }
    }
  }

  async function fetchRelatedContent(currentId, contentType) {
    const gridContainer = document.getElementById("related-grid");
    if (!gridContainer) return;

    try {
      // Targets your newly implemented clean static route layout
      const response = await fetch(`${API_BASE_URL}/${currentId}/related?type=${contentType}`);
      if (!response.ok) throw new Error("Could not collect related assets array data envelope");

      const payload = await response.json();
      const records = payload.data || payload.document || [];

      if (records.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; font-size: 14px; margin: 24px 0;">No matching adjacent contextual updates distributed yet.</p>`;
        return;
      }

      // Map up to 3 recommendation items cleanly into responsive CSS framework
      gridContainer.innerHTML = records.slice(0, 3).map(item => {
        const itemId = item._id || item.id;
        const formattedCardDate = item.createdAt 
          ? new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
          : "2026";
        
        // Dynamically tracks the current filename path matrix regardless of deployment depths
        const activePageFilename = window.location.pathname.split("/").pop() || "blog.html";

        return `
          <div class="related-card">
            <div style="width: 100%; height: 180px; overflow: hidden; border-bottom: 1px solid #e2e8f0;">
              <img src="${item.coverImage || '../assets/img/hero/hero-2.jpg'}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 24px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: var(--gold-color, #d4af37); text-transform: uppercase; letter-spacing: 0.5px;">${item.type}</span>
                <h4 style="font-size: 16px; font-weight: 700; margin: 8px 0 12px; line-height: 1.4; color: #0f172a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.title}</h4>
                <p style="font-size: 13px; color: #475569; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0 0 20px; line-height: 1.6;">${item.description || ''}</p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                <span><i class="bi bi-calendar3" style="margin-right: 4px;"></i> ${formattedCardDate}</span>
                <a href="${activePageFilename}?id=${itemId}" style="color: #0f172a; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">Read &rarr;</a>
              </div>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error("Related logs layout aggregation failure:", err);
      gridContainer.innerHTML = '';
    }
  }

  hydrateBlogPage();
});