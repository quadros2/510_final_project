import styles from './landing.module.scss';
import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';

function Landing() {
  
  const [summarySelected, setSummarySelected] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const tokenRef = useRef('');

  useEffect(() => {
    setSubmitClicked(false);
    setLoading(false);
    setTextInput('');
    setResponseText('');
  }, [summarySelected]);

  function getToken() {
    return axios.post("https://textdata.org/api/login", { 
      username: process.env.REACT_APP_USERNAME || prompt('Please enter your CDL username'),
      password: process.env.REACT_APP_PASSWORD || prompt('Please enter your CDL password')
    })
      .then(res => res.data.token)
      .catch(() => '')
  }
  
  async function getSearchResults(query) {
    if (!tokenRef.current) {
      tokenRef.current = await getToken();
    }
    return axios.post('http://127.0.0.1:5000/cdl_proxy', {
      query,
      token: tokenRef.current
    })
      .then(res => {
        let queryData = res.data;
        let linkDataArray = queryData.pageProps.data.search_results_page;
        let linkArray = linkDataArray.map((obj) => (obj.orig_url));
        return linkArray;
      })
      .catch(() => []);
  }

  async function submitChanged() {
    if (!submitClicked) {
      let linkArray = await getSearchResults(textInput);
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
          setResponseText(response.data[summarySelected ? 'summaries' : 'study_guides']);
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
          {responseText
            ? <Result text={responseText}/>
            : <TextInput textInput={textInput} setTextInput={setTextInput} loading={loading}/>}
          <div className={`${styles.Button} ${textInput !== "" && !submitClicked ? styles.Selectable : ""}`}  onClick={submitChanged}> Submit </div>
          {loading ? <Spinner/> : null}
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
      <div className={styles.Instructions}>Enter Your Query Here</div>
      <textarea className={styles.TextArea} value={props.textInput} onChange={textChanged}/> 
    </div>
    
    
  );
}

function Spinner() {
  return <div className={styles.Spinner}>
    <div/><div/><div/>
  </div>
}

function Result(props) {
  const urlRegex = /'?(https?:[\w-.~!*();:@&=+$,/?%#\[\]]*[^:')])'?/;
  return (
    <div className={styles.TextInput}>
      <div className={styles.Instructions}>Results from CDL+ChatGPT</div>
      <div className={styles.TextArea} value={props.textInput}>
        {props.text.split(/\n+/).map((paragraph, i) => {
          return <div key={i} className={styles.Paragraph}>
            {paragraph.split(urlRegex).map((span, i) => 
              urlRegex.test(span)
                ? <ExternalLink key={i} url={span} />
                : <span key={i}>{span}</span>
            )}
          </div>
        })}
      </div>
    </div>
  );
}

function ExternalLink(props) {
  return (
    <a target="_blank" href={props.url}>
      <svg viewBox="0 -256 1850 1850" className={styles.ExternalLink}>
        <g transform="matrix(1,0,0,-1,30.372881,1426.9492)">
          <path
            d="M 1408,608 V 288 Q 1408,169 1323.5,84.5 1239,0 1120,0 H 288 Q 169,0 84.5,84.5 0,169 0,288 v 832 Q 0,1239 84.5,1323.5 169,1408 288,1408 h 704 q 14,0 23,-9 9,-9 9,-23 v -64 q 0,-14 -9,-23 -9,-9 -23,-9 H 288 q -66,0 -113,-47 -47,-47 -47,-113 V 288 q 0,-66 47,-113 47,-47 113,-47 h 832 q 66,0 113,47 47,47 47,113 v 320 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z m 384,864 V 960 q 0,-26 -19,-45 -19,-19 -45,-19 -26,0 -45,19 L 1507,1091 855,439 q -10,-10 -23,-10 -13,0 -23,10 L 695,553 q -10,10 -10,23 0,13 10,23 l 652,652 -176,176 q -19,19 -19,45 0,26 19,45 19,19 45,19 h 512 q 26,0 45,-19 19,-19 19,-45 z"
            id="path3029"
            style={{ fill:'currentColor'}} />
        </g>
      </svg>
    </a>
  )
}

export default Landing;


