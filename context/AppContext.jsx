"use client";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUserAuthStatus = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/auth/users/isAuthenticated`,
        { withCredentials: true }
      );
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      }
    } catch (error) {
      toast(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/auth/users/getUserData`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getUserAuthStatus();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner variant="circle-filled" />
        </div>
      ) : (
        props.children
      )}
    </AppContext.Provider>
  );
};
