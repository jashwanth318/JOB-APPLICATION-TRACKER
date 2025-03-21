document.getElementById("applicationForm").addEventListener("submit", addApplication);

let applications = JSON.parse(localStorage.getItem("applications")) || [];

// Dark Mode
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

// Form Validation
const applicationForm = document.getElementById("applicationForm");
const addApplicationButton = document.getElementById("addApplicationButton");
addApplicationButton.disabled = true;

function checkFormCompletion() {
  const companyName = document.getElementById("companyName").value;
  const role = document.getElementById("role").value;
  const dateApplied = document.getElementById("dateApplied").value;
  addApplicationButton.disabled = !(companyName && role && dateApplied);
}

applicationForm.addEventListener("input", checkFormCompletion);

// Application CRUD
function displayApplications() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  applications.forEach((app, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${app.company}</td>
      <td>${app.role}</td>
      <td>${app.status}</td>
      <td>${app.dateApplied}</td>
      <td>
        <button class="edit" onclick="editApplication(${index})"><i class="fas fa-edit"></i> Edit</button>
        <button class="delete" onclick="deleteApplication(${index})"><i class="fas fa-trash"></i> Delete</button>
      </td>
      <td>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${getProgress(app.status)}%"></div>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function addApplication(event) {
  event.preventDefault();
  const companyName = document.getElementById("companyName").value;
  const role = document.getElementById("role").value;
  const status = document.getElementById("status").value;
  const dateApplied = document.getElementById("dateApplied").value;

  if (!companyName || !role || !dateApplied) return alert("Please fill in all fields.");

  applications.push({ company: companyName, role: role, status: status, dateApplied: dateApplied });
  localStorage.setItem("applications", JSON.stringify(applications));
  displayApplications();
  applicationForm.reset();
  addApplicationButton.disabled = true;
}

function deleteApplication(index) {
  applications.splice(index, 1);
  localStorage.setItem("applications", JSON.stringify(applications));
  displayApplications();
}

function editApplication(index) {
  const app = applications[index];
  document.getElementById("companyName").value = app.company;
  document.getElementById("role").value = app.role;
  document.getElementById("status").value = app.status;
  document.getElementById("dateApplied").value = app.dateApplied;

  applicationForm.removeEventListener("submit", addApplication);
  applicationForm.addEventListener("submit", function(event) {
    event.preventDefault();
    updateApplication(index);
  });
}

function updateApplication(index) {
  const companyName = document.getElementById("companyName").value;
  const role = document.getElementById("role").value;
  const status = document.getElementById("status").value;
  const dateApplied = document.getElementById("dateApplied").value;

  applications[index] = { company: companyName, role: role, status: status, dateApplied: dateApplied };
  localStorage.setItem("applications", JSON.stringify(applications));
  displayApplications();
  applicationForm.reset();
  applicationForm.removeEventListener("submit", updateApplication);
  applicationForm.addEventListener("submit", addApplication);
}

// Utilities
function getProgress(status) {
  switch (status) {
    case "Applied": return 25;
    case "Interviewing": return 50;
    case "Rejected": return 0;
    case "Offer": return 100;
    default: return 0;
  }
}

function filterApplications() {
  const filterValue = document.getElementById("filterStatus").value;
  const filteredApps = filterValue ? applications.filter(app => app.status === filterValue) : applications;
  displayFilteredApplications(filteredApps);
}

function searchApplications() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const searchedApps = applications.filter(app => 
    app.company.toLowerCase().includes(searchTerm) || app.role.toLowerCase().includes(searchTerm)
  );
  displayFilteredApplications(searchedApps);
}

function displayFilteredApplications(filteredApps) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  filteredApps.forEach((app, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${app.company}</td>
      <td>${app.role}</td>
      <td>${app.status}</td>
      <td>${app.dateApplied}</td>
      <td>
        <button class="edit" onclick="editApplication(${index})"><i class="fas fa-edit"></i> Edit</button>
        <button class="delete" onclick="deleteApplication(${index})"><i class="fas fa-trash"></i> Delete</button>
      </td>
      <td>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${getProgress(app.status)}%"></div>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Initial Load
displayApplications();