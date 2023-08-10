import React, { useState, useRef, useEffect } from "react";

const DiaryItem = ({
  onEdit,
  onRemove,
  id,
  author,
  content,
  emotion,
  created_data,
}) => {
  useEffect(() => {
    //수정되거나 추가된 item이 있을 경우에만 렌더링되는 최적화!
    console.log(`${id}번째 아이템 렌더!`);
  });

  //수정상태인지 아닌지에 대한 상태
  const [isEdit, setIsEdit] = useState(false);
  //toggleIsEdit 함수가 실행되면 수정상태가 됐다가 안됐다가
  const toggleIsEdit = () => setIsEdit(!isEdit);

  //수정내용이 5글자 미만일 경우 포커스되도록
  const localContentInput = useRef();

  //수정하는 내용의 상태
  const [localContent, setLocalContent] = useState(content);

  //수정취소
  const handleQuitEdit = () => {
    toggleIsEdit(); //setIsEdit(!isEdit)도 가능
    setLocalContent(content);
  };

  //수정완료
  const handleEdit = () => {
    if (localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }
    if (window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);
      toggleIsEdit();
    }
  };

  //일기 삭제 이벤트 핸들러
  const handleRemove = () => {
    if (window.confirm(`${id}번째 일기를 삭제하시겠습니까?`)) {
      onRemove(id);
    }
  };

  //일기 수정 이벤트 핸들러

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          작성자 : {author} | 감정 : {emotion}
        </span>
        <br />
        <span className="date">
          {new Date(created_data).toLocaleDateString()}
        </span>
      </div>
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              ref={localContentInput}
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
            ></textarea>
          </>
        ) : (
          <>{content}</>
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정취소</button>
          <button onClick={handleEdit}>수정완료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);
