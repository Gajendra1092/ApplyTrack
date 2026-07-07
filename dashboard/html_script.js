async function renderTable(applications){

    const tbody = document.getElementById("table-body");

    tbody.innerHTML = "";

    applications.forEach(app=>{
        const date = new Date(app.Created_at);

        const formatted = date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
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

}

(async () => {
    const response = await fetch('http://127.0.0.1:8000/get_data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    await renderTable(data);
    console.log(data);
})();
