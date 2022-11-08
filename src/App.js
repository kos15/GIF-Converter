import "./App.css";
import { useEffect, useState } from "react";
import { fetchFile, createFFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);  // To keep track wheter we successfull import ffmpeg lib
  const [file, setFile] = useState(false);  // To keep track we successfull import our input file
  const [gif, setGif] = useState({}); // to store our GIF file

  /**
   * @description To load FFMPEG library
   */
  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  /**
   * @param {*} e 
   * @description To upload an input video file
   */
  const uploadFile = (e) => {
    document.getElementById('convert').setAttribute('display', 'none');
    setFile(e.target.files[0]);
  };

  /**
   * @description To convert uploaded video file to GIF
   */
  const converGif = async () => {
    if (file) {
      ffmpeg.FS("writeFile", "test.mp4", await fetchFile(file));
      await ffmpeg.run(
        "-i",
        "test.mp4",
        "-t",
        "2.5",
        "-ss",
        "2.0",
        "-f",
        "gif",
        "out.gif"
      );
      const data = ffmpeg.FS("readFile", "out.gif");
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/gif" })
      );
      setGif(url);
    }
  };

  /**
   * @description To run load function on first load
   */
  useEffect(() => {
    load();
  }, []);

  /**
   * @description To enable convert button when file get uploaded
   */
  useEffect(() => {
    document.getElementById('convert').setAttribute('display', 'block');
  }, [file]);

  return ready ? (
    <div className="App">
      {file && (
        <video controls width="250" src={URL.createObjectURL(file)}></video>
      )}
      <hr></hr>
      <input type="file" onChange={uploadFile}></input>
      <button id='convert' onClick={converGif}>Convert to GIF</button>
      <div>
        {gif ? (
          <img src={gif}/>
        ) : file ? (
          <h1>Processing....</h1>
        ) : (
          <h1></h1>
        )}
      </div>
    </div>
  ) : (
    <h1> Loading...</h1>
  );
}

export default App;
