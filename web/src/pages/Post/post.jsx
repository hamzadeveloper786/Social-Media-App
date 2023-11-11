import { useRef, useState } from "react";
import axios from "axios";
import './post.css';
import { baseURL } from "../../core.mjs";

const Post = () =>{

    const postTitleInputRef = useRef(null);
    const postBodyInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlert, setIsAlert] = useState(null);

    const submitHandler = async (e)=>{
        e.preventDefault();
        try{
        setIsLoading(true);

        const response = await axios.post(`${baseURL}/api/v1/post`, {
            title: postTitleInputRef.current.value,
            text: postBodyInputRef.current.value
        },{
            withCredentials:true
        })
        setIsLoading(false)
        console.log(response.data);
        setIsAlert(response.data.message);
    }
        catch(e){
            console.log(e);
            setIsLoading(false)
            return;
        }
    }

    return(<div>
        <fieldset id="post">
        <legend>Create a Post</legend>
        <form onSubmit={submitHandler}>
            <label htmlFor="postTitleInput">Title</label>
            <input type="text" placeholder="Enter Your Title" id="postTitleInput" required minLength={2} maxLength={50} ref={postTitleInputRef}/>
            <br />
            <label htmlFor="postBodyInput">Text</label>
            <textarea id="postBodyInput" required minLength={10} maxLength={999} cols="30" rows="4" placeholder="Write Something in your Mind...." ref={postBodyInputRef}></textarea>
            <br />
            <button type="submit">Publish Post</button>
        </form>
      </fieldset>
      <div className="loader">
      {isAlert && <p className="alert">{isAlert}</p>}
      <br />
      {isLoading ? <div className="spinner-container"><div className="loading-spinner"></div></div> : null}
      </div>
    </div>
    )
};
export default Post;