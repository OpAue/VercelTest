import Header from "../components/Header";
import Button from "../components/Button";
import Editor from "../components/Editor";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DiaryDispatchContext } from "../App";
import type { EditorInput } from "../types";

const New = () => {
  const dispatchContext = useContext(DiaryDispatchContext);

  if (!dispatchContext) {
    throw new Error("DiaryDispatchContext가 없습니다.");
  }

  const { onCreate } = dispatchContext;
  const nav = useNavigate();

  const onSubmit = (input: EditorInput) => {
    onCreate(input.createdDate.getTime(), input.emotionId, input.content);
    nav("/", { replace: true });
  };

  return (
    <div>
      <Header
        title={"새 일기 쓰기"}
        leftChild={<Button onClick={() => nav(-1)} text={"< 뒤로 가기"} />}
      />
      <Editor onSubmit={onSubmit} />
    </div>
  );
};

export default New;