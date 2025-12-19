let totalCredit = 0;
let totalQP = 0;

const gradeMap = {
  "A+": 4.0,
  "A": 3.75,
  "A-": 3.5,
  "B+": 3.25,
  "B": 3.0,
  "B-": 2.75,
  "C+": 2.5,
  "C": 2.25,
  "D": 2.0,
  "F": 0.0
};


function importExcel() {
  const fileInput = document.getElementById("excelFile");
  if (!fileInput.files.length) {
    alert("Please select an Excel file");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const tbody = document.querySelector("#sheet tbody");
    tbody.innerHTML = "";

    rows.slice(1).forEach(row => {
      if (row.length < 6) return;

      const tr = document.createElement("tr");

      for (let i = 0; i < 7; i++) {
        const td = document.createElement("td");
        td.textContent = row[i] ?? "";
        td.contentEditable = true;

        if (i === 4) updateGradeColor(td);

        tr.appendChild(td);
      }

      const retakeTd = document.createElement("td");
      retakeTd.textContent = "No";
      retakeTd.contentEditable = true;
      tr.appendChild(retakeTd);

      tbody.appendChild(tr);
    });

    calculateCGPA();
  };

  reader.readAsArrayBuffer(fileInput.files[0]);
}

function updateGradeColor(td) {
  td.classList.remove("grade-A+", "grade-F");
  if (td.textContent.trim() === "A+") td.classList.add("grade-A+");
  if (td.textContent.trim() === "F") td.classList.add("grade-F");
}

function calculateCGPA() {
  let totalCredit = 0;
  let totalQP = 0;

  document.querySelectorAll("#sheet tbody tr").forEach(tr => {
    const tds = tr.querySelectorAll("td");

    const credit = parseFloat(tds[3].textContent) || 0;

    // Grade → GP auto
    const grade = tds[4].textContent.trim().toUpperCase();
    let gp = gradeMap[grade];

    if (gp === undefined) {
      gp = parseFloat(tds[5].textContent) || 0;
    }

    tds[5].textContent = gp.toFixed(2);

    // QP calculate
    const qp = credit * gp;
    tds[6].textContent = qp.toFixed(2);

    // Grade color
    updateGradeColor(tds[4]);

    // Retake check
    const retake = tds[7].textContent.trim().toLowerCase() === "yes";

    if (!retake && credit > 0) {
      totalCredit += credit;
      totalQP += qp;
    }
  });

  const cgpa = totalCredit === 0 ? 0 : (totalQP / totalCredit).toFixed(2);
  document.getElementById("cgpa").textContent = cgpa;
}


document.addEventListener("input", e => {
  if (e.target.closest("#sheet")) {
    calculateCGPA();
  }
});

function exportExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(document.getElementById("sheet"));
  XLSX.utils.book_append_sheet(wb, ws, "Transcript");
  XLSX.writeFile(wb, "CGPA_Transcript.xlsx");
}

function exportPDF() {
  const uni = document.getElementById("uniName").value.trim();
  const dept = document.getElementById("deptName").value.trim();
  const name = document.getElementById("stuName").value.trim();
  const id = document.getElementById("stuId").value.trim();
  const program = document.getElementById("stuProgram").value.trim();

  const hasHeaderData = uni || dept || name || id || program;

  document.getElementById("pdfUniversity").textContent = hasHeaderData ? uni : "";
  document.getElementById("pdfDept").textContent = hasHeaderData ? dept : "";
  document.getElementById("pdfTitle").textContent = hasHeaderData ? "Academic Transcript" : "";

  document.getElementById("pdfName").textContent = name ? `Name: ${name}` : "";
  document.getElementById("pdfId").textContent = id ? `ID: ${id}` : "";
  document.getElementById("pdfProgram").textContent = program ? `Program: ${program}` : "";

  window.print();
}



const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️ Light Mode";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});
function addRow() {
  const tbody = document.querySelector("#sheet tbody");
  const tr = document.createElement("tr");

  // Semester, Code, Subject, Credit, Grade
  for (let i = 0; i < 5; i++) {
    const td = document.createElement("td");
    td.contentEditable = true;
    td.textContent = "";
    tr.appendChild(td);
  }

  // GP (auto or manual)
  const gpTd = document.createElement("td");
  gpTd.contentEditable = true;
  tr.appendChild(gpTd);

  // QP (auto calculated)
  const qpTd = document.createElement("td");
  qpTd.textContent = "0.00";
  tr.appendChild(qpTd);

  // Retake
  const retakeTd = document.createElement("td");
  retakeTd.contentEditable = true;
  retakeTd.textContent = "No";
  tr.appendChild(retakeTd);

  tbody.appendChild(tr);
}
