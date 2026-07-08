let currentPage = 1;
let totalPages = 0;
async function renderTable(data) {
    const applications = data.applications;
    const tbody = document.getElementById("table-body");

    tbody.innerHTML = "";

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

        tbody.innerHTML += `

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
    const footer = document.getElementById("footer");
    footer.innerHTML = "";

    footer.innerHTML += `<li>
                    <button id="prev-page" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span class="sr-only">Previous</span>
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
            </li>`;

    const blocks = Math.ceil(data.total / data.limit);
    totalPages = blocks;
    for (var i = 1; i <= blocks; i++) {
        footer.innerHTML += `<li>
                        <button class="page-btn flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" data-page="${i}">${i}</button>
            </li>`;
    }

    footer.innerHTML += `<li>
                    <button id="next-page" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span class="sr-only" >Next</span>
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
            </li>
            
            `;

    document.getElementById("next-page").addEventListener("click", () => {
        if (currentPage < totalPages) currentPage++;
        loadData(currentPage);
    });

    document.getElementById("prev-page").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadData(currentPage);
        }
    });

    document.querySelectorAll(".page-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const page = Number(button.dataset.page);
            currentPage = page;
            loadData(page);
        });
    });
}

async function loadData(page = 1) {
    const response = await fetch(
        `http://127.0.0.1:8000/get_data?page=${page}&limit=10`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        },
    );
    const data = await response.json();
    totalPages = data.total;
    await renderTable(data);
}

loadData(1);
