import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.position}</td>
    <td>{props.record.level}</td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
      <button className="btn btn-link" onClick={props.deleteRecord}>
        Delete
      </button>
    </td>
  </tr>
);
export default function RecordList() {
 const [records, setRecords] = useState([]);
  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`http://localhost:5000/record/`, {
          timeout: 10000, // 10 seconds
        });
  
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          console.log("Something is wrong if it's coming here");
          return;
        }
  
        console.log("Now attempting to await response.json");
        const records = await response.json();
        console.log("Fetched records:", records);
        setRecords(records);
      } catch (error) {
        console.error("Request timed out or failed:", error);
        window.alert("Request timed out or failed. Please try again later.");
      }
    }
  
    getRecords();
  }, []); // Empty dependency array to run this effect once when the component mounts
  
  return (
    <div>
      <h3>Record List</h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Level</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <Record
              record={record}
              deleteRecord={() => deleteRecord(record._id)} // You need to define deleteRecord function
              key={record._id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
  // This method will delete a record
  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:5000/record/${id}`, {
        method: "DELETE"
      });
      const newRecords = records.filter((el) => el._id !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error("Error deleting record:", error);
      // Handle the error appropriately, e.g., show a message to the user
    }
 }
  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={() => deleteRecord(record._id)}
        key={record._id}
      />
    ));
  }
  // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3>Record List</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Name</th>
           <th>Position</th>
           <th>Level</th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
   </div>
 );
}