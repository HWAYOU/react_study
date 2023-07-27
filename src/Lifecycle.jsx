import React, { useEffect, useState } from "react";
//✅useEffect는 마운트, 언마운트, 업데이트, 특정 값에 변화가 있을 경우 등에 수행할 함수를 지정할 수 있다.

const UnMountTest = () => {
  useEffect(() => {
    console.log("Mount!");
    return () => {
      //useEffect 콜백함수의 return에 unmount시 수행할 함수를 작성한다.
      //⛔그런데 마운트할 때도 이 콘솔 출력이 실행된다. 뭐지????
      console.log("Unmount!");
    };
  }, []);
  return <div>UN MOUNT TEST</div>;
};

const Lifecycle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);

  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("Mount!");
  }, []); //화면이 제일 처음 나타날 때

  useEffect(() => {
    console.log("update!");
  }); //화면에 업데이트가 생길 때

  useEffect(() => {
    console.log(`count is update : ${count}`);
  }, [count]); //count에 변화가 있을 때

  useEffect(() => {
    console.log(`text is update : ${text}`);
  }, [text]); //text에 변화가 있을 때

  return (
    <div style={{ padding: 20 }}>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <button onClick={toggle}>ON/OFF</button>
      {isVisible && <UnMountTest />}
    </div>
  );
};

export default Lifecycle;
