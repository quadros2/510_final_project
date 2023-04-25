import styles from './landing.module.scss';
import React, {useState, useRef} from "react";
import Query from './query/query';
import Login from './login/login';
import Options from './options/options';
import Results from './results/results';

const cdlToken = sessionStorage.getItem('cdl_token');

function Landing() {
  //-1 = Left, 0 = Center, 1 = Right
  const [currentPage, setCurrentPage] = useState(cdlToken ? [-1, 0, 1, 1] : [0, 1, 1, 1]);
  const tokenRef = useRef(cdlToken);
  const linkArray = useRef([]);
  const [responseText, setResponseText] = useState('');
  const [bottomBarEnabled, setBottomBarEnabled] = useState(true);

  function loginFinished(token) {
    sessionStorage.setItem('cdl_token', token)
    tokenRef.current = token
    setCurrentPage([-1, 0, 1, 1])
  }

  function queryFinished(results) {
    linkArray.current = results
    setCurrentPage([-1, -1, 0, 1])
  }

  function optionFinished(results) {
    setResponseText(results)
    setCurrentPage([-1, -1, -1, 0])
  }

  function doStartOver() {
    setCurrentPage([-1, 0, 1, 1])

  }

  function changePage(index) {
    let newPages = [...currentPage];
    newPages.fill(-1, 0, index);
    newPages.fill(1, index);
    newPages[index] = 0;
    setCurrentPage(newPages);
  }

  function statusDots() {
    let currentPos = currentPage.indexOf(0);
    let dots = []
    for(let i = 0; i < currentPage.length; i++) {
      dots.push(<div key={i} onClick={(i < currentPos || (i === 1 && tokenRef.current && currentPos !== 1)) && bottomBarEnabled ? (() => changePage(i)) : null} className={`${styles.Dots} ${((i < currentPos || (i === 1 && tokenRef.current && currentPos !== 1)) && bottomBarEnabled) ? styles.Selectable : ""} ${currentPage[i] === 0 ? styles.Selected : ""}`}></div>)
    }
    return dots;
  }

  return(
    <>
      <div className={styles.MainHolder}>
        <Login currentPos={currentPage[0]} finished={loginFinished}/>
        <Query currentPos={currentPage[1]} cdlToken={tokenRef.current} finished={queryFinished} bottomBar={setBottomBarEnabled}/>
        <Options currentPos={currentPage[2]} linkArray={linkArray} finished={optionFinished} bottomBar={setBottomBarEnabled}/>
        <Results currentPos={currentPage[3]} responseText={responseText} finished={doStartOver}/>
        <div className={styles.BottomBar}>
          {statusDots()}
        </div>
      </div>

      <div className={styles.background}/>
    </>
  );

}


export default Landing;


