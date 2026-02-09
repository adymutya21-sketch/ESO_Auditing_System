// Load data when page loads
window.addEventListener("DOMContentLoaded", loadData);

function loadData() {
    fetch("/data")
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById("grid");
            grid.innerHTML = "";

            if (data.length === 0) return;

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

                    // Add color based on status
                    if (h.toLowerCase() === "status") {
                        if (row[h].toUpperCase() === "PAID") cell.classList.add("paid");
                        else if (row[h].toUpperCase() === "UNPAID") cell.classList.add("unpaid");
                    }

                    cell.textContent = row[h];
                    grid.appendChild(cell);
                });
            });
        });
}
