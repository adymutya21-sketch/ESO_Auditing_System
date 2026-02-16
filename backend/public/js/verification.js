document.addEventListener("DOMContentLoaded", verifyStudents);

function verifyStudents() {
    fetch("/verify") //to be named
    .then(res => res.json())
    .then(data => {
        const grid = document.getElementById("verifyGrid");
        grid.innerHTML = "";

        data.forEach(student => {
            const studentDiv = document.createElement("div");
            studentDiv.className = "student-item";
            studentDiv.innerHTML = `
                <div class="student-name">${student.First_Name} ${student.Last_Name}</div>
                <div class="student-id">${student.ID}</div>
                <div class="student-course">${student.Course}</div>
                <button onclick="verifyStudent('${student.ID}')">Verify</button>
            `;
            grid.appendChild(studentDiv);
        });
    });
}


async function verifyStudent(id) {
    console.log("Hello, World!");// for debugging
    const response = await fetch(`/verify/${id}`, { method: 'POST' });
    const result = await response.json();
    
    alert(result.message); // 🔥 ALWAYS show message
    
    if (result.success) {
        alert(result.message);
        verifyStudents(); // Refresh the list to show the update!
    } else {
        alert("Failed to verify student: " + result.message);
    }
}