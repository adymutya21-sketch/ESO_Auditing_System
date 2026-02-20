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

function registerStudent() {
    const first_name = document.getElementById("firstNameInput").value; //Get fee name from registration.html
    const last_name = document.getElementById("lastNameInput").value; //Get fee amount from registration.html                                                                                   
    const student_id = document.getElementById("studentIdInput").value; //Get fee name from registration.html
    const course = document.getElementById("courseInput").value; //Get fee amount from registration.html
    const year_level = document.getElementById("yearLevelInput").value; //Get fee amount from registration.html
    const gmail = document.getElementById("emailInput").value; //Get fee amount from registration.html
    const password = document.getElementById("passwordInput").value; //Get fee amount from registration.html

    if (!first_name || !last_name || !student_id || !course || !year_level || !gmail || !password) {
        alert("Please fill all fields"); //Alert if the Input is empty
        return;
    }

    fetch("/students_list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, student_id, course, year_level, gmail, password })
    }).then(() => {
        document.getElementById("firstNameInput").value = "";
        document.getElementById("lastNameInput").value = "";
        document.getElementById("studentIdInput").value = "";
        document.getElementById("courseInput").value = "";
        document.getElementById("yearLevelInput").value = "";
        document.getElementById("emailInput").value = "";
        document.getElementById("passwordInput").value = "";
        loadStudentList();
    });
}