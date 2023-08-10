import React, { useState, useEffect } from "react";

const CounterA = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`CounterA update - count : ${count}`);
  });
  return <div>{count}</div>;
});

//✅자바스크립트에서 객체를 비교할 때는 얕은 비교 즉, 객체의 주소로 비교를 한다.
//객체들은 생성되자마자 고유의 메모리주소가 나오는데 이 주소가 같은지를 비교.
//만약 객체가 저장된 변수 a를 b에 할당하고 비교한다면 같다고 나옴.
//얕은 비교를 하지 않기
const CounterB = ({ obj }) => {
  useEffect(() => {
    console.log(`CounterB update - count : ${obj.count}`);
  });
  return <div>{obj.count}</div>;
};

const areEqual = (preProps, nextProps) => {
  return preProps.obj.count === nextProps.obj.count; //같다면 true, 같지않다면 false
};

//CounterB는 areEqual의 판단에 따라 리렌더링을 할지 말지 결정하는 메모화된 컴포넌트가 된다.
const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setobj] = useState({
    count: 1,
  });
  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>CounterA</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A button</button>
      </div>
      <div>
        <h2>CounterB</h2>
        <MemoizedCounterB obj={obj} />
        <button onClick={() => setobj({ count: 1 })}>B button</button>
      </div>
    </div>
  );
};

export default OptimizeTest;
