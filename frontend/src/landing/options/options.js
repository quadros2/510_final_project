import styles from './options.module.scss';
import React, {useState} from "react";
import axios from 'axios';
import Spinner from '../spinner/spinner';

function Options(props) {

  // -1 = Custom, 0 = Summary, 1 = Study Guide 
  const [optionSelected, setOptionSelected] = useState(0);
  const [query, setQuery] = useState("");

  const [canSelect, setCanSelect] = useState(true);
  const [isError, setIsError] = useState(false);



  async function optionClicked(optionClicked) {

    if (canSelect && props.currentPos === 0) {
      setOptionSelected(optionClicked)
      setCanSelect(false);
      setIsError(false);
      props.bottomBar(false);

      let ending = "/general_prompt"
      let responseType = "general_answer"
      switch (optionClicked){
        case 0:
          ending = "/summarize"
          responseType = "summaries"
          break;
        case 1:
          ending = "/make_study_guide"
          responseType = "study_guides"
          break;
      }

      let endpoint = "http://127.0.0.1:5000" + (ending)
      
      axios.post(endpoint, {
        websites: props.linkArray,
        prompt: query
      })
      .then(function (response) {
        props.finished(response.data[responseType])        
        setQuery("");
        setCanSelect(true);
        props.bottomBar(true);
      }).catch(function () {
        setIsError(true)
        setCanSelect(true);
        props.bottomBar(true);
      })

    }

  }

  

  return(
    <div className={`${styles.OptionsHolder} ${props.currentPos === 0 ? styles.Center : ""} ${props.currentPos === -1 ? styles.Left : ""}`}>
      
      <div style={{display: "flex", alignItems: "center", flexDirection: "column", gap: "5px"}}>
        <p className={styles.Title}>ChatGPT</p>
        <p>What would you like ChatGPT to do?</p>
        <p style={{color: "red", textAlign: "center", display: (isError ? "block" : "none")}}>Whoops, That Didn’t Work! Please Try Again.</p>
      </div>


      <div className={styles.OptionButtonHolder}>

        <div className={`${styles.Option} ${(canSelect && props.currentPos === 0) ? styles.Selectable : ""}`} onClick={() => optionClicked(0)}>
          {!canSelect && optionSelected === 0 ? <Spinner/> : "Summarize"}
        </div>

        <div className={`${styles.Option} ${(canSelect && props.currentPos === 0) ? styles.Selectable : ""}`} onClick={() => optionClicked(1)}>
          {!canSelect && optionSelected === 1 ? <Spinner/> : "Study Guide"}
        </div>

      </div>

      <div className={styles.Break}>
        <p className={styles.MiddleText}>Or</p>
        <div className={styles.Line}></div>
      </div>

      <div className={styles.FieldHolder}>
        <input type="text" onKeyDown={(e) => {if (e.key === 'Enter') optionClicked(-1)}} className={styles.FormField} placeholder="Custom Request" value={query} onChange={(e) => setQuery(e.target.value)}/>
        <div className={`${styles.Option} ${(canSelect && props.currentPos === 0) ? styles.Selectable : ""}`} onClick={() => optionClicked(-1)}>
          {!canSelect && optionSelected === -1 ? <Spinner/> : "Ask ChatGPT"}
        </div>
      </div>



    </div>
  );


}

export default Options;