
// this module is to process and return the checkin search information
// use a popup window to show the results
function checkinSearchReady(text){
    const data = JSON.parse(text);
    
    if (data.hasOwnProperty('results')) {
        const new_rbookinginfo = data.results[0];

        checkinSearchPopup(new_rbookinginfo);
    } else {
        console.log('Unknown response type:', data);
    }
}

/* first callback function */
function checkinSearchResponse(response){
    return response.text();
}

/* process onSubmit event */
function processCheckinSearch(e) {
    e.preventDefault();
    /*retrieve form data for each field */
    const bookingno = document.querySelector('#checkin_search').value;

    const data = JSON.stringify({
        bookingno: bookingno
    });

    fetch('http://localhost:3000/rbookinginfo', fetchCheckinSearch(data))
    .then(checkinSearchResponse)
    .then(checkinSearchReady);
}

function checkinSearchPopup(new_rbookinginfo) {
    const popupcontainer = document.getElementById('popupcontainer');
    const popuptext = document.getElementById('popuptext');

    // insert the popup window with new information
    popuptext.innerHTML = `<p>Room No.: ${new_rbookinginfo.r_no}</p>
                              <p>Booking No.: ${new_rbookinginfo.b_ref}</p>
                              <p>Date In: ${new_rbookinginfo.checkin}</p>
                              <p>Date Out: ${new_rbookinginfo.checkout}</p>`;

    // display the popup
    popupcontainer.style.display = 'block';
}


   /* the request data */
function fetchCheckinSearch(data){
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    }
    return fetchOptions;
}

const rbookingForm = document.querySelector("#btn_checkin");

rbookingForm.addEventListener("click", processCheckinSearch);



// this module is to confirm checkin and returnthe data
/* second callback function to handle the text returned */
// use a popup window to show the results
function oncheckinReady(text){
    const data = JSON.parse(text);

    if (data.hasOwnProperty('results')) {
        const CheckIn = data.results[0];

        checkinPopup(CheckIn);
    } else {
        console.log('Unknown response type:', data);
    }
}

/* first callback function */
function oncheckinResponse(response){
    console.log(response)
    return response.text();
}

/* process onSubmit event */
function processCheckin(e) {
    e.preventDefault();
    /*retrieve form data for each field */
    const rnumber = document.querySelector('#roomno').value;
    const rstatus = document.querySelector('#roomstatus').value;
    const rnotes = document.querySelector('#roomnotes').value;


    const data = JSON.stringify({
        rnumber: rnumber,
        rstatus: rstatus, 
        rnotes: rnotes
    });

    fetch('http://localhost:3000/checkinconfirm', fetchOptions(data))
    .then(oncheckinResponse)
    .then(oncheckoutReady);

    console.log(data);
}

function checkinPopup(CheckIn) {
    const popupcontainer = document.getElementById('popupcontainer');
    const popuptext = document.getElementById('popuptext');

    // Update the content of the popup with the new record information
    popuptext.innerHTML = `<p>Room No: ${CheckIn.r_no}</p>
                              <p>Room Class: ${CheckIn.r_class}</p>
                              <p>Room Status: ${CheckIn.r_status}</p>
                              <p>Room Notes: ${CheckIn.r_notes}</p>`;

    // Display the popup
    popupcontainer.style.display = 'block';
}

function closePopup() {
    const popupcontainer = document.getElementById('popupcontainer');
    popupcontainer.style.display = 'none';
}


   /* the request data */
function fetchOptions(data){
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    }
    return fetchOptions;
}

const checkinConfirm = document.querySelector("#checkin_confirm");

checkinConfirm.addEventListener("click", processCheckin);
