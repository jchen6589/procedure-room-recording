///////////////////////////////////////////////////////////////////
////////////////Show different pages
// Show start page
const showStartPage = () => {
    window.location.href = 'index.html';
};

// Show admin page
const showAdminPage = () => {
  window.location.href = 'admin.html';
    loadTableData(); // Load table data from localStorage
};

// Show student page
const showStudentPage = () => {
  window.location.href = 'student.html';
};

// Show recording page
const showRecordingPage = () => {
  window.location.href = 'recording.html';
};