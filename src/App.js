import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const dummyList = [
  {
    id: 1,
    author: "강화영",
    content: "나는 야인이 될거야",
    emotion: 4,
    created_data: new Date().getTime(),
  },
  {
    id: 2,
    author: "강화도",
    content: "호로로로로로롤",
    emotion: 5,
    created_data: new Date().getTime(),
  },
  {
    id: 3,
    author: "강감찬",
    content: "도로로로로로롱",
    emotion: 3,
    created_data: new Date().getTime(),
  },
];

function App() {
  return (
    <div className="App">
      <DiaryEditor />
      <DiaryList diaryList={dummyList} />
    </div>
  );
}

export default App;
