import styles from './options.module.scss';
import React, {useState} from "react";
import axios from 'axios';
import Spinner from '../spinner/spinner';

function Options(props) {


  const [summarySelected, setSummarySelected] = useState(true);

  const [canSelect, setCanSelect] = useState(true);
  const [isError, setIsError] = useState(false);



  async function optionClicked(isSummary) {

    if (canSelect && props.currentPos === 0) {
      setSummarySelected(isSummary)
      setCanSelect(false);
      setIsError(false);
      props.bottomBar(false);

      let endpoint = "http://127.0.0.1:5000" + (isSummary ? "/summarize" : "/make_study_guide")
      
      axios.post(endpoint, {
        websites: props.linkArray
      })
      .then(function (response) {
        props.finished(response.data[isSummary ? 'summaries' : 'study_guides'])
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

        <div className={`${styles.Option} ${(canSelect && props.currentPos === 0) ? styles.Selectable : ""}`} onClick={() => optionClicked(true)}>
          {!canSelect && summarySelected ? <Spinner/> : "Summarize"}
        </div>

        <div className={`${styles.Option} ${(canSelect && props.currentPos === 0) ? styles.Selectable : ""}`} onClick={() => optionClicked(false)}>
          {!canSelect && !summarySelected ? <Spinner/> : "Study Guide"}
        </div>

      </div>


    </div>
  );


}

export default Options;