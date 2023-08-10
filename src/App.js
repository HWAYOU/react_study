import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import { useCallback, useRef, useEffect, useMemo, useReducer } from "react";

//✅useReducer : app컴포넌트가 너무 길어지고 무거워진다 -> 복잡한 상태 관리 로직 분리하기
const reducer = (state, action) => {
  //action: 어떤 상태변화를 일으켜야하는지에 대한 정보를 가지고 있는 객체
  switch (action.type) {
    case "INIT": {
      return action.data; //action 객체의 data 속성에 initData가 전달되고, 이 리턴값은 data를 변경시킨다
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  //초기값이 빈 배열인 data 상태
  //dispatch를 호출하면 액션객체를 reducer로 전달하고 상태변화 처리함수인 reducer가 처리하게 된다

  //⚡아이템 id 왜 useRef 쓰는지?
  //useRef는 컴포넌트 리렌더링 되더라도 값이 초기값으로 변동되지 않고 유지된다. 고유식별자에 사용하기에 유용하다.
  const dataId = useRef(0);

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

    dispatch({ type: "INIT", data: initData });
  };

  //제일 처음 마운트 될 때 데이터 패치한다
  useEffect(() => {
    getData();
  }, []);

  //✅useCallback : 제일 처음 마운트될 때 한번 만들고 이걸 재사용할 수 있도록
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    dataId.current += 1;
  }, []);
  //⚡dispatch를 호출하면 알아서 현재의 state를 자동으로 reducer 함수가 참조한다. useCallback을 사용하면서 dependency array를 신경쓰지 않아도 된다.

  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
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
