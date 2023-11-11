import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import './home.css'
import { baseURL } from '../../core.mjs';
import { Arrow90degRight, Chat, Heart } from "react-bootstrap-icons";

const Home = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [toggleRefresh, setToggleRefresh] = useState(false);

    const getAllPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/feeds`, {
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

    return (<div>
        <div id="postTop">
            <span>{isLoading && <div id="loader"><div className="loading-container"><div className="loading-text"><span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span></div></div></div>}</span>
            {allPosts.map((post, index) => (
                <div key={post._id} className="post-container" >
                    <div>
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
                </div>
            ))}
            <br />
        </div>
    </div>
    );

}

export default Home;