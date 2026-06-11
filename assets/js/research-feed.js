const API_BASE_URL = 'https://acdrm-backend.onrender.com/api/v1/content';

let currentTab = "publications"; 
let currentPage = 1;
const recordsLimit = 6;

document.addEventListener("DOMContentLoaded", () => {
  initResearchEngine();
  hydrateNewsInsightFeed();
});

function initResearchEngine() {
  const tabButtons = document.querySelectorAll('.research-tabs button');
  
  fetchTabulatedFeed(currentTab, currentPage);

  tabButtons.forEach(button => {
    button.addEventListener('click', async () => {
      if (button.classList.contains('active')) return;

      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      currentTab = button.getAttribute('data-tab');
      currentPage = 1; 
      await fetchTabulatedFeed(currentTab, currentPage);
    });
  });
}

async function fetchTabulatedFeed(contentType, page) {
  const gridTarget = document.getElementById("dynamic-grid-target");
  
  gridTarget.innerHTML = `
    <div class="text-center w-100 py-5" style="grid-column: 1 / -1;">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2">Streaming structured data context...</p>
    </div>
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/feed/${contentType}?page=${page}&limit=${recordsLimit}`);
    const payload = await response.json();

    if (!payload.success || !payload.documents || payload.documents.length === 0) {
      displayEmptyState(gridTarget, contentType);
      renderPaginationControls(payload.pagination || {});
      return;
    }

    gridTarget.innerHTML = payload.documents.map(item => compileCardTemplate(item)).join('');
    
    renderPaginationControls(payload.pagination);
    
    if (window.AOS) window.AOS.refresh();

  } catch (error) {
    console.error("Critical Runtime Feed Ingestion Failure:", error);
    gridTarget.innerHTML = `
      <div class="alert alert-danger text-center w-100" style="grid-column: 1 / -1;" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i> Data extraction service context dropped. Please attempt to refresh.
      </div>
    `;
  }
}

function compileCardTemplate(item) {
  const tagClassMap = {
    "BLOG": "blog",
    "ARTICLE": "article",
    "PUBLICATION": "book",
    "PDF": "journal"
  };

  const cssTag = tagClassMap[item.type] || "book";
  const contentYear = item.createdAt ? new Date(item.createdAt).getFullYear() : 'Ongoing';
  
  let interactiveFooter = `<div class="meta"><span class="pub">${item.status || "ACDRM Publication"}</span> · ${contentYear}</div>`;
  
  // MODIFIED: Standardized layout routing across all internal document types
  if (item.type === "ARTICLE") {
    interactiveFooter += `<a href="article.html?id=${item._id}" class="pub-link">Read article <i class="bi bi-arrow-right"></i></a>`;
  } else if (item.type === "BLOG") {
    interactiveFooter += `<a href="blog.html?id=${item._id}" class="pub-link">Read on the blog <i class="bi bi-arrow-right"></i></a>`;
  } else {
    // Intercepts "PUBLICATION" or "PDF" types and safely routes to your new publication details page
    interactiveFooter += `<a href="publication.html?id=${item._id}" class="pub-link">View details & download <i class="bi bi-arrow-right"></i></a>`;
  }

  return `
    <div class="pub-card" data-aos="fade-up">
      <span class="pub-tag ${cssTag}">${item.type}</span>
      <h3>${item.title}</h3>
      <p class="text-muted small" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        ${item.description || ''}
      </p>
      ${interactiveFooter}
    </div>
  `;
}

function renderPaginationControls(pagination) {
  const container = document.getElementById("pagination-controls");
  if (!pagination || pagination.totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `
    <button class="btn btn-sm btn-outline-secondary" ${!pagination.hasPrevPage ? 'disabled' : ''} onclick="executePageChange(${currentPage - 1})">
      <i class="bi bi-chevron-left"></i> Prev
    </button>
  `;

  for (let i = 1; i <= pagination.totalPages; i++) {
    html += `
      <button class="btn btn-sm ${i === pagination.currentPage ? 'btn-primary active' : 'btn-outline-primary'}" onclick="executePageChange(${i})">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="btn btn-sm btn-outline-secondary" ${!pagination.hasNextPage ? 'disabled' : ''} onclick="executePageChange(${currentPage + 1})">
      Next <i class="bi bi-chevron-right"></i>
    </button>
  `;

  container.innerHTML = html;
}

window.executePageChange = function(targetPage) {
  currentPage = targetPage;
  fetchTabulatedFeed(currentTab, currentPage);
  document.getElementById("publications").scrollIntoView({ behavior: 'smooth' });
};

async function hydrateNewsInsightFeed() {
  const targetNewsGrid = document.getElementById("dynamic-news-target");
  if (!targetNewsGrid) return;

  try {
    const response = await fetch(`${API_BASE_URL}/feed/articles?page=1&limit=3`);
    const payload = await response.json();

    if (!payload.success || !payload.documents || payload.documents.length === 0) {
      targetNewsGrid.innerHTML = `<p class="text-muted text-center w-100" style="grid-column: 1 / -1;">No contemporary insight updates broadcasted.</p>`;
      return;
    }

    targetNewsGrid.innerHTML = payload.documents.map(article => `
      <div class="news-card" data-aos="fade-up">
        <div class="news-photo">
          <img src="${article.coverImage || '../assets/img/hero/hero-1.jpg'}" alt="${article.title}">
        </div>
        <div class="news-body">
          <span class="news-cat">${article.status || 'Insight'}</span>
          <h3>${article.title}</h3>
          <p style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
            ${article.description || ''}
          </p>
          <a href="article.html?id=${article._id}" class="pub-link mt-3" style="font-size:12px;">Explore Entry Details &rarr;</a>
        </div>
      </div>
    `).join('');

    if (window.AOS) window.AOS.refresh();

  } catch (err) {
    console.error("News insight panel hydration error:", err);
  }
}

function displayEmptyState(target, type) {
  target.innerHTML = `
    <div class="text-center py-5 text-muted w-100" style="grid-column: 1 / -1;">
      <i class="bi bi-folder-symlink-fill" style="font-size: 2.5rem; color: var(--gold-color);"></i>
      <p class="mt-2 font-weight-bold">No catalog records stored under index: "${type.toUpperCase()}"</p>
    </div>
  `;
}