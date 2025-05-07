// surveyApi.ts
import axios from 'axios';

// Interfaces
export interface SurveyQuestionData {
  id?: string;
  slug: string | null;
  content: string | null;
  intro: string | null;
  tag_list: string | null;
  is_randomized: boolean;
  survey_id: string | null;
  status: "archived" | "deleted" | "expired" | "hidden" | "published" | "rule_violated" | "unlisted" | null;
  question_format: "multiple_choice" | "yes_no" | "text" | null;
}

export interface SurveyResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      updated_at: string;
      created_at: string;
    };
  };
}

export interface CreateSurveyResponseData {
  survey_question_id: string;
  survey_question_possible_response_id: string;
  signup_id: string;
  author_id: string;
  content: string;
  question_format: "multiple_choice" | "yes_no" | "text";
}

export interface SurveyQuestionResponse {
  data: {
    id: string;
    type: "survey_question_responses";
    attributes: {
      survey_question_id: string;
      survey_question_possible_response_id: string;
      signup_id: string;
      author_id: string;
      content: string;
      question_format: "multiple_choice" | "yes_no" | "text";
      created_at: string;
      updated_at: string;
      page_id: string;
      is_skipped: boolean;
    };
  };
}

// Helper functions
const checkSurveyNameExists = async (surveyName: string) => {
  try {
    const response = await axios.get(`/api/nationbuilder/surveys?filter[name]=${surveyName}`);
    return response.data.data.length > 0;
  } catch (error) {
    console.error("Error checking survey name:", error);
    throw new Error("Unable to check survey name");
  }
};

const checkSurveyExists = async (survey_id: string) => {
  try {
    const response = await axios.get(`/api/nationbuilder/surveys/${survey_id}`);
    return response.data;
  } catch (error) {
    console.error("Survey not found:", error);
    return null;
  }
};

// API functions
export const createSurvey = async (surveyName: string) => {
  const nameExists = await checkSurveyNameExists(surveyName);
  if (nameExists) {
    throw new Error(`Survey name '${surveyName}' already exists. Please choose a different name.`);
  }

  const payload = {
    data: {
      type: "surveys",
      attributes: { name: surveyName },
    },
  };

  try {
    const response = await axios.post("/api/nationbuilder/surveys", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating survey:", error.response?.data || error.message);
    throw new Error("Unable to create survey");
  }
};

export const createSurveyQuestion = async (question: SurveyQuestionData) => {
  if (!question.survey_id) {
    throw new Error("Survey ID is required.");
  }

  const surveyExists = await checkSurveyExists(question.survey_id);
  if (!surveyExists) {
    throw new Error(`Survey with ID ${question.survey_id} not found.`);
  }

  const payload = {
    data: {
      type: "survey_questions",
      attributes: {
        slug: question.slug,
        content: question.content,
        intro: question.intro,
        tag_list: question.tag_list,
        is_randomized: question.is_randomized ?? true,
        status: question.status,
        question_format: question.question_format ?? "multiple_choice",
      },
      relationships: {
        survey: {
          data: {
            type: "surveys",
            id: question.survey_id,
          },
        },
      },
    },
  };

  try {
    const response = await axios.post("/api/nationbuilder/survey_questions", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Creating survey question failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllSurveyQuestions = async () => {
  try {
    const response = await axios.get("/api/nationbuilder/survey_questions", {
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching all survey questions failed:", error);
    throw error;
  }
};

export const getSurveyQuestionById = async (id: string) => {
  try {
    const response = await axios.get(`/api/nationbuilder/survey_questions/${id}`, {
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Fetching survey question with ID ${id} failed:`, error);
    throw error;
  }
};

export const updateSurveyQuestion = async (id: string, updatedData: Partial<SurveyQuestionData>) => {
  const {
    slug,
    content,
    intro,
    tag_list,
    is_randomized,
    status,
    question_format,
    survey_id,
  } = updatedData;

  const payload = {
    data: {
      type: "survey_questions",
      id,
      attributes: {
        slug,
        content,
        intro,
        tag_list,
        is_randomized,
        status,
        question_format,
      },
      relationships: {
        survey: {
          data: {
            type: "surveys",
            id: survey_id,
          },
        },
      },
    },
  };

  try {
    const response = await axios.patch(`/api/nationbuilder/survey_questions/${id}`, payload, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Updating survey question with ID ${id} failed:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteSurveyQuestion = async (id: string) => {
  try {
    const response = await axios.delete(`/api/nationbuilder/survey_questions/${id}`, {
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Deleting survey question with ID ${id} failed:`, error);
    throw error;
  }
};

export const getAllSurveys = async () => {
  try {
    const response = await axios.get("/api/nationbuilder/surveys", {
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching all surveys failed:", error);
    throw error;
  }
};

export const getSurveyById = async (id: string) => {
  try {
    const response = await axios.get(`/api/nationbuilder/surveys/${id}`, {
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Fetching survey with ID ${id} failed:`, error);
    throw error;
  }
};

export const createSurveyQuestionResponse = async (responseData: CreateSurveyResponseData): Promise<SurveyQuestionResponse> => {
  const payload = {
    data: {
      type: "survey_question_responses",
      attributes: responseData,
    },
  };

  try {
    const response = await axios.post("/api/nationbuilder/survey_question_responses", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Creating survey question response failed:", error.response?.data || error.message);
    throw error;
  }
};


export const getAllSurveyQuestionResponses = async () => {
  try {
    const response = await axios.get("/api/nationbuilder/survey_question_responses", {
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching survey question responses failed:", error);
    throw error;
  }
};
