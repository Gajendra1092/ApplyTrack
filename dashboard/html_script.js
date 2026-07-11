// State
const state = {
  currentPage: 1,
  totalPages: 0,
  limit: 5,
  totalRecords: 0,
  searchTimeout: null,
  searchQuery: "",
  resume_version: "",
}

// Side effect 
function setupStaticEventListeners() {
  document.getElementById("addButton").addEventListener("click", () => {
    document.getElementById("modal").classList.remove("hidden");
  });

  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });

  const form = document.getElementById("addDetailsForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      Company_name: document.getElementById("company_name").value,
      Role: document.getElementById("role").value,
      Resume_name: document.getElementById("resume_name").value,
    };

    saveToDB(payload);
  });

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    clearTimeout(state.searchTimeout);

    state.searchTimeout = setTimeout(() => {
      state.searchQuery = e.target.value.trim();

      loadData(1);
    }, 300);
  });
}

function addingEventListeners() {
  document.getElementById("next-page").addEventListener("click", () => {
    if (state.currentPage < state.totalPages) {
      loadData(state.currentPage + 1);
    }
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (state.currentPage > 1) {
      loadData(state.currentPage - 1);
    }
  });

  document.querySelectorAll(".page-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const page = Number(button.dataset.page);
      loadData(page);
    });
  });

  document.querySelectorAll(".resumeFilter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const filter_resume_name = button.dataset.rName;
      state.resume_version = filter_resume_name;
      loadData(1);
    });
  });
}

// Rendering Functions
// Just add buttons in resume Drop-Down
function listResume(list) {
  const resumeDropDown = document.getElementById("resumeDropDownList");
  resumeDropDown.innerHTML = "";
  resumeDropDown.innerHTML = `
    <li>
      <button
        class="resumeFilter-btn w-full whitespace-nowrap text-left block py-2 px-4 hover:bg-gray-100"
        data-r-name=""
      >
        All Resumes
      </button>
    </li>
  `;
  list.forEach((ind_resume) => {
    resumeDropDown.innerHTML += `<li>
                      <button
                        class="resumeFilter-btn  whitespace-nowrap w-full text-left block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" data-r-name="${ind_resume}"
                        >${ind_resume}</button
                      >
                    </li>`;
  });
}

function renderTableFooter() {
  const right_footer = document.getElementById("right-footer");
  const left_footer = document.getElementById("left-footer");
  right_footer.innerHTML = "";
  left_footer.innerHTML = "";

  const prevDisabled = state.currentPage === 1;
  const nextDisabled = state.currentPage === state.totalPages;

  const pages = [];

  // Case 1: Show all pages if total pages are 5 or less
  if (state.totalPages <= 5) {
    for (let i = 1; i <= state.totalPages; i++) {
      pages.push(i);
    }
  }

  // Case 2: Current page is near the beginning
  else if (state.currentPage <= 4) {
    pages.push(1, 2, 3, 4);
    pages.push("...");
    pages.push(state.totalPages);
  }

  // Case 3: Current page is near the end
  else if (state.currentPage >= state.totalPages - 3) {
    pages.push(1);
    pages.push("...");

    for (let i = state.totalPages - 3; i <= state.totalPages; i++) {
      pages.push(i);
    }
  }

  // Case 4: Current page is somewhere in the middle
  else {
    pages.push(1);
    pages.push("...");

    pages.push(state.currentPage - 1);
    pages.push(state.currentPage);
    pages.push(state.currentPage + 1);

    pages.push("...");
    pages.push(state.totalPages);
  }

  right_footer.innerHTML += `<li>
                    <button id="prev-page" ${prevDisabled ? "disabled" : ""} class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${prevDisabled ? "opacity-50 cursor-not-allowed" : ""}">
                        <span class="sr-only">Previous</span>
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
            </li>`;
  pages.forEach((page) => {
    if (page === "...") {
      right_footer.innerHTML += `<li>
                        <span class="flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</span>
            </li>`;
    } else {
      // Highlight the selected button
      const activeClass =
        page === state.currentPage
          ? "text-black-500 font-bold bg-gray-100"
          : "text-gray-500 bg-white";

      right_footer.innerHTML += `<li>
                        <button class="page-btn ${activeClass} flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" data-page="${page}">${page}</button>
            </li>`;
    }
  });

  right_footer.innerHTML += `<li>
                    <button id="next-page" ${nextDisabled ? "disabled" : ""} class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${nextDisabled ? "opacity-50 cursor-not-allowed" : ""}">
                        <span class="sr-only" >Next</span>
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
            </li>
            
            `;

  const startRecord =
    state.totalRecords === 0 ? 0 : (state.currentPage - 1) * state.limit + 1;

  const endRecord = Math.min(
    state.totalRecords,
    state.currentPage * state.limit,
  );

  left_footer.innerHTML += `
        Showing
        <span class="font-semibold text-gray-900 dark:text-white">${startRecord}-${endRecord}</span>
        of
        <span class="font-semibold text-gray-900 dark:text-white">${state.totalRecords}</span>`;
}

function renderTable(data) {
  const applications = data.applications;
  const tbody = document.getElementById("table-body");

  tbody.innerHTML = "";

  let rows = "";

  applications.forEach((app) => {
    const date = new Date(app.Created_at);

    const formatted = date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    rows += `

        <tr class="border-b dark:border-gray-700">

            <td class="px-4 py-3">${app.Company_name}</td>

            <td class="px-4 py-3">${app.Role}</td>

            <td class="px-4 py-3">${formatted}</td>

            <td class="px-4 py-3">${app.Resume_name}</td>

            <td class="px-4 py-3">

                <button>Edit</button>

            </td>

        </tr>

        `;
  });

  tbody.innerHTML = rows;

  renderTableFooter();
  addingEventListeners();
}

//APIs
// Store Data in DB
async function saveToDB(payload) {
  try {
    const response = await fetch("http://127.0.0.1:8000/store-to-db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save application");
    }

    document.getElementById("addDetailsForm").reset();
    document.getElementById("modal").classList.add("hidden");

    loadData(1);
  } catch (error) {
    console.error("Failed to save form:", error);
  }
}

// Loading data
async function loadData(page = 1) {
  state.currentPage = page;
  const response = await fetch(
    `http://127.0.0.1:8000/get_data?page=${page}&limit=${state.limit}&search=${encodeURIComponent(state.searchQuery)}&filter_resume=${encodeURIComponent(state.resume_version)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = await response.json();
  const resume_list = data.resume_list;

  state.totalPages = Math.ceil(data.total / data.limit);
  state.totalRecords = data.total;

  listResume(resume_list);
  renderTable(data);
}

loadData(1);
setupStaticEventListeners();
