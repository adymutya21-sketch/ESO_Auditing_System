document.addEventListener("DOMContentLoaded", loadStudentFees);

function loadStudentFees() {
    fetch("/fees") // uses the API you already created
        .then(res => res.json())
        .then(fees => {
            const grid = document.getElementById("feeGrid");
            grid.innerHTML = "";

            fees.forEach(fee => {
                // Fee Name
                const feeName = document.createElement("div");
                feeName.textContent = fee.fee_name;

                // Amount
                const amount = document.createElement("div");
                amount.textContent = fee.amount;

                // Proof upload
                const upload = document.createElement("div");
                upload.innerHTML = `<input type="file" accept="image/*">
                                    <button onclick="uploadProof('${fee.id}')">Upload Proof</button>`;

                // Status (default for students)
                const status = document.createElement("div");
                status.textContent = "NOT PAID";

                grid.appendChild(feeName);
                grid.appendChild(amount);
                grid.appendChild(upload);
                grid.appendChild(status);
            });
        })
        .catch(err => {
            console.error("Failed to load fees:", err);
        });
}


function uploadProof(feeId) {
    fetch("/uploadImg")}