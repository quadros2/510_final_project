import styles from './landing.module.scss';
import React, {useState} from "react";

function Landing() {

  const [summarySelected, setSummarySelected] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);

  function submitChanged() {
    if (!submitClicked) {
      setSubmitClicked(true);

      let queryData = JSON.parse(textInput);
      let linkDataArray = queryData.pageProps.data.search_results_page;
      let linkArray = linkDataArray.map((obj) => (obj.orig_url));
      console.log(linkArray);
      // Do axios request
      //setTextInput(Axios response here)
      //setSubmitClicked(false);
    }
  }

  return (
    <>
      <div className={styles.MainHolder}>
        <div className={styles.CenterHolder}>
          <TypeSelection summarySelected={summarySelected} setSummarySelected={setSummarySelected}/>
          <TextInput textInput={textInput} setTextInput={setTextInput}/>
          <div className={`${styles.Button} ${textInput !== "" && !submitClicked ? styles.Selectable : ""}`}  onClick={submitChanged}> Submit </div>

        </div>
      </div>

      <div className={styles.background}/>
    </>
  );
}


function TypeSelection(props) {

  const [summarySelected, setSummarySelected] = useState(props.summarySelected);

  function buttonClicked(isSelected) {
    setSummarySelected(isSelected);
    props.setSummarySelected(isSelected);
  }

  return (
    <div className={styles.TypeSelection}>
      <div className={`${styles.TypeButton} ${summarySelected ? styles.Selected : ""}`}  onClick={() => buttonClicked(true)}> Summarize </div>
      <div className={`${styles.TypeButton} ${!summarySelected ? styles.Selected : ""}`} onClick={() =>  buttonClicked(false)}> Study Guide </div>
    </div>
  );
}

function TextInput(props) {

  function textChanged(e) {
    props.setTextInput(e.target.value)
  }
  
  return (
    <div className={styles.TextInput}>
      <div className={styles.Instructions}>Paste CDL Search Response Here</div>
      <textarea className={styles.TextArea} value={props.textInput} onChange={textChanged}/> 
    </div>


  );
}

export default Landing;


