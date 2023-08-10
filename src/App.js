import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";

function App() {
  const [data, setData] = useState([]);

  const getData = async () => {
    //fetch로 api호출해서 데이터 가져오기
    //async/await로 데이터 패치작업은 동기적으로 실행한다
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    //패치한 데이터 가공
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    setData(initData);
  };

  //제일 처음 마운트 될 때 데이터 패치한다
  useEffect(() => {
    getData();
  }, []);

  //⚡아이템 id 왜 useRef 쓰는지?
  //useRef는 컴포넌트 리렌더링 되더라도 값이 초기값으로 변동되지 않고 유지된다. 고유식별자에 사용하기에 유용하다.
  const dataId = useRef(0);

  //✅일기 아이템을 추가하는 함수
  //✅useCallback : 제일 처음 마운트될 때 한번 만들고 이걸 재사용할 수 있도록
  const onCreate = useCallback((author, content, emotion) => {
    const created_data = new Date().getTime(); //시간을 밀리세컨드로
    const newItem = {
      //⛔객체인데 키값이 아니라 그냥 키만 이렇게 줘도 되나???
      author,
      content,
      emotion,
      created_data,
      id: dataId.current, //0
    };
    dataId.current += 1; //dataId.current++; 이렇게도 가능
    setData((data) => [newItem, ...data]); //⚡함수형 업데이트 : 최신의 데이터를 인자를 통해 참조할수있음
  }, []); //⚡제일 처음 마운트 되는 시점에 data는 빈배열이다.

  //✅일기 아이템을 삭제하는 함수(filter사용)
  const onRemove = useCallback((targetId) => {
    //매개변수로 받은 id와 일치하지 않는 id들로 필터링하여 새로운 배열 생성
    setData((data) => data.filter((item) => targetId !== item.id));
  }, []);

  //✅일기 아이템을 수정하는 함수(map과 삼항연산자 사용)
  const onEdit = useCallback((targetId, newContent) => {
    setData((data) =>
      data.map((item) =>
        item.id === targetId ? { ...item, content: newContent } : item
      )
    );
  }, []);

  //✅리턴을 가지는 함수를 Memoization하기 (연산최적화 : 어떤 값이 변할 때만 연산 수행)
  const getDiaryAnalysis = useMemo(
    () => {
      const goodCount = data.filter((it) => it.emotion >= 3).length; //emotion이 3이상인 것을 필터로 새로운 배열을 만들고 저장
      const badCount = data.length - goodCount;
      const goodRatio = (goodCount / data.length) * 100;
      return { goodCount, badCount, goodRatio };
    },
    [data.length] //data.length가 바뀔때만 앞의 콜백함수를 수행하고, 그렇지 않으면 수행했던 리턴값을 계속 사용
  );

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
