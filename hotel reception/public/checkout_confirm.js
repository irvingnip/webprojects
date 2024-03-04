
// this module is to search the outstanding informaiton
// use a popup window to show the results
function OutstandingReady(text){
    const data = JSON.parse(text);

    if (data.hasOwnProperty('results')) {
        const Outstanding = data.results[0];

        OutstandingPopup(Outstanding);
    } else {
        console.log('Unknown response type:', data);
    }
}

/* first callback function */
function OutstandingResponse(response){
    console.log(response)
    return response.text();
}

/* process onSubmit event */
function processOutstanding(e) {
    e.preventDefault();
    /*retrieve form data for each field */
    const bref = document.querySelector('#outstanding_search').value;

    const data = JSON.stringify({
        bref:bref
    });

    fetch('http://localhost:3000/outstandinginfo', fetchOutstanding(data))
    .then(OutstandingResponse)
    .then(OutstandingReady);

    // console.log(data);
}

function OutstandingPopup(Outstanding) {
    const popupcontainer = document.getElementById('popupcontainer');
    const popuptext = document.getElementById('popuptext');

    // Update the content of the popup with the new record information
    popuptext.innerHTML = `<p>Cost: ${Outstanding.b_cost}</p>
                              <p>Outstanding: ${Outstanding.b_outstanding}</p>`;

    // Display the popup
    popupcontainer.style.display = 'block';
}


   /* the request data */
function fetchOutstanding(data){
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

const OutstandingForm = document.querySelector("#btn_outstanding");

OutstandingForm.addEventListener("click", processOutstanding);


// this module is to confirm the payment information
// use a popup window to show the results
function onpaymentReady(text){
    const data = JSON.parse(text);

    if (data.hasOwnProperty('results')) {
        const outStanding = data.results[0];

        paymentPopup(outStanding);
    } else {
        console.log('Unknown response type:', data);
    }
}

/* first callback function */
function onpaymentResponse(response){
    console.log(response)
    return response.text();
}

/* process onSubmit event */
function processPayment(e) {
    e.preventDefault();
    /*retrieve form data for each field */
    const bRef = document.querySelector('#bRef').value;
    const outstand = document.querySelector('#Outstanding').value;

    const data = JSON.stringify({
        bRef: bRef,
        outstand: outstand
    });

    fetch('http://localhost:3000/pay_confirm', fetchPayment(data))
    .then(onpaymentResponse)
    .then(onpaymentReady);

    console.log(data);
}

function paymentPopup(outStanding) {
    const popupcontainer = document.getElementById('popupcontainer');
    const popuptext = document.getElementById('popuptext');

    // Update the content of the popup with the new record information
    popuptext.innerHTML = `<p>Cost: ${outStanding.b_cost}</p>
                              <p>Outstanding: ${outStanding.b_outstanding}</p>`;

    // Display the popup
    popupcontainer.style.display = 'block';
}


   /* the request data */
function fetchPayment(data){
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

const payConfirm = document.getElementById("pay_confirm");

payConfirm.addEventListener("click", processPayment);


// this module is to confirm checkout 
// use a popup window to show the results
function oncheckoutReady(text){
    const data = JSON.parse(text);

    if (data.hasOwnProperty('results')) {
        const CheckOut = data.results[0];

        checkoutPopup(CheckOut);
    } else {
        console.log('Unknown response type:', data);
    }
}

/* first callback function */
function oncheckoutResponse(response){
    console.log(response)
    return response.text();
}


/* process onSubmit event */
function processCheckout(e) {
    e.preventDefault();
    /*retrieve form data for each field */
    const rnum = document.querySelector('#RoomNo').value;
    const roomstatus = document.querySelector('#RoomStatus').value;
    const roomnotes = document.querySelector('#RoomNotes').value;


    const data = JSON.stringify({
        rnum: rnum,
        roomstatus: roomstatus,
        roomnotes: roomnotes
    });

    fetch('http://localhost:3000/checkoutconfirm', fetchCheckout(data))
    .then(oncheckoutResponse)
    .then(oncheckoutReady);

    console.log(data);
}

function checkoutPopup(CheckOut) {
    const popupcontainer = document.getElementById('popupcontainer');
    const popuptext = document.getElementById('popuptext');

    // Update the content of the popup with the new record information
    popuptext.innerHTML = `<p>Room No: ${CheckOut.r_no}</p>
                              <p>Room Class: ${CheckOut.r_class}</p>
                              <p>Room Status: ${CheckOut.r_status}</p>
                              <p>Room Notes: ${CheckOut.r_notes}</p>`;

    // Display the popup
    popupcontainer.style.display = 'block';
}

function closePopup() {
    const popupcontainer = document.getElementById('popupcontainer');
    popupcontainer.style.display = 'none';
}


   /* the request data */
function fetchCheckout(data){
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

const checkoutConfirm = document.querySelector("#checkout_confirm");

checkoutConfirm.addEventListener("click", processCheckout);
