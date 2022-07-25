import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import './App.css';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';

var url = "http://localhost:1323/booking"
if (process.env.NODE_ENV == 'production') {
  url = "/booking"
}

const App = () => {

  const [booking, setBooking] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    { title: 'Boot', field: 'boat' },
    { title: 'Datum', field: 'date' },
    { title: 'Tijd', field: 'time', sorting :false  },
    { title: 'Duur', field: 'duration', type : 'numeric', sorting :false  },
    { title: 'Gebruiker', field: 'user' },
    { title: 'Password', field: 'password', sorting :false  },
    { title: 'Commentaar', field: 'comment', editable : 'onAdd', sorting :false  },
    { title: 'Status', field: 'state' },
    { title: 'Melding', field: 'message', editable : 'never', sorting :false },
  ]

  useEffect(() => {
    axios.get(`${url}`)
      .then(res => {
        const booking = res.data;
        setBooking(booking);
        // console.log(booking);
      })
  }, [])



  //function for updating the existing row details
  const handleRowUpdate = (newData, oldData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.password === "") {
      errorList.push("Try Again, You didn't enter the Password field")
    }
    if (newData.user === "") {
      errorList.push("Try Again, You didn't enter the User field")
    }
    if (newData.boat === "") {
      errorList.push("Try Again, You didn't enter the Boat field")
    }
    if (newData.date === "") {
      errorList.push("Try Again, You didn't enter the Date field")
    }
    if (newData.time === "") {
      errorList.push("Try Again, You didn't enter the Time field")
    }
    if (newData.duration === "") {
      errorList.push("Try Again, You didn't enter the Duration field")
    }
   newData.user = newData.user.toUpperCase() 

    if (errorList.length < 1) {
      axios.put(`${url}/${newData.id}`, newData)
        .then(response => {
          const data = response.data;
          setBooking(data);
          resolve()
          setIserror(false)
          setErrorMessages([])
        })
        .catch(error => {
          setErrorMessages(["Update failed! Server error"])
          setIserror(true)
          resolve()

        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }
  }


  //function for deleting a row
  const handleRowDelete = (oldData, resolve) => {
    axios.delete(`${url}/${oldData.id}`)
      .then(response => {
        const data = response.data;
        setBooking(data);
        resolve()
        setIserror(false)
        setErrorMessages([])
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  //function for adding a new row to the table
  const handleRowAdd = (newData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.password === "") {
      errorList.push("Try Again, You didn't enter the Password field")
    }
    if (newData.user === "") {
      errorList.push("Try Again, You didn't enter the User field")
    }
    if (newData.boat === "") {
      errorList.push("Try Again, You didn't enter the Boat field")
    }
    if (newData.date === "") {
      errorList.push("Try Again, You didn't enter the Date field")
    }
    if (newData.time === "") {
      errorList.push("Try Again, You didn't enter the Time field")
    }
    if (newData.duration === "") {
      errorList.push("Try Again, You didn't enter the Duration field")
    }

    newData.user = newData.user.toUpperCase() 

    if (errorList.length < 1) {
      axios.post(`${url}`, newData)
        .then(response => {
          const data = response.data;
          setBooking(data);
          resolve()
          setErrorMessages([])
          setIserror(false)
        })
        .catch(error => {
          setErrorMessages(["Cannot add data. Server error!"])
          setIserror(true)
          resolve()
        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }


  return (
    <div className="app">
      <h1>Spaarne Boot Robot</h1> <br /><br />

      <MaterialTable
        title="Booking Details"
        columns={columns}
        data={booking}
        options={{
          headerStyle: { borderBottomColor: 'red', borderBottomWidth: '3px', fontFamily: 'verdana' },
          actionsColumnIndex: -1,
          pageSize: 10
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);

            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve)
            }),
        }}
      />

      <div>
        {iserror &&
          <Alert severity="error">
            <AlertTitle>ERROR</AlertTitle>
            {errorMessages.map((msg, i) => {
              return <div key={i}>{msg}</div>
            })}
          </Alert>
        }
      </div>

    </div>
  );
}

export default App;
