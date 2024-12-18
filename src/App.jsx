import axios, { Axios } from "axios";
import { useState , useEffect } from "react";

function App() {
  const [Users , setUsers] = useState([]);
  const [filterusers , setFilterusers] = useState([]);
  const [userData, setUserData] = useState({name:"",age:"",city:"",});
  const [IsModelOpen , setIsModelOpen] = useState(false);

  const getAllusers = async () => {
    try {
        const res = await axios.get("http://localhost:3500/get");
        console.log(res.data);
        setUsers(res.data.students);
        setFilterusers(res.data.students);
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
};


  useEffect(()=>{
    getAllusers();
  },[]);

  //search function

  const handleSearch = (e) =>{
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = Users.filter((user) =>user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText));
    setFilterusers(filteredUsers);       
  }

  //delete function

  const handleDelete = async (id) => {
    try {
        const res = await axios.delete(`http://localhost:3500/get/${id}`);
        console.log("Deleted successfully:", res.data);
        // Ensure response contains updated list of students
        setUsers(res.data.students);
        setFilterusers(res.data.students);
    } catch (error) {
        console.error("Error deleting user:", error.message);
    }
};



//close model

const closeModel =()=>{
  setIsModelOpen(false);
  getAllusers();
};
// add user row
const handleAdd = () => {
  setUserData({ name: "", age: "", city: "" });
  setIsModelOpen(true);
};


  //handlesubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3500/get", userData)
        .then((res) => { console.log(res); });
    closeModel();
};


//handle data

const handleData = (e) => {
  setUserData({ ...userData, [e.target.name]: e.target.value });
};

//handle edit function

const handleEdit = (user) =>{
  setUserData(user)
  setIsModelOpen(true)  
}
  return (
    <div className="App">
      <h1 className="text-primary text-center">CRUD app using react and node</h1>
      <div>
      <input type="search" placeholder="Search students" onChange={handleSearch}/>
        <button onClick={handleAdd}  className="btn btn-success">Add Rows</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
         {filterusers && filterusers.map((Us, index) => {
          return(
  <tr key={Us.id}>
    <td>{index + 1}</td>
    <td>{Us.name}</td>
    <td>{Us.age}</td>
    <td>{Us.city}</td>
    <td>
      <button onClick={()=>handleEdit(Us)} className="btn btn-success">Edit</button>
    </td>
    <td>
      <button onClick={()=>handleDelete(Us.id)} className="btn btn-danger">Delete</button>
    </td>
  </tr>
          );
        })}

            
          </tbody>
       
      </table>
      {IsModelOpen &&( <div className="d-block fixed container border rounded border-dark h-25 w-25">
        <div className="p-2">
          <span className="btn-close cursor-pointer float-end" onClick={closeModel}>&times;</span>
          <h2>User Record</h2> <br />
          <div className="">
            <label htmlFor="name">Full name</label>
            <input type="text" onChange={handleData} value={userData.name} name="name" id="name" />
          </div><br />
          <div className="">
            <label htmlFor="age">Age</label>
            <input type="number" onChange={handleData} value={userData.age} name="age" id="age" />
          </div> <br />
          <div className="">
            <label htmlFor="city">City</label>
            <input type="text" onChange={handleData} value={userData.city} name="city" id="city" />
          </div><br />
          <button onClick={handleSubmit} className="btn btn-success">Add User</button>
        </div>
        </div>
      )}
    </div>
);
}

export default App;
