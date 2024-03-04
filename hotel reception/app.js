// server of the reception
const env = process.env.NODE_ENV || 'development';

// import database configurations 
const config = require('./config.js')[env];

const express = require('express')
const app = express();
const port = 3000;

/// load PG library
const pg = require('pg');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(express.static('public'));

app.get('/', (req, res) =>{
    res.sendFile('reception_home.html', {root: 'public'},(err) =>{
        if (err){
            console.log(err);
        }
    })
});

// use json body parser by default
app.use(bodyParser.json());

// set up a route to get room data
app.get('/roomAvailability', jsonParser, async (req, res) => {
    try {
        // extract the date parameter from the query string
        const selectedDate = req.query.date;
        const available = 'A';
        // create a query to get room data that match the selected date
        const q = `SELECT rates.price, room.r_class, COUNT(room.r_no) AS totalno FROM "public".rates 
                    LEFT JOIN "public".room ON rates.r_class = room.r_class
                    LEFT JOIN "public".roombooking
                    ON room.r_no = roombooking.r_no AND roombooking.checkin = $1
                    WHERE room.r_status = '${available}' AND roombooking.r_no IS NULL
                    GROUP BY rates.price, room.r_class;`;

        const pool = new pg.Pool(config);
        const client = await pool.connect();

        await client.query(q, [selectedDate], (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ message: 'Sorry, something went wrong! The data has not been processed ' + errors[0] });
            } else {
                client.release();
                data = results.rows;
                count = results.rows.length;
                res.json({ results: data, rows: count });
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// create a new route to get the available room number based on
// results of the room availability query
app.get('/availableRoomsNumber', jsonParser, async (req, res) => {
    try {
        // extract the date parameter from the query string
        const selectedClass = req.query.roomClass;
        const available = 'A';

        // create a query to get room number that match the selected class
        const q = `SELECT  room.r_notes, room.r_no FROM "public".room 
                    LEFT JOIN "public".roombooking
                    ON room.r_no = roombooking.r_no AND roombooking.checkin = $1
                    WHERE room.r_status = '${available}' AND roombooking.r_no IS NULL
                    AND room.r_class = $2;`;

        const pool = new pg.Pool(config);
        const client = await pool.connect();

        await client.query(q, [new Date(), selectedClass], (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ message: 'Sorry, something went wrong! The data has not been processed ' + errors[0] });
            } else {
                client.release();
                data = results.rows;
                count = results.rows.length;
                res.json({ results: data, rows: count });
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/addcustomer', jsonParser, async(req, res) => {
    const body = req.body;
	const ID = body.ID;
    const name = body.name;
    const email = body.email;
	const address = body.address;
    const cardtype = body.cardtype;
    const cardexp = body.cardexp;
    const cardno = body.cardno;

    try{
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `insert into "public".customer(c_no, c_name, c_email, c_address, c_cardtype, c_cardexp, c_cardno) values
                 ('${ID.trim()}', '${name.trim()}', '${email.trim()}', '${address.trim()}', '${cardtype.trim()}', 
                 '${cardexp.trim()}', '${cardno.trim()}'); select * from "public".customer where c_no = '${ID.trim()}'` ;
        await client.query(q, (err, results) => {
            if(err) {
                console.log(err.stack)
                errors = err.stack.split(" at ");
                res.json({message: 'Sorry something went wrong! The data has not been processed ' + errors[0]});
            }else{
                client.release();
                data = results[1].rows;
                count = results[1].rows.length;
                res.json({ results:data, rows:count});
            }
        });
    }catch(e){
        console.log(e);
    }
})

app.post('/addbooking', jsonParser, async(req, res) => {
    const body = req.body;
	const b_ref = body.b_ref;
    const customerID = body.customerID;
    const b_cost = body.b_cost;
	const outstanding = body.outstanding;
    const b_notes = body.b_notes;

    try{
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `insert into "public".booking(b_ref, c_no, b_cost, b_outstanding, b_notes) values
                 ('${b_ref.trim()}', '${customerID.trim()}', '${b_cost.trim()}', '${outstanding.trim()}', '${b_notes.trim()}'); 
                 select * from "public".booking where b_ref = '${b_ref.trim()}';`;
        await client.query(q, (err, results) => {
            if(err) {
                console.log(err.stack)
                errors = err.stack.split(" at ");
                res.json({message: 'Sorry something went wrong! The data has not been processed ' + errors[0]});
            }else{
                client.release();
                data = results[1].rows;
                count = results[1].rows.length;
                res.json({ results:data, rows:count});
            }
        });
    }catch(e){
        console.log(e);
    }
})

app.post('/addstayinfo', jsonParser, async(req, res) => {
    const body = req.body;
	const rno = body.rno;
    const bookingno = body.bookingno;
    const datein = body.datein;
	const dateout = body.dateout;

    try{
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `insert into "public".roombooking(r_no, b_ref, checkin, checkout) values
                 ('${rno.trim()}', '${bookingno.trim()}', '${datein.trim()}', '${dateout.trim()}'); 
                 select * from "public".roombooking where r_no = '${rno.trim()}' AND b_ref = '${bookingno.trim()}';`;
        await client.query(q, (err, results) => {
            if(err) {
                console.log(err.stack)
                errors = err.stack.split(" at ");
                res.json({message: 'Sorry something went wrong! The data has not been processed ' + errors[0]});
            }else{
                client.release();
                data = results[1].rows;
                count = results[1].rows.length;
                res.json({ results:data, rows:count});
            }
        });
    }catch(e){
        console.log(e);
    }
})

app.post('/rbookinginfo', jsonParser, async(req, res) => {
    const body = req.body;
    const bookingno = body.bookingno;

    try{
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `select * from "public".roombooking where b_ref = '${bookingno.trim()}';`;
        await client.query(q, (err, results) => {
            if(err) {
                console.log(err.stack)
                errors = err.stack.split(" at ");
                res.json({message: 'Sorry something went wrong! The data has not been processed ' + errors[0]});
            }else{
                client.release();
                data = results.rows;
                count = results.rows.length;
                res.json({ results:data, rows:count});
            }
        });
    }catch(e){
        console.log(e);
    }
})

app.post('/checkinconfirm', jsonParser, async(req, res) => {
    const body = req.body;
	const rnumber = body.rnumber;
    const rstatus = body.rstatus;
    const rnotes = body.rnotes;

    try{
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `update "public".room set r_status = '${rstatus.trim()}', r_notes = '${rnotes.trim()}' where r_no = '${rnumber.trim()}'; select * from "public".room where r_no = '${rnumber.trim()}';`;
        await client.query(q, (err, results) => {
            if(err) {
                console.log(err.stack)
                errors = err.stack.split(" at ");
                res.json({message: 'Sorry something went wrong! The data has not been processed ' + errors[0]});
            }else{
                client.release();
                data = results[1].rows;
                count = results[1].rows.length;
                res.json({ results:data, rows:count});
            }
        });
    }catch(e){
        console.log(e);
    }
})

app.post('/outstandinginfo', jsonParser, async(req, res) => {
    const body = req.body;
    const bref = body.bref;

    try{
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = ` select b_cost, b_outstanding from "public".booking where b_ref = '${bref.trim()}';`;
        await client.query(q, (err, results) => {
            if(err) {
                console.log(err.stack)
                errors = err.stack.split(" at ");
                res.json({message: 'Sorry something went wrong! The data has not been processed ' + errors[0]});
            }else{
                client.release();
                data = results.rows;
                count = results.rows.length;
                res.json({ results:data, rows:count});
            }
        });
    }catch(e){
        console.log(e);
    }
})

app.post('/pay_confirm', jsonParser, async(req, res) => {
    const body = req.body;
    const bRef = body.bRef;
    const outstand = body.outstand;

    try{
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = ` update "public".booking set b_outstanding = '${outstand.trim()}' where b_ref =  '${bRef.trim()}';
                    select b_cost, b_outstanding from "public".booking where b_ref = '${bRef.trim()}'`;
        await client.query(q, (err, results) => {
            if(err) {
                console.log(err.stack)
                errors = err.stack.split(" at ");
                res.json({message: 'Sorry something went wrong! The data has not been processed ' + errors[0]});
            }else{
                client.release();
                data = results[1].rows;
                count = results[1].rows.length;
                res.json({ results:data, rows:count});
            }
        });
    }catch(e){
        console.log(e);
    }
})

app.post('/checkoutconfirm', jsonParser, async(req, res) => {
    const body = req.body;
	const rnum = body.rnum;
    const roomstatus = body.roomstatus;
    const roomnotes = body.roomnotes;

    try{
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `update "public".room set r_status = '${roomstatus.trim()}', r_notes = '${roomnotes.trim()}' where r_no = '${rnum.trim()}'; select * from "public".room where r_no = '${rnum.trim()}';`;
        await client.query(q, (err, results) => {
            if(err) {
                console.log(err.stack)
                errors = err.stack.split(" at ");
                res.json({message: 'Sorry something went wrong! The data has not been processed ' + errors[0]});
            }else{
                client.release();
                data = results[1].rows;
                count = results[1].rows.length;
                res.json({ results:data, rows:count});
            }
        });
    }catch(e){
        console.log(e);
    }
})

 
app.listen(port, () => {
    console.log(`My first app listening on port ${port}!`)
});