import "./App.css";
import { useReducer, createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";

import {
  getDiaries,
  createDiary,
  updateDiary,
  deleteDiary,
} from "./api/diaryApi";

type DiaryItem = {
  id: number;
  createdDate: number;
  emotionId: number;
  content: string;
};

type Action =
  | {
      type: "INIT";
      data: DiaryItem[];
    }
  | {
      type: "CREATE";
      data: DiaryItem;
    }
  | {
      type: "UPDATE";
      data: DiaryItem;
    }
  | {
      type: "DELETE";
      id: number;
    };

type DispatchContextType = {
  onCreate: (
    createdDate: number,
    emotionId: number,
    content: string
  ) => Promise<void>;

  onUpdate: (
    id: number | string,
    createdDate: number,
    emotionId: number,
    content: string
  ) => Promise<void>;

  onDelete: (id: number | string) => Promise<void>;

  refreshDiaries: (month?: string) => Promise<void>;
};

function reducer(state: DiaryItem[], action: Action): DiaryItem[] {
  switch (action.type) {
    case "INIT":
      return action.data;

    case "CREATE":
      return [action.data, ...state];

    case "UPDATE":
      return state.map((item) =>
        item.id === action.data.id ? action.data : item
      );

    case "DELETE":
      return state.filter((item) => item.id !== action.id);

    default:
      return state;
  }
}

export const DiaryStateContext = createContext<DiaryItem[] | null>(null);

export const DiaryDispatchContext =
  createContext<DispatchContextType | null>(null);

const getMonthString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, dispatch] = useReducer(reducer, []);

  const refreshDiaries = async (month = getMonthString(new Date())) => {
    const diaries = await getDiaries(month);

    dispatch({
      type: "INIT",
      data: diaries,
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        await refreshDiaries();
      } catch (error) {
        console.error("일기 목록 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const onCreate = async (
    createdDate: number,
    emotionId: number,
    content: string
  ) => {
    try {
      const newDiary = await createDiary({
        createdDate,
        emotionId,
        content,
      });

      dispatch({
        type: "CREATE",
        data: newDiary,
      });
    } catch (error) {
      console.error("일기 생성 실패:", error);
    }
  };

  const onUpdate = async (
    id: number | string,
    createdDate: number,
    emotionId: number,
    content: string
  ) => {
    try {
      const updatedDiary = await updateDiary(Number(id), {
        createdDate,
        emotionId,
        content,
      });

      dispatch({
        type: "UPDATE",
        data: updatedDiary,
      });
    } catch (error) {
      console.error("일기 수정 실패:", error);
    }
  };

  const onDelete = async (id: number | string) => {
    try {
      await deleteDiary(Number(id));

      dispatch({
        type: "DELETE",
        id: Number(id),
      });
    } catch (error) {
      console.error("일기 삭제 실패:", error);
    }
  };

  if (isLoading) {
    return <div>데이터 로딩중입니다 ...</div>;
  }

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider
        value={{ onCreate, onUpdate, onDelete, refreshDiaries }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<New />} />
          <Route path="/diary/:id" element={<Diary />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;