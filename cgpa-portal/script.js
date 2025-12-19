let totalCredit = 0;
let totalQP = 0;

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
  totalCredit = 0;
  totalQP = 0;

  document.querySelectorAll("#sheet tbody tr").forEach(tr => {
    const tds = tr.querySelectorAll("td");

    const credit = parseFloat(tds[3].textContent) || 0;
    const gp = parseFloat(tds[5].textContent) || 0;
    const retake = tds[7].textContent.toLowerCase() === "yes";

    const qp = credit * gp;
    tds[6].textContent = qp.toFixed(2);

    updateGradeColor(tds[4]);

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
  window.print();
}
