document.addEventListener("DOMContentLoaded", loadStudentList);

function loadStudentList() {
    fetch("/students_list")
        .then(res => {
            // Check if the server actually returned a 200 OK
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(students_list => {
            const grid = document.getElementById("studentGrid");
            grid.innerHTML = "";

            // 1. Create a fragment to hold the new nodes
            const fragment = document.createDocumentFragment();

            students_list.forEach(student => {
                // 2. Create a wrapper for each student for better CSS control
                const card = document.createElement("div");
                card.className = "student-card"; 

                card.innerHTML = `
                    <div class="name">${student.first_name} ${student.last_name}</div>
                    <div class="id">${student.id}</div>
                    <div class="course">${student.course}</div>
                    <div class="year">${student.year_level}</div>
                    <div class="gmail">${student.gmail}</div>
                `;

                fragment.appendChild(card);
            });

            // 3. One single DOM update at the end
            grid.appendChild(fragment);
        })
        .catch(err => {
            console.error("Failed to load students:", err);
            document.getElementById("studentGrid").innerText = "Failed to load data.";
        });
}