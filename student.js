//open OBS and start virtual camera
//make sure that the chrome window that opens has the settings to OBS virtual webcam in privacy/security settings

//localStorage.clear() ///uncomment when you want to clear all stored data

///////////////////////////////////////////////////////////////////
//////////Create variables from  html


const checkStudentButton = document.getElementById('checkStudentButton');
const studentFirstNameInput = document.getElementById('studentFirstName');
const studentLastNameInput = document.getElementById('studentLastName');
const timeslotResult = document.getElementById('timeslotResult');
const tableBody = document.querySelector('#dataTable tbody');


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


///////////////////////////////////////////////////////////////////
/////////Student name entry and timeslot selection page functions


//Student lookup button functionality
checkStudentButton.addEventListener('click', () => {
    const firstName = studentFirstNameInput.value.trim();
    const lastName = studentLastNameInput.value.trim();
    if (firstName && lastName) {
        checkStudentData(firstName, lastName);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
    } else {
        alert('Please enter both first and last names.');
    }
});

// Check if student exists in table data
const checkStudentData = (firstName, lastName) => {
    const savedData = JSON.parse(localStorage.getItem('tableData')) || []; //retrieve table of timeslots saved in local Storage
    const foundRows = savedData.filter(row => row[0].toLowerCase() === firstName.toLowerCase() && row[1].toLowerCase() === lastName.toLowerCase());
    if (foundRows.length > 0) {
        timeslotResult.innerHTML = `<h2>Select Your Timeslot</h2>
      ${foundRows.map(row => `<button onclick="selectTimeslot('${row[2]}, ${row[3]} - ${row[4]}, ${row[5]}')"class="mb-3">${row[2]}, ${row[3]} - ${row[4]}, ${row[5]}</button>`).join('<br>')} 
    `; // call selectTimeslot function if a timeslotbutton is clicked
    } else {
        timeslotResult.innerHTML = '<h3>No timeslots exist for user.</h3>';
    }
};

//Start recording page once timeslot is selected
function selectTimeslot(timeslot) {
    localStorage.setItem('selectedTimeslot', timeslot); //remember what timeslot the student selected in local Storage

    const timeslotModal = document.getElementById("timeslotConfirmationModal"); //retrieve from html
    const confirmTimeslot = document.getElementById("confirmTimeslot");
    const backTimeslot = document.getElementById("backTimeslot");
    const timeslotText = document.getElementById("timeslotConfirmationText");
  
    timeslotText.textContent = `Are you sure you want to record for ${timeslot}?`; //dynamically change the prompt in the modal window based on the timeslot selected
    timeslotModal.style.display = "block"; //prompt user to confirm timeslot selection
    
    confirmTimeslot.addEventListener("click", () => {
        timeslotModal.style.display = "none";
        // Redirect to the recording page
        //window.location.href = "recording_page.html";
        showRecordingPage();
        
    });

    backTimeslot.addEventListener("click", () => {
        timeslotModal.style.display = "none";
    });
}