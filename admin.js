//open OBS and start virtual camera
//make sure that the chrome window that opens has the settings to OBS virtual webcam in privacy/security settings

//localStorage.clear() ///uncomment when you want to clear all stored data

///////////////////////////////////////////////////////////////////
//////////Create variables from  html

const saveButton = document.getElementById('saveButton');
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
/////////Admin table page functions

// load data table when page opens
window.addEventListener('load', function() {
    loadTableData();
  });
  
// Load saved data from local storage
const loadTableData = () => {
    const savedData = JSON.parse(localStorage.getItem('tableData')) || []; //retrieve table of timeslots saved in local Storage
    tableBody.innerHTML = ''; // Clear current table data
    savedData.forEach(rowData => addRow(rowData)); // Add each saved row to the table
    if (savedData.length === 0) addRow(); // If no existing data that was stored, add an empty row
    let addextrarow = false;
    if (savedData.length !== 0) { //if the last row has data inside, the page will load with a blank row at the bottom every time
        let i = 0;
        while (i<savedData[0].length){
            if (savedData[savedData.length - 1][i] != ""){
                addextrarow = true
            }
            i++;
        }
    }
    if (addextrarow) addRow();
};

// Admin save button functionality
saveButton.addEventListener('click', () => {
    const tableData = [];
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const rowData = Array.from(row.querySelectorAll('input')).map(input => input.value.trim());
        tableData.push(rowData);  //read rows into tableData
    });
    
    if (tableData.length > 0){
        let i = 0;
        while (i<tableData.length){
            let j = 0;
            let fullycompleted = true
            let nonempty = false
            while(j < tableData[0].length){
                if (tableData[i][j] === ''){
                    fullycompleted = false
                }
                if (tableData[i][j] != ''){
                    nonempty = true
                }
                if (nonempty && !fullycompleted) { ///if partially completed row, prompt to complete those rows and break out of function
                    alert('Please complete all info for timeslot');
                    return;
                }
                j++;
            }
            i++
        }
    }
    else {
        let i = 0;
        let fullycompleted = true
        let nonempty = false
        while (i<tableData.length){ 
            if (tableData[i] === ''){
                fullycompleted = false
            }
            if (tableData[i] != ''){
                nonempty = true
            }
            if (nonempty && !fullycompleted) { ///if partially completed row, prompt to complete those rows and break out of function
                alert('Please complete all info for timeslot');
                return;
            }
            i++;
        }
    }
    
    alert('Information saved!');

    saveTableData(); //Save table data to localStorage

    let k = 0;
        while (k<tableData[0].length){
            if (tableData[tableData.length - 1][k] != ''){ // Add new row if the last row is filled
                addRow()
                return
            }
            k++;
        }
    });

// Save table data to localStorage
const saveTableData = () => {
    const tableData = [];
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const rowData = Array.from(row.querySelectorAll('input')).map(input => input.value.trim());
        if (rowData.some(value => value !== '')) {
            tableData.push(rowData);
        }
    });
    localStorage.setItem('tableData', JSON.stringify(tableData)); //save tableData into local storage for next time page loads
};

// Add row to the table with either provided data or empty data
const addRow = (rowData = ["", "", "", "", "", ""]) => {
    const row = document.createElement('tr'); // Create a new row
    rowData.forEach(cellData => {
        const cell = document.createElement('td'); // Create a new cell
        const input = document.createElement('input'); // Create an input field
        input.type = 'text';
        input.value = cellData;
        cell.appendChild(input);
        row.appendChild(cell);
    });
    tableBody.appendChild(row); // Add the row to the table
};

// Check if all rows are filled
const allRowsFilled = () => {
    const rows = tableBody.querySelectorAll('tr');
    return Array.from(rows).every(row => 
        Array.from(row.querySelectorAll('input')).every(input => input.value.trim() !== '')
    );
};