
import React, { useState, createContext, useEffect } from "react";
import axios from 'axios'
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min";
import "react-toastify/dist/ReactToastify.css";


export const BookContext = createContext();
export const BookContextProvider = (props) => {
    const [pdf, setPdf] = useState('');
    const [accounts, setAccount] = useState('');
    const [address, setAddress] = useState('');

    const { Moralis, user, account, authenticate, isAuthenticated, isInitialized, logout } = useMoralis();
    const [NewData, setData] = useState([]);
    const API_Token = process.env.REACT_APP_WEB3STORAGE_TOKEN;
    const client = new Web3Storage({ token: API_Token })
    const Storypad = Moralis.Object.extend("StoryPadBuildit");
    const StoryPad = new Storypad();






    useEffect(() => {
        if (isAuthenticated) {
            setAccount(account);
        }
        // checkIfWalletIsConnected();
    }, [isAuthenticated, account]);




    const disconnect = async () => {
        if (isAuthenticated) {
            await logout();
            window.localStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");
            window.localStorage.removeItem("profileId");
        }
    }

    const login = async () => {
        if (!isAuthenticated) {
            await authenticate({
                provider: "web3Auth",
                chainId: Moralis.Chains.POLYGON_MUMBAI,
                clientId: "BHQlt53J8Q_CprFI9tgx5aRB7pE9Ei0ccchzXQBNIYAI4RwdZ84Y2sVGoezEZ3S_kwwt3MuZ2eZIGoTYET--4I0",

            })
                .then(function (user) {
                    let address = user.get("ethAddress")
                    localStorage.setItem("currentUserAddress", address)
                })

                .catch(function (error) {
                });
        }
    }


    return (
        <BookContext.Provider
            value={{
                login,
                disconnect, 
            }}
        >
            {props.children}
        </BookContext.Provider>
    );
}