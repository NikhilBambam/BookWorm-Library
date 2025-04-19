// import React from "react";
// import { useSelector } from "react-redux";
// import Header from "../layout/Header";

// const Users = () => {
//   const {} = useSelector((state) => state.user);

//   const formatData =(timeStamp)=>{
//     const date=new Date(timeStamp);
//     const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
//     const formattedTime=`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
//     const result = `${formattedDate} ${formattedTime}`;
//     return result;
//   };


//   return <>
  

  
//   <main className="relative flex-1 p-6 pt-28">
//   <Header/>
//   <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
//     <h2 className="text-xl font-medium md:text:2xl md:font-semibold">Registered Users </h2>
//   </header>


//  {/* Table */}
//   {
//     Users && Users.filter(u=>u.role === "User".length > 0 ? (
//       <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
//         <table className="min-h-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2 text-left">ID</th>
//             </tr>
//           </thead>
//         </table>
//       </div>
//     ):"")
//   }

//   </main>
  
//   </>;
// };

// export default Users;


import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users, loading, error } = useSelector((state) => state.user);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Users
          </h2>
        </header>

        {/* Loading/Error States */}
        {loading && <p className="mt-4 text-blue-500">Loading users...</p>}
        {error && <p className="mt-4 text-red-500">Error: {error}</p>}

        {/* User Table */}
        {users && users.filter(u => u.role === "User").length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="w-full border-collapse">
               
            <thead>
               <tr className="bg-gray-200 text-left">
               <th className="px-4 py-2 text-left">ID</th>
               <th className="px-4 py-2 text-left">Name</th>
               <th className="px-4 py-2 text-center">Email</th>
               <th className="px-4 py-2 text-left">Role</th>
               <th className="px-4 py-2 text-center">No of Books Borrowed</th>
               <th className="px-4 py-2 text-center">Registered On</th>
             </tr>
            </thead>
              <tbody>
                {users
                  .filter((user) => user.role === "User")
                  .map((user,index) => (
                    <tr key={user._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{index+1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{user?.borrowedBooks.length}</td>
                      <td className="px-4 py-2">{formatDateTime(user.createdAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="mt-6 text-gray-500">No registered users found.</p>
        )}
      </main>
    </>
  );
};

export default Users;
