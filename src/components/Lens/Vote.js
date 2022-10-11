import React, { useEffect, useState } from 'react'
import { db } from '../../firebase/firebase';
import { addDoc, collection, doc, getDocs, query, runTransaction, setDoc, where, writeBatch, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Avatar, Box, Divider } from '@mui/material';

function Vote(props) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        getLikeUp();
    }, [props.data.id, props.update])

    async function getLikeUp() {
        // const id = detail == undefined ? data.id && data.id : detail.id;
        const cId = props.data.id;
        const q = query(collection(db, "Votes"), where("publicationId", "==", cId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            setCount(0);
        }
        querySnapshot.forEach((data) => {
            setCount(data.data().vote);
        })
    }
    return (
        <div className='p-3'>
            <p >{props.data.comment}</p>

            <div className='d-flex justify-content-between'>
                <div className='d-flex '>
                    <p style={{ margin: '0 5px', cursor: 'pointer' }}
                        onClick={() => props.add(props.data.id)} className='m-2'>{count} Votes</p>
                </div>
                <div className='p-3 text-left '  >
                    <div style={{ cursor: 'pointer' }} className="d-flex">
                        <Avatar alt="" src={props.data?.avtar != null ? props.data.avatar : "https://www.pinpng.com/pngs/m/615-6154495_avatar-png-icon-business-woman-icon-vector-transparent.png"} />

                        <Box sx={{ display: { xs: 'flex', md: 'flex' }, justifyContent: 'flex-end' }}>
                            <p className=" text-secondary" style={{ padding: '7px 15px' }}>
                                {props.data?.name}
                            </p>
                        </Box>
                    </div>
                </div>
            </div>
            <Divider component="li" style={{ listStyle: 'none' }} />
        </div>
    )
}

export default Vote