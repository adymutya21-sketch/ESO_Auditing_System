document.addEventListener("DOMContentLoaded", loadFees);

function loadFees() {
    fetch("/fees")
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("feeTable");
            table.innerHTML = "";

            data.forEach(fee => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${fee.fee_name}</td>
                    <td>₱${fee.amount}</td>
                    <td>
                        <button onclick="deleteFee(${fee.id})">Delete</button>
                    </td>
                `;

                table.appendChild(row);
            });
        });
}

function addFee() {
    const fee_name = document.getElementById("feeName").value; //Get fee name from financial_list.html
    const amount = document.getElementById("feeAmount").value; //Get fee amount from financial_list.html

    if (!fee_name || !amount) {
        alert("Please fill all fields"); //Alert if the Input is empty
        return;
    }

    fetch("/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee_name, amount })
    }).then(() => {
        document.getElementById("feeName").value = "";
        document.getElementById("feeAmount").value = "";
        loadFees();
    });
}

function deleteFee(id) {
    if (!confirm("Delete this fee?")) return;

    fetch(`/fees/${id}`, {
        method: "DELETE"
    }).then(() => loadFees());
}
