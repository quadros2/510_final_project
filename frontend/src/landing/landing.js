import styles from './landing.module.scss';
import React, {useState, useEffect} from "react";
import axios from 'axios';

function Landing() {

  const [summarySelected, setSummarySelected] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSubmitClicked(false);
    setLoading(false);
    setTextInput('');
  }, [summarySelected])

  function submitChanged() {
    if (!submitClicked) {
      let queryData;
      try {
       queryData = JSON.parse(textInput);
      } catch {
        return;
      }

      let linkDataArray = queryData.pageProps.data.search_results_page;
      let linkArray = linkDataArray.map((obj) => (obj.orig_url));
      let endpoint = "http://127.0.0.1:5000" + (summarySelected ? "/summarize" : "/make_study_guide")
      console.log(endpoint)
      // Do axios request

      setSubmitClicked(true);
      setLoading(true);
      setTextInput('');

      axios.post(endpoint, {
          websites: linkArray
        })
        .then(function (response) {
          console.log(response);
          setTextInput(response.data[summarySelected ? 'summaries' : 'study_guides']);
        }).catch(function (error) {
          console.log(error);
        }).finally(function () {
          setLoading(false);
        });
      //setTextInput(Axios response here)
      //setSubmitClicked(false);
    }
  }

  return (
    <>
      <div className={styles.MainHolder}>
        <div className={styles.CenterHolder}>
          <TypeSelection summarySelected={summarySelected} setSummarySelected={setSummarySelected}/>
          <TextInput textInput={textInput} setTextInput={setTextInput} loading={loading}/>
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
      {props.loading ? <Spinner/> : null}
    </div>


  );
}

function Spinner() {
  return <div className={styles.Spinner}>
    <div/><div/><div/>
  </div>
}

export default Landing;


