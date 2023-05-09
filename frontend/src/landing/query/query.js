import styles from './query.module.scss';
import React, {useState, useEffect} from "react";
import axios from 'axios';
import Spinner from '../spinner/spinner';

function Query(props) {

  const [query, setQuery] = useState("");
  const [userCommunities, setUserCommunities] = useState([]);
  const [community, setCommunity] = useState("all");

  const [canSubmit, setCanSubmit] = useState(true);
  const [isError, setIsError] = useState(false);


  async function getSearchResults(query) {
    return axios.post('http://127.0.0.1:5000/cdl_proxy', {
      query: encodeURIComponent(query),
      token: props.cdlToken,
      community: community
    })
      .then(res => {
        let queryData = res.data;
        let linkDataArray = queryData.search_results_page;
        let linkArray = linkDataArray.map((obj) => (obj.orig_url));
        return linkArray;
      })
      .catch(() => []);
  }

  async function searchClicked() {
    if (query !== "" && canSubmit && props.currentPos === 0) {
      setCanSubmit(false);
      setIsError(false)
      props.bottomBar(false);
      let linkArray = await getSearchResults(query);
      if (linkArray.length === 0) {
        setIsError(true)
        setCanSubmit(true);
        props.bottomBar(true);
      } else {
        props.finished(linkArray)
        setCanSubmit(true);
        props.bottomBar(true);
        setQuery("");
      }
    }
  }



  useEffect(() => {
    async function getComms() {
      const comms = await axios.get("https://textdata.org/api/getCommunities", {
        headers:{
          authorization: props.cdlToken,
        }
      })
        .then(res => res.data.community_info)
        .catch(() => []);
      setUserCommunities(comms);
    }
    getComms();

  }, [props.cdlToken]); 

  function communityChoices() {
    
    let options = []
    for (let i = 0; i < userCommunities.length; i++) {
      options.push(<option key={userCommunities[i].community_id} value={userCommunities[i].community_id}>{userCommunities[i].name}</option>)
    }
    return options
  }

  return(
    <div className={`${styles.QueryHolder} ${props.currentPos === 0 ? styles.Center : ""} ${props.currentPos === -1 ? styles.Left : ""}`}>
      
      <div style={{display: "flex", alignItems: "center", flexDirection: "column", gap: "5px"}}>
        <p className={styles.Title}>Search</p>
        <p>What are you looking for?</p>
        <p style={{color: "red", textAlign: "center", display: (isError ? "block" : "none")}}>Whoops, That Didn’t Work! Please Try Again.</p>
      </div>

      <div className={styles.FieldHolder}>
        <div>
          <p>&nbsp;Search Query</p>
          <div className={styles.SearchHolder}>
            <input type="text" onKeyDown={(e) => {if (e.key === 'Enter') searchClicked()}} className={styles.FormField} placeholder="Search Your Communities" value={query} onChange={(e) => setQuery(e.target.value)}/>
            <select className={styles.Dropdown} value={community} onChange={(e) => setCommunity(e.target.value)}>
              <option value="all">All</option>
              {communityChoices()}
            </select>
          </div>
        </div>

      </div>

      <div className={`${styles.Submit} ${(query !== "" && canSubmit && props.currentPos === 0) ? styles.Selectable : ""}`} onClick={searchClicked}>
        {!canSubmit ? <Spinner/> : "Search"}
      </div>


    </div>
  );


}

export default Query;