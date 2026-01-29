let allData = []; // store all CSV data globally

// Load data and set up search/filter when page loads
window.addEventListener("DOMContentLoaded", () => {
    loadData();

    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const coursesFilter = document.getElementById("coursesFilter");

    // Live search for Name or ID
    searchInput.addEventListener("input", filterData);

    // Filter by dropdown
    statusFilter.addEventListener("change", filterData);

    // Filter by dropdown
    coursesFilter.addEventListener("change", filterData);
});

function loadData() {
    fetch("/data")
        .then(response => response.json())
        .then(data => {
            allData = data; // save original data for filtering
            displayGrid(allData);
        });
}

// Combined filter function
function filterData() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const statusValue = document.getElementById("statusFilter").value;
    const coursesValue = document.getElementById("coursesFilter").value;

    const filteredData = allData.filter(row => {
        // Search by Name or ID only
        const matchesNameID = (row["First_Name"] && row["First_Name"].toLowerCase().includes(query)) ||
                              (row["Last_Name"] && row["Last_Name"].toLowerCase().includes(query)) ||
                              (row["ID"] && row["ID"].toLowerCase().includes(query));

        // Filter by status from dropdown if selected
        const matchesStatus = statusValue === "" || 
                              (row["Payment_Status"] && row["Payment_Status"].toUpperCase() === statusValue) ||
                              (row["Eval_Status"] && row["Eval_Status"].toUpperCase() === statusValue);

        // Filter by Course
        const matchesCourse =
            coursesValue === "" ||
            (row["Course"] && row["Course"].toUpperCase() === coursesValue);

        return matchesNameID && matchesStatus && matchesCourse;
    });

    displayGrid(filteredData);
}

function displayGrid(data) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);

    // Add headers
    headers.forEach(h => {
        const headerDiv = document.createElement("div");
        headerDiv.className = "grid-header";
        headerDiv.textContent = h;
        grid.appendChild(headerDiv);
    });

    // Add rows
    data.forEach(row => {
        headers.forEach(h => {
            const cell = document.createElement("div");
            cell.className = "grid-item";

            // Color based on Payment_Status
            if (h.toLowerCase() === "payment_status") {
                if (row[h].toUpperCase() === "PAID") cell.classList.add("paid");
                else if (row[h].toUpperCase() === "UNPAID") cell.classList.add("unpaid");
            }

            // Color based on Eval_Status
            if (h.toLowerCase() === "eval_status") {
                if (row[h].toUpperCase() === "DONE") cell.classList.add("eval_true");
                else if (row[h].toUpperCase() === "PENDING") cell.classList.add("eval_false");
            }

            cell.textContent = row[h];
            grid.appendChild(cell);
        });
    });
}
