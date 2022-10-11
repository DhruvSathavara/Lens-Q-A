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
import { createPost } from "../../LensProtocol/post/create-post";

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

const ColorButton = styled(Button)(({ theme }) => ({
    color: 'white',
    background: 'linear-gradient(to right top, #ff0f7b, #ff3d61, #ff6049, #ff7f36, #f89b29);',
    '&:hover': {
        background: 'linear-gradient(to left top, #ff0f7b, #ff3d61, #ff6049, #ff7f36, #f89b29);',
    },
}));


export default function QuestionModal() {
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, loginCreate, disconnectWallet, update, setUpdate, userAdd } = lensAuthContext;

    const [open, setOpen] = React.useState(false);
    const [file, setFile] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    const [title, setTitle] = useState("");
    const [questionBody, setQuestionBody] = useState("");
    // const [tags, setTags] = useState([]);
    const [isLoading, setLoading] = useState(false);
    let navigate = useNavigate();
    var forbiddenCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,`<>/?]+/;


    // const addTags = event => {
    //     if (event.key === "Enter" && event.target.value !== "") {
    //         setTags([...tags, event.target.value]);
    //         event.target.value = "";
    //     }
    // };

    // const removeTags = index => {
    //     setTags([...tags.filter(tag => tags.indexOf(tag) !== index)]);
    // };



    const handleSubmit = async () => {
        if (title == "" && questionBody == "") {
            toast.warning("Title And Body is Required!");
            return false;
        }
        await login();
        try {
            setLoading(true);
            const postData = {
                title: title,
                photo: null,
                body: questionBody,
                // tags: tags,
                login: login,
                name: profile.handle
            }
            const res = await createPost(postData);
            console.log(res, "res");
            if (res) {
                setUpdate(!update);
                setFile("");
                // setTags([]);
                setTitle("");
                setLoading(false);
                toast.success("Post is Successfully created!");
                setOpen(false);
            }
        } catch (error) {
            toast.error(error);
            setLoading(false);
        }

    }



    return (
        <div>
            <Button onClick={handleClickOpen} variant='contained'>Ask Questions</Button>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Ask question</DialogTitle>
                <DialogContent>
                    <TextField maxRows={5} onChange={(e) => setTitle(e.target.value)} className='my-2' id="outlined-basic" label="Title" variant="outlined" fullWidth placeholder='Title' />
                    <TextareaAutosize
                        onChange={(e) => setQuestionBody(e.target.value)}
                        aria-label="minimum height"
                        minRows={4}
                        placeholder="Questions"
                        style={{ width: '100%', padding: '10px' }}
                    />
                    {/* <TextField onKeyUp={event => addTags(event)} className='my-2' id="outlined-basic" label="Tags" variant="outlined" fullWidth placeholder='#React #javascript #java' /> */}

                    {/* <Stack direction="row" spacing={1}>
                        {tags.map((tag, index) => (
                            <Chip label={`#${tag}`}
                                onClick={() => removeTags(index)}
                                variant="outlined"
                            />

                        ))}
                    </Stack> */}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>{isLoading ? "Loading..." : "Post Your Question"}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}