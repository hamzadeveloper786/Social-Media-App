import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/context.mjs";
import axios from "axios";
import moment from "moment";
import { BoxArrowLeft, Trash, PencilSquare, Arrow90degRight, Chat, Heart} from "react-bootstrap-icons";
import { baseURL } from '../../core.mjs';
import './profile.css'

const Profile = () =>{
    let {state, dispatch} = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [toggleRefresh, setToggleRefresh] = useState(false);

    const getAllPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/user/posts`, {
                withCredentials: true
            });
            console.log(response.data);
            setIsLoading(false);
            setAllPosts(response.data);
        } catch (e) {
            console.log(e.data);
            setIsLoading(false);
        }
        return () => {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getAllPosts();
        return () => { }
    }
        , [toggleRefresh]);

    const logoutHandler = async () =>{
        try{
            await axios.post(`${baseURL}/api/v1/logout` , {} , {
                withCredentials: true
            });
            dispatch({
                type: "USER_LOGOUT",
            });
        }catch(e){
            console.log(e);
        }
    }
    const deletePostHandler = async (_id) => {
        try {
            setIsLoading(true);
            const response = await axios.delete(`${baseURL}/api/v1/post/${_id}`);

            setIsLoading(false);
            console.log(response.data);
            setToggleRefresh(!toggleRefresh);
        } catch (error) {
            // handle error
            console.log(error?.data);
            setIsLoading(false);
        }
    };

    const editPost = async (e) => {
        e.preventDefault();
        const _id = e.target.children[0].value;
        const title = e.target.children[1].value;
        const text = e.target.children[2].value;
        try {
            setIsLoading(true);
            const response = await axios.put(`${baseURL}/api/v1/post/${_id}`, {
                title: title,
                text: text
            });

            setIsLoading(false);
            console.log(response.data);
            setToggleRefresh(!toggleRefresh);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            return;

        }
    }

    return(
       <div id="top">
        <div className="info">
            <h3>{(state.user.firstName)} {(state.user.lastName)}</h3>
        </div>
        <div className="dropdown" id="dropDown">
            <button className="drop-down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <p id="p" className="bi bi-three-dots-vertical dots"></p>
            </button>
            <ul className="dropdown-menu">
                <li className="list"><button onClick={logoutHandler}><BoxArrowLeft/> LOGOUT</button></li>
            </ul>
        </div>
        {allPosts.map((post, index) => (
                <div key={post._id} className="post-container" >
                     {(post.isEdit) ?
                        <form id="editForm" onSubmit={editPost}>
                            <input type="text" disabled hidden value={post._id} />
                            <input type="text" defaultValue={post.title} />
                            <textarea defaultValue={post.text} cols="30" rows="4"></textarea>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => {
                                post.isEdit = false;
                                setAllPosts([...allPosts]);
                            }} >Cancel</button>
                            <span>{isLoading && <div className="spinner-container"><div className="loading-spinner"></div></div>}</span>
                        </form> :
                        <div>
                            <div className="dropdown" id="dropDown">
    <button className="drop-down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <p className="bi bi-three-dots-vertical dots"></p>
    </button>
    <ul className="dropdown-menu">
        <li className="list"><button type="button" onClick={() => {
            post.isEdit = true;
            setAllPosts([...allPosts]);
        }}><PencilSquare /> Edit</button></li>
        <li className="list"><button type="button" onClick={(e) => {
            deletePostHandler(post._id);
        }}><Trash /> Delete</button></li>
    </ul>
</div>
                        <div id="postN">
                            <div id="profilePic"></div>
                            <div id="postPre">
                                <h2>{post.author}</h2>
                                <span id="time">{moment(post.createdAt).fromNow()}</span>
                                <h4>{post.title}</h4>
                                <p>{post.text}</p>
                            </div>
                    </div>
                    <div className="postFooter">
                        <div className="button"><Chat /></div>
                        <div className="button"><Arrow90degRight /></div>
                        <div className="button"><Heart /></div>
                    </div>
                    </div>
                    }
       </div>))}
       </div>
    )
}

export default Profile;