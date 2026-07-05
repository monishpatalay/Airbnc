import axios from 'axios';
import { createContext, useEffect, useRef, useState } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const setExternally = useRef(false);

  function updateUser(data) {
    setExternally.current = true;
    setUser(data);
  }

  useEffect(() => {
    axios
      .get('/profile')
      .then(({ data }) => {
        if (!setExternally.current) setUser(data);
      })
      .catch(() => {
        if (!setExternally.current) setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
