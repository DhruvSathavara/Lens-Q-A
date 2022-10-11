import { useNavigate } from "react-router-dom";
import createProfile from "../../LensProtocol/profile/Create_Profile";
import React, { useState } from "react";
import { Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { profile } from "../../LensProtocol/profile/get-profile";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import { LensAuthContext } from "../../Context/LensContext";
import { toast } from "react-toastify";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { createComment } from "../../LensProtocol/post/comments/create-comment";

const auth =
    "Basic " +
    Buffer.from(
        process.env.REACT_APP_INFURA_PID + ":" + process.env.REACT_APP_INFURA_SECRET
    ).toString("base64");

const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});



export default function AnswerModal(props) {
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, loginCreate, disconnectWallet, update, setUpdate, userAdd } = lensAuthContext;

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const [title, setTitle] = useState("");
    const [isLoading, setLoading] = useState(false);
    let navigate = useNavigate();

    const handleComment = async (data) => {
        await login();
        try {
            const id = window.localStorage.getItem("profileId");
            setLoading(true);
            const obj = {
                address: userAdd,
                comment: title,
                login: loginCreate,
                profileId: id,
                publishId: props.id,
                user: profile.handle
            }
            const result = await createComment(obj);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error, "errr-----")
        }
    }

    return (
        <div>
            <Button onClick={handleClickOpen} variant='contained'>Post Answer</Button>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Post Answer</DialogTitle>
                <DialogContent>
                    <TextareaAutosize
                        onChange={(e) => setTitle(e.target.value)}
                        aria-label="minimum height"
                        minRows={4}
                        placeholder="Write Answer"
                        style={{ width: '100%', padding: '10px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleComment}>{isLoading ? "Loading..." : "Post Your Answer"}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}