/*********************************
 * LIVE CAMERA SETUP
 *********************************/
const video = document.getElementById('camera');

if (video) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(() => {
      alert('Camera access denied');
    });
}

/*********************************
 * TEXT TRANSLATION (DUMMY)
 *********************************/
function translateText() {
  const enText = document.getElementById("enText");
  const bnText = document.getElementById("bnText");

  if (!enText || !bnText) {
    alert("Text box not found!");
    return;
  }

  const en = enText.value.trim();
  const bn = bnText.value.trim();

  let result = {};

  // English ➜ Bangla
  if (en && !bn) {
    result = {
      english: en,
      bangla: "বাংলা অনুবাদ (ডেমো)"
    };
    bnText.value = result.bangla;
  }

  // Bangla ➜ English
  else if (bn && !en) {
    result = {
      english: "English Translation (Demo)",
      bangla: bn
    };
    enText.value = result.english;
  }

  // Both filled or both empty
  else {
    alert("একবারে শুধু একটাতে লিখুন (English বা বাংলা)");
    return;
  }

  saveText(result);
}

/*********************************
 * SAVE TEXT DATA (LOCAL STORAGE)
 *********************************/
function saveText(data) {
  if (!data.english && !data.bangla) return;

  let logs = JSON.parse(localStorage.getItem("textLogs")) || [];

  logs.push({
    english: data.english || "",
    bangla: data.bangla || "",
    time: new Date().toLocaleString()
  });

  localStorage.setItem("textLogs", JSON.stringify(logs));

  console.log("Saved Logs:", logs);
  alert("Text saved successfully!");
}

/*********************************
 * OPTIONAL: VIEW SAVED DATA
 *********************************/
function showSavedData() {
  const logs = JSON.parse(localStorage.getItem("textLogs")) || [];
  console.table(logs);
}
