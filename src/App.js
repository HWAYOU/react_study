import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import React, {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useReducer,
} from "react";

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

// ✅context API(전역상태관리) : props drilling을 제거하여 context에서 원하는 값을 한번에 받아 올 수 있다
// 1) context 만들기 : context를 만들고 export를 해줘야 다른 컴포넌트에서 접근 가능
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext(); // state를 변화시키는 dispatch함수를 내보낸다
// 4) 새로운 context생성 : 기존 생성된 context의 value에 onRemove를 추가할 수 없다.
// 왜냐하면 Provider도 컴포넌트인데 data의 값이 변경되면 리렌더링되고, 앞에서 설정한 최적화(onRemove 재사용)가 소용없어지게 됨 -> context를 중첩으로 사용하기

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

  //하나의 값으로 묶어서 전달하기
  //⚡useMemo를 사용하는 이유? 컴포넌트가 재생성 될 때 객체는 재생성되지 않도록
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
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

  // 2) context 사용하기 : 공급자 컴포넌트로 리턴하는 값들을 감싸준다. value props로 공급하고 싶은 값 지정해주기.
  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          <DiaryList onEdit={onEdit} onRemove={onRemove} />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
