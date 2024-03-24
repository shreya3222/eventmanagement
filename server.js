import mysql from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();


// middleware
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("/public/images"));



// routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/logino", (req, res) => {
  res.render("logino.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/organiser", (req, res) => {
  res.render("organiser.ejs");
});
app.get("/userpage", (req, res) => {
  res.render("userpage.ejs");
});
app.get("/events", (req, res) => {
  res.render("events.ejs");
});
app.get("/tickets", (req, res) => {
  res.render("tickets.ejs");
});



// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'event',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Register API endpoint
app.post("/api/register", (req, res) => {
  const userData = req.body;
  pool.query('INSERT INTO user (name, username, password, contact, age, email, events_visited, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
             [userData.name, userData.username, userData.password, userData.contact, userData.age, userData.email, userData.evisited, userData.address], 
             (error, results) => {
    if (error) {
      res.status(500).send("Error registering user");
      return;
    }
    // Redirect to success page on the client side
    res.redirect('/login');
  });
  console.log("User registered successfully");
});

// get all users as json
app.get("/api/users", (req, res) => {
  pool.query('SELECT * FROM user', (error, results) => {
    if (error) {
      res.status(500).send("Error getting users");
      return;
    }
    res.status(200).json(results);
  });
  console.log("Got all users");
});



//organiser
app.post("/api/organiser", (req, res) => {
  console.log("Received request body:", req.body);
  const organiserData = req.body;
  pool.query(
    'INSERT INTO organiser (eventname, eventdate, ticketprice, venuename, etype,econtact) VALUES (?, ?, ?, ?, ?, ?)', 
    [organiserData.eventname, organiserData.eventdate, organiserData.ticketprice, organiserData.venuename, organiserData.etype, organiserData.econtact], 
    (error, results) => {
      if (error) {
        console.error("Error organizing event:", error); // Log the error
        res.status(500).send("Error organizing event");
        return;
      }
      console.log("Event organized successfully");
      res.redirect('/api/events');
    });
});

// get all organisers as json
app.get("/api/organiser", (req, res) => {
  pool.query('SELECT * FROM organiser', (error, results) => {
    if (error) {
      res.status(500).send("Error getting organiser");
      return;
    }
    res.status(200).json(results);
  });
  console.log("Got all organisers");
});

//fetching data from the organiser table 
app.get('/api/events', (req, res) => {
pool.query('select * from organiser',(err,results,fields)=>{
  if (err){
    return console.log(err);
  }
  res.render('events.ejs', { events: results }); 
});
});

// Delete an event by ID
app.delete("/api/event/:eventId", (req, res) => {
  const eventId = req.params.eventId;
  pool.query('DELETE FROM organiser WHERE eventid = ?', eventId, (error, results) => {
    if (error) {
      console.error("Error deleting event:", error);
      res.status(500).send("Error deleting event");
      return;
    }
    console.log("Event deleted successfully");
    res.status(200).send("Event deleted successfully");
  });
});





// Express route to display event details
app.get('/details/:eventId', (req, res) => {
  const eventId = req.params.eventId;

  // Query to retrieve event details from the organizer table based on event id
  const eventQuery = 'SELECT * FROM organiser WHERE eventid = ?';

  // Query to fetch venue details from the venue table using the venue name from organizer table
  const venueQuery = 'SELECT * FROM venue WHERE venuename = (SELECT venuename FROM organiser WHERE eventid = ?)';

  // Execute the event query
  pool.query(eventQuery, [eventId], (error, eventResults) => {
    if (error) {
      console.error("Error fetching event details:", error);
      res.status(500).send("Error fetching event details");
      return;
    }

    if (eventResults.length === 0) {
      res.status(404).send("Event not found");
      return;
    }

    // Execute the venue query
    pool.query(venueQuery, [eventId], (error, venueResults) => {
      if (error) {
        console.error("Error fetching venue details:", error);
        res.status(500).send("Error fetching venue details");
        return;
      }

      const eventDetails = eventResults[0];
      const venueDetails = venueResults[0];

      // Combine event and venue details into a single object
      const eventData = {
        event: eventDetails,
        venue: venueDetails
      };

      // Render the details page with the combined data
      res.render('details.ejs', { eventData });
    });
  });
});




//login for user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
  pool.query(sql, [username, password], (error, results) => {
      if (error) {
          console.error("Error executing query:", error);
          return res.status(500).send("Internal Server Error");
      }
      if (results.length > 0) {
          // Redirect to home page on successful login
          res.redirect('/api/userpage');
      } else {
          res.send("Invalid username or password.");
      }
  });
});

//login for ORGANISER
app.post('/logino', (req, res) => {
  const { eventname, econtact } = req.body;
  const sql = 'SELECT * FROM organiser WHERE eventname = ? AND econtact = ?';
  pool.query(sql, [eventname, econtact], (error, results) => {
      if (error) {
          console.error("Error executing query:", error);
          return res.status(500).send("Internal Server Error");
      }
      if (results.length > 0) {
          // Redirect to home page on successful login
          res.redirect('/api/events');
      } else {
          res.send("Invalid details.");
      }
  });
});



//booking
app.post('/api/book', (req, res) => {
  const bookingData = req.body;
  const { eventid, userid } = bookingData;

  const query = `
  INSERT INTO booking (eventid, userid, eventname, ticketprice, venueid, venuename, bookingtime)
  SELECT ?, ?, eventname, ticketprice, (SELECT venueid FROM venue WHERE venuename = (SELECT venuename FROM organiser WHERE eventid = ?)), venuename, CURRENT_TIMESTAMP
  FROM organiser WHERE eventid = ?
  `;

  console.log('SQL Query:', query);
  console.log('Query Values:', [eventid, userid, eventid, eventid]);

  pool.query(query, [eventid, userid, eventid, eventid], (error, results) => {
    if (error) {
      console.error('Error booking event:', error);
      res.status(500).send('Error booking event');
    } else {
      res.status(200).send('Event booked successfully');
    }
  });
});



//fetch tickets data
app.get("/api/tickets", (req, res) => {
  pool.query('SELECT * FROM booking', (error, bookingsData) => {
    if (error) {
      res.status(500).send("Error getting organiser");
      return;
    }
    res.render('tickets.ejs', { bookings: bookingsData });
 
  });
  console.log("Got all booking");
});



//deleting
app.post('/cancel_booking', (req, res) => {
  const bookingId = req.body.bookingId;

  // Delete associated records from the 'rating' table
  pool.query('DELETE FROM rating WHERE rated_item_id = ?', [bookingId], (ratingError, ratingResults) => {
    if (ratingError) {
      console.error('Error deleting associated ratings:', ratingError);
      return res.status(500).send('Error deleting associated ratings');
    }

    // Now delete the booking record
    pool.query('DELETE FROM booking WHERE bookingid = ?', [bookingId], (error, results) => {
      if (error) {
        console.error('Error deleting booking:', error);
        return res.status(500).send('Error deleting booking');
      }
      res.redirect('/api/tickets');
    });
  });
});




//rating
// Route handler to render user page with events for rating
app.get('/api/userpage', (req, res) => {
  // Fetch events from booking table
  pool.query('SELECT eventid, eventname FROM booking', (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
      } else {
          console.log(results); // Log the fetched data to the terminal
          res.render('userpage', { events: results });
      }
  });
});
// Backend route handler for submitting event rating
app.post('/rate-event', (req, res) => {
  const { eventId, rating } = req.body;
  const userId = 1; // Assuming a logged-in user with ID 1

  // Insert rating into rating table
  pool.query('INSERT INTO rating (rated_item_id, rated_by_userid, rating) VALUES (?, ?, ?)', [eventId, userId, rating], (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).send('Error submitting rating');
      } else {
          console.log('Rating added successfully!');
          res.redirect('/api/userpage');
      }
  });
});


// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
