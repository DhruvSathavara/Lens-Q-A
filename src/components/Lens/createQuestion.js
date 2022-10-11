
import { Avatar, Button, CircularProgress } from '@mui/material'
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getPublicationByLatest } from '../../LensProtocol/post/explore/explore-publications';
import QuestionModal from './QuestionModal';
import { addDoc, collection, doc, getDocs, query, runTransaction, setDoc, where, writeBatch, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../../firebase/firebase';

const category = ["reactjs", "javascript", "typescript"]


function CreateQuestion() {
    const navigate = useNavigate();
    const [post, setPost] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        getPosts();
        // getLikeUp();
    }, [])

    async function getPosts() {
        const res = await getPublicationByLatest();
        setPost(res.data.explorePublications.items)
    }

    const handleNavigate = (path) => {
        navigate(`/questionDetail/${path}`)
    }

    async function getLikeUp(id) {
        const q = query(collection(db, "Votes"), where("publicationId", "==", id));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            setCount(0);
        }
        querySnapshot.forEach((data) => {
            setCount(data.data().vote);
        })
    }


    return (
        <div className='container footer-position ' style={{ marginTop: '8%' }}>
            <div className='row'>
                <div className='col-12'>
                    <div className='d-flex justify-content-between'>
                        <h3>All Questions</h3>
                        <QuestionModal />
                    </div>
                    <Divider component="li" style={{ listStyle: 'none', margin: '10px' }} />
                </div>
                <div className='col-12 mt-5'>
                    {
                        post == undefined && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    }
                    {
                        post?.length == 0 && <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                            <h4>No Questions Available!</h4>
                        </Box>
                    }
                    {
                        post && post.map((e) => {
                            // getLikeUp(e.id)
                            return (
                                <div className='p-3 text-left ' key={e.id}>
                                    <h3 onClick={() => handleNavigate(e.id)} className='text-primary' style={{ cursor: 'pointer' }}>{e?.metadata?.content}</h3>
                                    <p>{e?.metadata?.description}</p>
                                    {/* <div className='d-flex justify-content-start'>

                                        {
                                            category.map((e) => {
                                                return (
                                                    <Button className='m-2 '>{e}</Button>
                                                )
                                            })
                                        }
                                    </div> */}
                                    <div className='d-flex justify-content-between'>
                                        <div className='d-flex '>
                                            {/* <p className='m-2'>Votes {count}</p> */}
                                            {/* <Likes data={e} /> */}
                                            <p className='m-2'>Answers ({e?.stats?.totalAmountOfComments})</p>
                                        </div>
                                        <div style={{ cursor: 'pointer' }} className="d-flex">
                                            <Avatar alt="" src={e.profile.picture != null ? e?.profile?.picture?.original?.url : "https://www.pinpng.com/pngs/m/615-6154495_avatar-png-icon-business-woman-icon-vector-transparent.png"} />

                                            <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                                                <p className=" text-secondary" style={{ padding: '7px 15px' }}>
                                                    {e.profile.handle}
                                                </p>
                                            </Box>
                                        </div>
                                    </div>
                                    <Divider component="li" style={{ listStyle: 'none' }} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateQuestion