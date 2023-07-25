import DiaryItem from "./DiaryItem";

const DiaryList = ({ diaryList }) => {
  return (
    <div className="DiaryList">
      <h2>일기리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((item, idx) => (
          //✅Each child in a list should have a unique "key" prop. 각각의 item들은 고유의 키가 있어야 한다.
          //map의 두번째 매개변수인 idx를 사용할 경우 추가/수정으로 배열을 바꿀 때 리액트에서 문제가 생길 수 있으므로 고유한 id로 key를 설정
          //✅컴포넌트 분할하기 : 아이템을 삭제/수정하는 기능이 있어야 하는데 그 기능을 넣기에는 너무 복잡하므로
          <DiaryItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

//diaryList가 undefined일 때 기본값을 빈 배열로 설정
DiaryList.defaultProps = {
  diaryList: [],
};
export default DiaryList;
