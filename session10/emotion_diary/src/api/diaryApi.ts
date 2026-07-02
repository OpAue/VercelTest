import axios from "axios";

export type Diary = {
    id: number;
    createdDate: number;
    emotionId: number;
    content: string;
};

export type DiaryRequest = {
    createdDate: number;
    emotionId: number;
    content: string;
};

export type DeleteDiaryResponse = {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
};

const api = axios.create({
    baseURL: "https://opaue.p-e.kr/",
});

// 목록 조회
export const getDiaries = async (month: string) => {
    const res = await api.get<Diary[]>("/api/diaries", {
        params: { month },
    });
    return res.data;
};

// 단건 조회
export const getDiary = async (id: number) => {
    const res = await api.get<Diary>(`/api/diaries/${id}`);
        return res.data;
    };

// 생성
export const createDiary = async (data: DiaryRequest) => {
    const res = await api.post<Diary>("/api/diaries", data);
    return res.data;
};

// 수정
export const updateDiary = async (id: number, data: DiaryRequest) => {
    const res = await api.put<Diary>(`/api/diaries/${id}`, data);
    return res.data;
};

// 삭제
export const deleteDiary = async (id: number) => {
    const res = await api.delete<DeleteDiaryResponse>(`/api/diaries/${id}`);
    return res.data;
};