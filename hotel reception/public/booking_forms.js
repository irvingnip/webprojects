

// this module is to precess and return the customer information
// use a popup window to show the results
function oncustomerReady(text){
    const data = JSON.parse(text);

    if (data.hasOwnProperty('results')) {
        const new_customer = data.results[0];

        CustomerPopup(new_customer);
    } else {
        console.log('Unknown response type:', data);
    }
}

/* first callback function */
function oncustomerResponse(response){
    console.log(response)
    return response.text();
}

/* process onSubmit event */
function processCustomer(e) {
    e.preventDefault();
    /*retrieve form data for each field */
    const ID = document.querySelector('#ID').value;
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const address = document.querySelector('#address').value;
    const cardtype = document.querySelector('#cardtype').value;
    const cardexp = document.querySelector('#cardexp').value;
    const cardno = document.querySelector('#cardno').value;


    const data = JSON.stringify({
        ID: ID,
        name: name,
        email: email,
        address: address,
        cardtype: cardtype,
        cardexp: cardexp,
        cardno: cardno    
    });

    fetch('http://localhost:3000/addcustomer', fetchCustomer(data))
    .then(oncustomerResponse)
    .then(oncustomerReady);
}

function CustomerPopup(new_customer) {
    const popupcontainer = document.getElementById('popupcontainer');
    const popuptext = document.getElementById('popuptext');

    // Update the content of the popup with the new record information
    popuptext.innerHTML = `<p>ID: ${new_customer.c_no}</p>
                              <p>Name: ${new_customer.c_name}</p>
                              <p>Email: ${new_customer.c_email}</p>
                              <p>Address: ${new_customer.c_address}</p>
                              <p>Cardtype: ${new_customer.c_cardtype}</p>
                              <p>Cardexp: ${new_customer.c_cardexp}</p>
                              <p>Cardno: ${new_customer.c_cardno}</p>`;

    // Display the popup
    popupcontainer.style.display = 'block';
}


   /* the request data */
function fetchCustomer(data){
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

const customerForm = document.querySelector("#guest_confirm");

customerForm.addEventListener("click", processCustomer);


// this module is to process and return the booking information 
// use a popup window to show the results
function onbookingReady(text){
    const data = JSON.parse(text);

    if (data.hasOwnProperty('results')) {
        const new_booking = data.results[0];

        BookingPopup(new_booking);
    } else {
        console.log('Unknown response type:', data);
    }
}

/* first callback function */
function onbookingResponse(response){
    console.log(response)
    return response.text();
}


/* process onSubmit event */
function processBooking(e) {
    e.preventDefault();
    /*retrieve form data for each field */
    const b_ref = document.querySelector('#b_ref').value;
    const customerID = document.querySelector('#customerID').value;
    const b_cost = document.querySelector('#b_cost').value;
    const outstanding = document.querySelector('#outstanding').value;
    const b_notes = document.querySelector('#b_notes').value;


    const data = JSON.stringify({
        b_ref: b_ref,
        customerID: customerID,
        b_cost: b_cost,
        outstanding: outstanding,
        b_notes: b_notes 
    });

    fetch('http://localhost:3000/addbooking', fetchOptions(data))
    .then(onbookingResponse)
    .then(onbookingReady);
}

function BookingPopup(new_booking) {
    const popupcontainer = document.getElementById('popupcontainer');
    const popuptext = document.getElementById('popuptext');

    // insert the popup window with new information
    popuptext.innerHTML = `<p>Booking No.: ${new_booking.b_ref}</p>
                              <p>Customer ID: ${new_booking.c_no}</p>
                              <p>Cost: ${new_booking.b_cost}</p>
                              <p>Outstanding: ${new_booking.b_outstanding}</p>
                              <p>Booking Notes: ${new_booking.b_notes}</p>`;

    // display the popup
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

const bookingForm = document.querySelector("#booking_confirm");

bookingForm.addEventListener("click", processBooking);


// this module is to process and return the roombooking information 
// use a popup window to show the results
function RoomBookingReady(text){
    const data = JSON.parse(text);

    if (data.hasOwnProperty('results')) {
        const new_roombooking = data.results[0];

        RoomBookingPopup(new_roombooking);
    } else {
        console.log('Unknown response type:', data);
    }
}

/* first callback function */
function RoomBookingResponse(response){
    console.log(response)
    return response.text();
}


/* process onSubmit event */
function processRoomBooking(e) {
    e.preventDefault();
    /*retrieve form data for each field */
    const rno = document.querySelector('#r_no').value;
    const bookingno = document.querySelector('#bookingno').value;
    const datein = document.querySelector('#datein').value;
    const dateout = document.querySelector('#dateout').value;


    const data = JSON.stringify({
        rno: rno,
        bookingno: bookingno,
        datein: datein,
        dateout: dateout,
    });

    fetch('http://localhost:3000/addstayinfo', fetchRoomBooking(data))
    .then(RoomBookingResponse)
    .then(RoomBookingReady);
}

function RoomBookingPopup(new_roombooking) {
    const popupcontainer = document.getElementById('popupcontainer');
    const popuptext = document.getElementById('popuptext');

    // insert the popup window with new information
    popuptext.innerHTML = `<p>Room No.: ${new_roombooking.r_no}</p>
                              <p>Booking No.: ${new_roombooking.b_ref}</p>
                              <p>Date In: ${new_roombooking.checkin}</p>
                              <p>Date Out: ${new_roombooking.checkout}</p>`;

    // display the popup
    popupcontainer.style.display = 'block';
}

   /* the request data */
function fetchRoomBooking(data){
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

const roombookingForm = document.querySelector("#stay_confirm");

roombookingForm.addEventListener("click", processRoomBooking);