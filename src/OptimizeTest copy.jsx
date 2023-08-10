//✅React.memo : 부모컴포넌트가 리렌더링 되면 하위 컴포넌트는 자동으로 리렌더링 된다.
//하지만 그 자식 컴포넌트에 변동사항이 없다면 연산낭비이므로
//컴포넌트가 가지고 있는 특정 값이 변할 때만 해당컴포넌트가 렌더링되도록 하는 것.
import React, { useState, useEffect } from "react";

//React.memo를 사용하면 props의 값인 text가 변할 때만 리렌더링 된다.
const TextView = React.memo(({ text }) => {
  useEffect(() => {
    console.log(`update :: Text : ${text}`);
  });
  return <div>{text}</div>;
});

const CountView = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`update :: count : ${count}`);
  });
  return <div>{count}</div>;
});

const OptimizeTest = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>count</h2>
        <CountView count={count} />
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h2>text</h2>
        <TextView text={text} />
        <input value={text} onChange={(e) => setText(e.target.value)}></input>
      </div>
    </div>
  );
};

export default OptimizeTest;
