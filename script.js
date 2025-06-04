const jpdbBaseURL = "http://api.login2explore.com:5577";
const connToken = "90934596|-31949211617963017|90956734";
const dbName = "SCHOOL-DB";
const relationName = "STUDENT-TABLE";

function disableAllFields(disabled) {
  document.getElementById("fullName").disabled = disabled;
  document.getElementById("className").disabled = disabled;
  document.getElementById("birthDate").disabled = disabled;
  document.getElementById("address").disabled = disabled;
  document.getElementById("enrollDate").disabled = disabled;
  document.getElementById("saveBtn").disabled = disabled;
  document.getElementById("updateBtn").disabled = disabled;
}

function resetForm() {
  document.getElementById("studentForm").reset();
  document.getElementById("rollNo").disabled = false;
  disableAllFields(true);
  document.getElementById("rollNo").focus();
}

function getStudent() {
  const rollNo = document.getElementById("rollNo").value.trim();
  if (rollNo === "") {
    alert("Please enter Roll No");
    resetForm();
    return;
  }

  const req = createGET_BY_KEYRequest(
    connToken,
    dbName,
    relationName,
    JSON.stringify({ RollNo: rollNo })
  );
  jQuery.ajaxSetup({ async: false });
  const res = executeCommandAtGivenBaseUrl(req, jpdbBaseURL, "/api/irl");

  if (res.status === 400) {
    // New Roll No — allow data entry
    document.getElementById("rollNo").disabled = false;
    disableAllFields(false);
    document.getElementById("saveBtn").disabled = false;
    document.getElementById("updateBtn").disabled = true;
    document.getElementById("fullName").focus();
  } else if (res.status === 200) {
    // Existing Roll No — show data
    const data = JSON.parse(res.data).record;
    document.getElementById("rollNo").disabled = true;
    disableAllFields(false);
    document.getElementById("fullName").value = data.FullName;
    document.getElementById("className").value = data.Class;
    document.getElementById("birthDate").value = data.BirthDate;
    document.getElementById("address").value = data.Address;
    document.getElementById("enrollDate").value = data.EnrollmentDate;
    document.getElementById("saveBtn").disabled = true;
    document.getElementById("updateBtn").disabled = false;
    document.getElementById("fullName").focus();
  }
  jQuery.ajaxSetup({ async: true });
}

function validateData() {
  const rollNo = document.getElementById("rollNo").value.trim();
  const fullName = document.getElementById("fullName").value.trim();
  const className = document.getElementById("className").value.trim();
  const birthDate = document.getElementById("birthDate").value.trim();
  const address = document.getElementById("address").value.trim();
  const enrollDate = document.getElementById("enrollDate").value.trim();

  if (
    !rollNo ||
    !fullName ||
    !className ||
    !birthDate ||
    !address ||
    !enrollDate
  ) {
    alert("All fields are required!");
    return "";
  }

  return JSON.stringify({
    RollNo: rollNo,
    FullName: fullName,
    Class: className,
    BirthDate: birthDate,
    Address: address,
    EnrollmentDate: enrollDate,
  });
}

function saveStudent() {
  const data = validateData();
  if (!data) return;

  const req = createPUTRequest(connToken, data, dbName, relationName);
  jQuery.ajaxSetup({ async: false });
  const res = executeCommandAtGivenBaseUrl(req, jpdbBaseURL, "/api/iml");
  alert("Record saved!");
  jQuery.ajaxSetup({ async: true });
  resetForm();
}

function updateStudent() {
  const rollNo = document.getElementById("rollNo").value.trim();
  if (!rollNo) return;

  const getReq = createGET_BY_KEYRequest(
    connToken,
    dbName,
    relationName,
    JSON.stringify({ RollNo: rollNo })
  );
  jQuery.ajaxSetup({ async: false });
  const getRes = executeCommandAtGivenBaseUrl(getReq, jpdbBaseURL, "/api/irl");

  if (getRes.status === 200) {
    const recId = JSON.parse(getRes.data).rec_no;
    const data = validateData();
    const updateReq = createUPDATERecordRequest(
      connToken,
      data,
      dbName,
      relationName,
      recId
    );
    const updateRes = executeCommandAtGivenBaseUrl(
      updateReq,
      jpdbBaseURL,
      "/api/iml"
    );
    alert("Record updated!");
  }

  jQuery.ajaxSetup({ async: true });
  resetForm();
}
