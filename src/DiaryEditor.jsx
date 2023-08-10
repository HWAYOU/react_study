import React, { useEffect, useRef, useState } from "react";

//onCreate함수가 재생성될 때마다 에디터 리렌더링된다 -> onCreate함수가 재생성되지 않도록 해야한다
const DiaryEditor = ({ onCreate }) => {
  useEffect(() => {
    console.log("렌더링됨");
  });

  const authorInput = useRef();
  const contentInput = useRef();
  //useRef 함수의 반환값을 authorInput에 넣어준다
  //MutableRefObject가 저장되는데 이건 html dom요소에 접근시키는 역할

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });

  //스프레드 연산자(...) : '...객체명'으로 사용하면 객체속성들이 나열된다
  //그 뒤에 변경되는 키와 값을 넣어주면 setState함수로 state객체 값이 변경된다
  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  //새로운 일기를 저장하는 함수
  const handleSubmit = () => {
    if (state.author.length < 1) {
      authorInput.current.focus(); //input에 focus해라
      //레퍼런스 객체(authorInput)는 현재 가르키는 값을 current라는 property로 사용
      return; //조건식에 일치하면 alert을 띄우고 return(함수 실행 종료)
    }
    if (state.content.length < 5) {
      contentInput.current.focus();
      return;
    }
    onCreate(state.author, state.content, state.emotion);
    alert("저장성공");

    setState({ author: "", content: "", emotion: 1 });
  };

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          ref={authorInput}
          value={state.author}
          name="author"
          onChange={handleChangeState}
        />
      </div>
      <div>
        <textarea
          ref={contentInput}
          value={state.content}
          name="content"
          onChange={handleChangeState}
        />
      </div>
      <div>
        <select
          value={state.emotion}
          name="emotion"
          onChange={handleChangeState}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </div>
  );
};
export default React.memo(DiaryEditor);
