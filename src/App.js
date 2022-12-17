import "./App.css";

import { useBeforeunload } from "react-beforeunload";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRef, useState, useEffect } from "react";

firebase.initializeApp({
  apiKey: "AIzaSyBTJUrTCH206Y0HAcQrAYWfXyrlrEaSMWY",
  authDomain: "pingbox-568ff.firebaseapp.com",
  projectId: "pingbox-568ff",
  storageBucket: "pingbox-568ff.appspot.com",
  messagingSenderId: "436596564541",
  appId: "1:436596564541:web:cc0acfa91ade0923170054",
  measurementId: "G-X8N2L7W454",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
var userr = 0;

function App() {
  const user = useAuthState(auth);
  console.log("Y");
  console.table(user);
  console.log("YO");
  console.table(auth.currentUser);

  return (
    <div className="App">
      <section>{auth.currentUser ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const [input, setInput] = useState("");

  const siwg = () => {
    auth
      .signInAnonymously()
      .then((user) => {
        user.user.updateProfile({
          displayName: input,
          photoURL: `https://avatars.dicebear.com/api/gridy/${user.user.uid}.svg`,
        });
      })

      .catch((error) => {});
  };

  return (
    <div className="container">
      <div className="box p-5 m-5 signin">
        <div className="">
          <div className="is-size-2 has-text-centered has-text-weight-semibold">
            PingBox 💬
          </div>
          <div className="is-size-5 my-5 is-family-sans-serif">
            Hello! Welcome to PingBox!
            <br />
            Put in a random name and enter the ChatRoom.
          </div>
        </div>
        <div className="is-flex">
          <input
            className="input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="button is-dark" onClick={siwg}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

function SignOut() {
  return <button onClick={() => auth.SignOut()}>Sign Out</button>;
}

function ChatRoom() {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt", "desc").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  console.table(messages);

  const dummy = useRef();
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("INITIATE");
    const { uid, displayName } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      name: displayName,
    });
    console.log("SUCCESS");
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="room">
      <main>
        {messages &&
          messages
            .reverse()
            .map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </main>
      <span ref={dummy}></span>
      <form className="is-flex" onSubmit={sendMessage}>
        <input
          className="input"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button className="button" type="submit" disabled={!formValue}>
          📨
        </button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, name } = props.message;

  const sent = {
    main: "is-flex has-backgroudnd-info-dark is-justify-content-end is-flex-direction-row-reverse",
    cont: "blob message is-link m-2 has-background-info-dark",
    header:
      "blob message-header p-1 px-3 has-text-primary-darker has-background-info-dark",
    body: " blob message-body pb-2 pt-1 px-3 has-text-primary-light has-background-info-dark",
  };
  const received = {
    main: "is-flex has-backgroudnd-grey-dark",
    cont: "blob message is-link m-2 has-background-grey-darker",
    header:
      "blob message-header pb-1 pt-1 px-3 hhas-text-grey-light has-background-grey-darker",
    body: "blob message-body pb-2 pt-1 px-3 has-text-grey-lighter has-background-grey-darker",
  };
  const msgClass = uid === auth.currentUser.uid ? sent : received;

  return (
    <div class={msgClass.main}>
      <img
        class=""
        src={`https://avatars.dicebear.com/api/bottts/${uid}.svg`}
        alt="ZZZ"
        width="30"
        height="30"
      />
      <div class={msgClass.cont}>
        <div class={msgClass.header}>{msgClass === sent ? "You" : name}</div>

        <div class={msgClass.body}>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
