import styles from './query.module.scss';
import React, {useState} from "react";
import axios from 'axios';
import Spinner from '../spinner/spinner';

function Query(props) {

  const [query, setQuery] = useState("");

  const [canSubmit, setCanSubmit] = useState(true);
  const [isError, setIsError] = useState(false);


  async function getSearchResults(query) {
    return axios.post('http://127.0.0.1:5000/cdl_proxy', {
      query: encodeURIComponent(query),
      token: props.cdlToken
    })
      .then(res => {
        let queryData = res.data;
        let linkDataArray = queryData.pageProps.data.search_results_page;
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
          <input type="text" onKeyDown={(e) => {if (e.key === 'Enter') searchClicked()}} className={styles.FormField} placeholder="Search Your Communities" value={query} onChange={(e) => setQuery(e.target.value)}/>
        </div>

      </div>

      <div className={`${styles.Submit} ${(query !== "" && canSubmit && props.currentPos === 0) ? styles.Selectable : ""}`} onClick={searchClicked}>
        {!canSubmit ? <Spinner/> : "Search"}
      </div>


    </div>
  );


}

export default Query;