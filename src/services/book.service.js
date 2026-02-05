import { http } from "@/lib/http";

export async function submitParagraph(chapterId, paragraph) {
  const { data } = await http.post(`/book/chapters/${chapterId}/submit/`, {
    paragraph,
  });
  return data;
}
