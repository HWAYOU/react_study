import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import { useState, useRef } from "react";
import Lifecycle from "./Lifecycle";

// const dummyList = [
//   {
//     id: 1,
//     author: "강화영",
//     content: "나는 야인이 될거야",
//     emotion: 4,
//     created_data: new Date().getTime(),
//   },
//   {
//     id: 2,
//     author: "강화도",
//     content: "호로로로로로롤",
//     emotion: 5,
//     created_data: new Date().getTime(),
//   },
//   {
//     id: 3,
//     author: "강감찬",
//     content: "도로로로로로롱",
//     emotion: 3,
//     created_data: new Date().getTime(),
//   },
// ];

function App() {
  const [data, setData] = useState([]);

  //⚡아이템 id 왜 useRef 쓰는지?
  //useRef는 컴포넌트 리렌더링 되더라도 값이 초기값으로 변동되지 않고 유지된다. 고유식별자에 사용하기에 유용하다.
  const dataId = useRef(0);

  //✅일기 아이템을 추가하는 함수
  const onCreate = (author, content, emotion) => {
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
    setData([newItem, ...data]); //새로운 일기를 배열 제일 앞에 오도록
  };

  //✅일기 아이템을 삭제하는 함수(filter사용)
  const onRemove = (targetId) => {
    const newDiaryList = data.filter((item) => targetId !== item.id);
    //매개변수로 받은 id와 일치하지 않는 id들로 필터링하여 새로운 배열 생성
    setData(newDiaryList);
  };

  //✅일기 아이템을 수정하는 함수(map과 삼항연산자 사용)
  const onEdit = (targetId, newContent) => {
    const newDiaryList = data.map((item) =>
      item.id === targetId ? { ...item, content: newContent } : item
    );
    setData(newDiaryList);
  };

  console.log(data);

  return (
    <div className="App">
      <Lifecycle />
      <DiaryEditor onCreate={onCreate} />
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
