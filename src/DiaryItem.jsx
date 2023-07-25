const DiaryItem = ({ id, author, content, emotion, created_data }) => {
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
      <div className="content">{content}</div>
    </div>
  );
};

export default DiaryItem;
