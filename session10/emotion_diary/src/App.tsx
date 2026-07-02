import "./App.css"
import { useReducer, useRef, createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import {
  createDiary,
  deleteDiary,
  fetchDiaries,
  updateDiary,
} from "./api/api";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";
import type { DiaryItem } from "./types";

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
      id: number | string;
    };

type DispatchContextType = {
  onCreate: (createdDate: number, emotionId: number, content: string) => void;
  onUpdate: (
    id: number | string,
    createdDate: number,
    emotionId: number,
    content: string
  ) => void;
  onDelete: (id: number | string) => void;
};

function reducer(state: DiaryItem[], action: Action): DiaryItem[] {
  let nextState: DiaryItem[];

  switch (action.type) {
    case "INIT":
      return action.data;

    case "CREATE":
      nextState = [action.data, ...state];
      break;

    case "UPDATE":
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
      break;

    case "DELETE":
      nextState = state.filter((item) => String(item.id) !== String(action.id));
      break;

    default:
      return state;
  }

  return nextState;
}

export const DiaryStateContext = createContext<DiaryItem[] | null>(null);

export const DiaryDispatchContext =
  createContext<DispatchContextType | null>(null);

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef<number>(0);

  useEffect(() => {
    const loadInitialData = async () => {
      const diaryData = await fetchDiaries();

      let maxId = 0;

      diaryData.forEach((item) => {
        if (Number(item.id) > maxId) {
          maxId = Number(item.id);
        }
      });

      idRef.current = maxId + 1;

      dispatch({
        type: "INIT",
        data: diaryData,
      });

      setIsLoading(false);
    };

    void loadInitialData();
  }, []);

  const onCreate = (
    createdDate: number,
    emotionId: number,
    content: string
  ) => {
    const diaryItem: DiaryItem = {
      id: idRef.current++,
      createdDate,
      emotionId,
      content,
    };

    dispatch({
      type: "CREATE",
      data: diaryItem,
    });

    void createDiary(diaryItem);
  };

  const onUpdate = (
    id: number | string,
    createdDate: number,
    emotionId: number,
    content: string
  ) => {
    const diaryItem: DiaryItem = {
      id,
      createdDate,
      emotionId,
      content,
    };

    dispatch({
      type: "UPDATE",
      data: diaryItem,
    });

    void updateDiary(diaryItem);
  };

  const onDelete = (id: number | string) => {
    dispatch({
      type: "DELETE",
      id,
    });

    void deleteDiary(id);
  };

  if (isLoading) {
    return <div>데이터 로딩중입니다 ...</div>;
  }

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
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