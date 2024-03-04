
function onTextReady(text){
    console.log(text);
    const data = JSON.parse(text);
    
    const tableContent = document.getElementById('room_availability_body');
    tableContent.innerHTML = '';

    if(data.hasOwnProperty('results')){
        // show the room status in a table
        data.results.forEach((element) => {
            const row = tableContent.insertRow();
            row.insertCell(0).innerText = element.r_class || element.r_notes;
            row.insertCell(1).innerText = element.totalno || element.r_no;
            row.insertCell(2).innerText = element.price || element.r_notes;
            
        });

        const resultsContainer = document.getElementById('room_availability');
        resultsContainer.style.display = 'block';

    }else if(data.hasOwnProperty('results')){

        data.rooms.forEach((element) => {
            const row = tableContent.insertRow();
            row.insertCell(0).innerText = element.r_notes;
            row.insertCell(1).innerText = element.r_no;
    });
    
        const resultsContainer = document.getElementById('room_availability');
        resultsContainer.style.display = 'block';
    }else{
        console.log('Unknown response type:', data);
    }

}

function onResponse(response){
    return response.text();
}

// create a function to retrieve data on the URL
function showRoomAvailability(clickedDate) {
    console.log('Clicked Date:', clickedDate);

    fetch(`http://localhost:3000/roomAvailability?date=${clickedDate}`)
        .then(onResponse)
        .then(onTextReady);
}

const calendarDates = document.querySelector(".calendar_dates");
// add a event listener so that a click on the calendar will trigger the function
calendarDates.addEventListener("click", (event) => {
    if (event.target.tagName === "LI" && !event.target.classList.contains("inactive")) {
        const clickedDate = `${year}-${month + 1}-${event.target.innerText}`;
        showRoomAvailability(clickedDate);
    }
});

// retrieve the date from the room availability query 
const tableContent = document.getElementById('room_availability_table');

function showAvailableRoomsByClass(roomClass) {
    // use fetch to get available rooms number by room class
    fetch(`http://localhost:3000/availableRoomsNumber?roomClass=${roomClass}`)
        .then(onResponse)
        .then(onTextReady);
}

tableContent.addEventListener('click', (event) => {
    const clickedCell = event.target;
    const rowIndex = clickedCell.parentNode.rowIndex;

    // check if the clicked cell is in the first column (totalno) and not in the header row
    if (clickedCell.cellIndex === 1 && rowIndex !== 0) {
        const roomClass = tableContent.rows[rowIndex].cells[0].innerText;
        showAvailableRoomsByClass(roomClass);
    }
});

