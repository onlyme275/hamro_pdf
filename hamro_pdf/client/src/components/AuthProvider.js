import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "../store/slices/userSlice";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Use the proper initializeAuth action that sets the initialized flag
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
}
