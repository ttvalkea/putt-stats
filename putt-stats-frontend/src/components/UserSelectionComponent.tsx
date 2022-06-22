import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUsers } from "../database";
import { setUsers } from "../store/userSlice";
import { getUserIdFromLocalStorage } from "../utilities";

function UserSelectionComponent() {
  const users = useSelector((state: any) => state.users.users);
  const dispatch = useDispatch();

  useEffect(() => {
    // When the app is opened, fetch the users and store them into the store.
    if (!users || users.length === 0) {
      const fetchData = async () => {
        const users = await getUsers();
        if (!users) {
          toast.error("An error occured trying to get users.");
        } else {
          dispatch(setUsers(users));
        }
      };

      fetchData();
    }
  }, [dispatch, users]);

  const [selectedUser, setSelectedUser] = useState(
    getUserIdFromLocalStorage() ?? 1
  );

  const handleUserChange = (event: any) => {
    const value: number = parseInt(event.target.value);
    // Put the selected value into localstorage for a better (persistent) user experience between opening and closing the app
    localStorage.setItem("userId", value.toString());
    setSelectedUser(value);
  };

  const userSelectionElements: any[] = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    userSelectionElements.push(
      <div
        style={{ paddingLeft: 10 }}
        key={`userRadioButtonContainer${user.userId}`}
      >
        <input
          type="radio"
          id={`userRadioButton${user.userId}`}
          value={user.userId}
          checked={selectedUser === user.userId}
          onChange={handleUserChange}
        />
        <label htmlFor={`userRadioButton${user.userId}`}>{user.name}</label>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      Selected user:
      {userSelectionElements}
    </div>
  );
}

export default UserSelectionComponent;
