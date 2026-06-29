import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DiaryStateContext } from "../App";
import type { DiaryItem } from "../types";

const useDiary = (id: string | undefined): DiaryItem | undefined => {
  const data = useContext(DiaryStateContext);
  const [curDiaryItem, setCurDiaryItem] = useState<DiaryItem | undefined>();
  const nav = useNavigate();

  useEffect(() => {
    if (!data || !id) {
      return;
    }

    const currentDiaryItem = data.find(
      (item) => String(item.id) === String(id)
    );

    if (!currentDiaryItem) {
      window.alert("존재하지 않는 일기입니다.");
      nav("/", { replace: true });
      return;
    }

    setCurDiaryItem(currentDiaryItem);
  }, [id, data, nav]);

  return curDiaryItem;
};

export default useDiary;