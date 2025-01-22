//open OBS and start virtual camera
//make sure that the chrome window that opens has the settings to OBS virtual webcam in privacy/security settings

//localStorage.clear() ///uncomment when you want to clear all stored data

///////////////////////////////////////////////////////////////////
//////////Create variables from  html
const startPage = document.getElementById('startPage');
const adminPage = document.getElementById('adminPage');
const studentPage = document.getElementById('studentPage');
const recordingPage = document.getElementById('recordingPage');
const saveButton = document.getElementById('saveButton');
const checkStudentButton = document.getElementById('checkStudentButton');
const studentFirstNameInput = document.getElementById('studentFirstName');
const studentLastNameInput = document.getElementById('studentLastName');
const timeslotResult = document.getElementById('timeslotResult');
const tableBody = document.querySelector('#dataTable tbody');


///////////////////////////////////////////////////////////////////
////////////////Show different pages
// Show start page
const showStartPage = () => {
    startPage.style.display = 'block'; // Show the start page
    adminPage.style.display = 'none'; // Hide Admin page
    studentPage.style.display = 'none'; // Hide Student page
    recordingPage.style.display = 'none';
};

// Show admin page
const showAdminPage = () => {
    startPage.style.display = 'none'; // Hide start page
    adminPage.style.display = 'block'; // Show Admin page
    studentPage.style.display = 'none'; // Hide Student page
    recordingPage.style.display = 'none';
    loadTableData(); // Load table data from localStorage
};

// Show student page
const showStudentPage = () => {
    startPage.style.display = 'none'; // Hide start page
    adminPage.style.display = 'none'; // Hide Admin page
    studentPage.style.display = 'block'; // Show Student page
    recordingPage.style.display = 'none';
};

// Show student page
const showRecordingPage = () => {
  startPage.style.display = 'none'; // Hide start page
  adminPage.style.display = 'none'; // Hide Admin page
  studentPage.style.display = 'none'; 
  recordingPage.style.display = 'block';// Show Recording page
};

///////////////////////////////////////////////////////////////////
//////////////Start page functions
//Open admin or student page from start page using buttons
document.getElementById('adminButton').addEventListener('click', showAdminPage);
document.getElementById('studentButton').addEventListener('click', showStudentPage);


///////////////////////////////////////////////////////////////////
/////////Admin table page functions
// Back to Start from Admin
document.getElementById('backToStartFromAdmin').addEventListener('click', () => {
    document.getElementById('adminPage').style.display = 'none';
    document.getElementById('startPage').style.display = 'block';
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


///////////////////////////////////////////////////////////////////
/////////Student name entry and timeslot selection page functions
// Back to Start from Student
document.getElementById('backToStartFromStudent').addEventListener('click', () => {
    document.getElementById('studentPage').style.display = 'none';
    document.getElementById('startPage').style.display = 'block';
});

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
        startCamera();
    });

    backTimeslot.addEventListener("click", () => {
        timeslotModal.style.display = "none";
    });
}


///////////////////////////////////////////////////////////////////
/////////Student recording page functions
let mediaRecorder; //create global mediaRecorder to be referenced in all recording page functions
let recordedChunks = []; //create global recorded chunks to be referenced in all recording page functions

//record button functionality
document.getElementById('recordButton').addEventListener('click', toggleRecording);

//replay button functionality
document.getElementById('replayButton').addEventListener('click', replayRecording);

//delete button functionality
document.getElementById('deleteButton').addEventListener('click', deleteRecording);

//upload video button functionality
document.getElementById('uploadVideoButton').addEventListener('click', () => {
    const uploadModal = document.getElementById("uploadConfirmationModal"); //retrieve from html
    const confirmUpload = document.getElementById("confirmUpload");
    const backUpload = document.getElementById("backUpload");

    uploadModal.style.display = "block"; //prompt user to confirm video upload
  
    confirmUpload.addEventListener("click", () => {
      uploadModal.style.display = "none";
      // Trigger video upload functionality
      uploadVideo();
    });

    backUpload.addEventListener("click", () => {
      uploadModal.style.display = "none";
    });
});

//start camera
function startCamera() {
    localStorage.removeItem('videoBlob'); // Clear any existing video in localStorage
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    video.srcObject = stream;
    video.muted = true;  // This will mute the audio from the video element
    const options = { mimeType: 'video/webm;codecs=vp8,opus' }; // try different mime types
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
  })
  .catch(err => {
    console.error('Error accessing camera:', err);
  });

  }

// start recording
function startRecording() {
    recordedChunks = [];
    mediaRecorder.start();
    console.log('Recording started');
  }

//stop recording
function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
    console.log('Recording stopped');

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    
    // Save the video blob to IndexedDB
    saveVideoBlobToDB(blob).then(() => {
      console.log('Video saved to IndexedDB');
    }).catch(err => {
      console.error('Error saving video to IndexedDB:', err);
    });
    }; 
    
  }

//create video URL to use in saveVideo function
function uploadVideo() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const timeslot = localStorage.getItem('selectedTimeslot');
  
    // Check if there are recorded chunks
    if (recordedChunks.length === 0) {
      alert('Please record a video first by pressing "Start Recording".');
      return;  // Prevent upload
    }
  
    getVideoBlobFromDB().then(videoBlobs => {
      if (videoBlobs.length > 0) {
        const videoBlob = videoBlobs[videoBlobs.length - 1]; // Get the most recent video Blob
        const videoUrl = URL.createObjectURL(videoBlob);  // Create a URL for the Blob
        saveVideo(firstName, lastName, timeslot, videoUrl);  // Use URL for the video
        alert('Video saved successfully!');
  
        // Delete video from IndexedDB after saving
        deleteAllVideosFromDB().then(() => {
          console.log('Video deleted from IndexedDB');
        }).catch(err => {
          console.error('Error deleting video from IndexedDB:', err);
        });
      } else {
        alert('No video to upload. Please record a video first.');
      }
    }).catch(err => {
      console.error('Error retrieving video from IndexedDB:', err);
    });
  }
  
//save video to computer using video URL from uploadVideo() function (downloads folder)
function saveVideo(firstName, lastName, timeslot, videoUrl) {
    // Create a link element
    const downloadLink = document.createElement('a');
  
    // Set the href to the Blob URL
    downloadLink.href = videoUrl;
  
    // Set the download attribute to specify the filename
    downloadLink.download = `${firstName} ${lastName}, ${timeslot}`; 
  
    // Programmatically trigger a click event on the link to start the download
    downloadLink.click();
  
    // Optionally, revoke the Blob URL if you're done with it
    URL.revokeObjectURL(videoUrl);
  }

//toggle between "start recording" and "stop recording" button
let isRecording = false; //initialize isRecording to false everytime the page runs
function toggleRecording() {
  const recordButton = document.getElementById('recordButton');
  
  if (isRecording) {
      // Stop recording
      stopRecording();
      recordButton.textContent = 'Start Recording';
      recordButton.classList.remove('btn-danger');  // Remove red color
      recordButton.classList.add('btn-success');  // Add original color
  } else {
      // Start recording
      startRecording();
      recordButton.textContent = 'Stop Recording';
      recordButton.classList.remove('btn-success');  // Remove original color
      recordButton.classList.add('btn-danger');  // Add red color
  }
  isRecording = !isRecording;  // Toggle the recording state
}

// Function to replay the video after recording
function replayRecording() {
  getVideoBlobFromDB().then(videoBlobs => {
    if (videoBlobs.length > 0) {
      const videoBlob = videoBlobs[videoBlobs.length - 1]; // Get the most recent video Blob
      const videoUrl = URL.createObjectURL(videoBlob);  // Create a URL for the Blob
      const videoElement = document.getElementById('replayVideo');
      videoElement.src = videoUrl;  // Set the video source to the fetched Blob URL
      videoElement.style.display = 'block';
      videoElement.play();  // Play the video
      console.log("Replaying video...");
    } else {
      alert("No recording available to replay!");
    }
  }).catch(err => {
    console.error('Error retrieving video from IndexedDB:', err);
  });
}

// Function to delete the current recording and reset the state
function deleteRecording() {
  recordedChunks = []; // Clear recorded chunks
  const video = document.getElementById('video');
  video.src = ''; // Clear the video source
  deleteAllVideosFromDB().then(() => {
    console.log('Video deleted from IndexedDB');
  }).catch(err => {
    console.error('Error deleting video from IndexedDB:', err);
  });
  alert('Recording deleted and reset.');
}


///////////////////////////////////////////////////////////////////
/////////IndexedDB functions (for saving studnet recordings temporarily)
// Open IndexedDB database
function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('videoDB', 1);
  
      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos', { autoIncrement: true });
        }
      };
  
      request.onerror = event => {
        reject('Error opening IndexedDB');
      };
  
      request.onsuccess = event => {
        resolve(event.target.result);
      };
    });
  }
  
  // Save video blob to IndexedDB
  function saveVideoBlobToDB(blob) {
    return openDB().then(db => {
      const transaction = db.transaction('videos', 'readwrite');
      const store = transaction.objectStore('videos');
      
      // Create a File object with the proper name and type
      const videoFile = new File([blob], 'video_recording.webm', { type: 'video/webm' });  // You can change the file extension and MIME type
      store.add(videoFile);
  
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject('Error saving video to DB');
      });
    });
  }
  
  // Retrieve video blob from IndexedDB
  function getVideoBlobFromDB() {
    return openDB().then(db => {
      const transaction = db.transaction('videos', 'readonly');
      const store = transaction.objectStore('videos');
      const request = store.getAll();
  
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Error retrieving video from DB');
      });
    });
  }
  
  // delete videos stored in IndexedDB
  function deleteAllVideosFromDB() {
    return openDB().then(db => {
      const transaction = db.transaction('videos', 'readwrite');
      const store = transaction.objectStore('videos');
      
      // Clear all records in the object store
      const deleteRequest = store.clear();
  
      return new Promise((resolve, reject) => {
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject('Error deleting all videos from DB');
      });
    });
  }