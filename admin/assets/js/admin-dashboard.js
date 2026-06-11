document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = 'https://acdrm-backend.onrender.com/api/v1/content';

  // 1. Session Token Validation Guard
  const authToken = localStorage.getItem("acdrm_admin_token");
  if (!authToken) {
    window.location.href = "login.html";
    return;
  }

  // Element Cache Matrix
  const contentForm = document.getElementById("content-form");
  const tableBody = document.getElementById("inventory-table-body");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-payload-btn");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const hiddenIdInput = document.getElementById("content-id");

  // Local state cache to avoid repeated network round-trips when reading details for edits
  let contentCacheStore = [];

  // 2. Query and Build Inventory View Pipeline
  async function fetchInventoryIndex() {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) throw new Error("Could not download target structural cache registry.");
      
      const payload = await response.json();
      // Handle variable wrapper array definitions safely
      const items = payload.data || payload.documents || (Array.isArray(payload) ? payload : []);
      
      // Filter out logically soft-deleted nodes if backend didn't clean them out already
      contentCacheStore = items.filter(item => item.isDeleted !== true);

      if (contentCacheStore.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 30px; color: #a0aec0;">No active records mapped to the master layout cluster.</td></tr>`;
        return;
      }

      tableBody.innerHTML = contentCacheStore.map(item => `
        <tr id="row-${item._id}">
          <td style="font-weight: 600; max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</td>
          <td><span class="badge badge-type">${item.type}</span></td>
          <td><span class="badge badge-status ${item.status}">${item.status}</span></td>
          <td>
            <div class="actions-cluster">
              <button class="btn-action edit" data-id="${item._id}"><i class="bi bi-pencil-square"></i></button>
              <button class="btn-action delete" data-id="${item._id}"><i class="bi bi-trash-fill"></i></button>
            </div>
          </td>
        </tr>
      `).join("");

      bindActionTriggers();
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #c53030; padding: 20px;">Index Sync Interrupted: ${err.message}</td></tr>`;
    }
  }

  // 3. Form Intercept Pipeline (Handles both Create and Update via Multipart/Form-Data)
  contentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Construct HTML5 multipart object. Native browser attaches boundaries correctly
    const formData = new FormData(contentForm);
    const targetId = hiddenIdInput.value;
    
    // Conditional assignment for polymorphic endpoint routing mapping
    const executionUrl = targetId ? `${API_BASE_URL}/${targetId}` : API_BASE_URL;
    const executionMethod = targetId ? "PATCH" : "POST";

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Streaming Payload Structural Bits...";

      const response = await fetch(executionUrl, {
        method: executionMethod,
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ecosystem server processing failure structural issue.");
      }

      resetFormState();
      await fetchInventoryIndex();
      alert(`Success: Content entry node updated cleanly inside database architecture.`);

    } catch (error) {
      alert(`Pipeline Transmission Failure: ${error.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = targetId ? "Save Document State Changes" : "Publish Content";
    }
  });

  // 4. Action Button Binding Context Managers
  function bindActionTriggers() {
    document.querySelectorAll(".btn-action.edit").forEach(btn => {
      btn.addEventListener("click", () => populateFormForEdit(btn.getAttribute("data-id")));
    });

    document.querySelectorAll(".btn-action.delete").forEach(btn => {
      btn.addEventListener("click", () => removeIndexedNode(btn.getAttribute("data-id")));
    });
  }

  function populateFormForEdit(id) {
    const activeItem = contentCacheStore.find(item => item._id === id);
    if (!activeItem) return;

    formTitle.textContent = "Modify Asset Instance Configuration";
    submitBtn.textContent = "Save Document State Changes";
    cancelBtn.style.display = "block";
    hiddenIdInput.value = activeItem._id;

    // Map fields straight down out of layout definitions
    document.getElementById("title").value = activeItem.title || "";
    document.getElementById("description").value = activeItem.description || "";
    document.getElementById("body").value = activeItem.body || activeItem.content || activeItem.contentBody || "";
    document.getElementById("type").value = activeItem.type || "BLOG";
    document.getElementById("status").value = activeItem.status || "DRAFT";
    
    formTitle.scrollIntoView({ behavior: "smooth" });
  }

  async function removeIndexedNode(id) {
    if (!confirm("Confirm execution sequence to scrub this file block layout index entry from active servers?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${authToken}` }
      });

      if (!response.ok) throw new Error("Database rejected content purge command authorization criteria context.");
      
      await fetchInventoryIndex();
    } catch (err) {
      alert(`Purge Sequence Terminated: ${err.message}`);
    }
  }

  function resetFormState() {
    contentForm.reset();
    hiddenIdInput.value = "";
    formTitle.textContent = "Create Content Node";
    submitBtn.textContent = "Publish Content";
    cancelBtn.style.display = "none";
  }

  // Session Terminate Logic
  cancelBtn.addEventListener("click", resetFormState);
  document.getElementById("logout-trigger").addEventListener("click", () => {
    localStorage.removeItem("acdrm_admin_token");
    window.location.href = "login.html";
  });

  // Entry Execution Initialization Sequence
  fetchInventoryIndex();
});