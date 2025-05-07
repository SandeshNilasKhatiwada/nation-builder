"use client";

import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import {
  getAllSurveyQuestions,
  deleteSurveyQuestion,
  createSurveyQuestion,
  SurveyQuestionData,
  getAllSurveys,
  createSurvey,
  updateSurveyQuestion,
} from "./surveyApi";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";

function SurveyQuestionsPage() {
  const [questions, setQuestions] = useState<SurveyQuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<SurveyQuestionData>({
    slug: "",
    content: "",
    intro: "",
    tag_list: "",
    question_format: "multiple_choice",
    survey_id: "",
    is_randomized: true,
    status: "published",
  });
  const [answerOptions, setAnswerOptions] = useState<string[]>([]); // New for dynamic options
  const [newOption, setNewOption] = useState(""); // Temp for adding one option
  const [surveys, setSurveys] = useState<any[]>([]);
  const [surveyName, setSurveyName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SurveyQuestionData | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchSurveys();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await getAllSurveyQuestions();
      const rawData = response?.data || [];
      const mappedQuestions = rawData.map((item: any) => ({
        id: item.id,
        ...item.attributes,
      }));
      setQuestions(mappedQuestions);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    try {
      const response = await getAllSurveys();
      setSurveys(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch surveys:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateQuestion = async () => {
    try {
      if (!formData.slug || !formData.content || !formData.survey_id) {
        return alert("Please fill all required fields");
      }
      const payload = {
        ...formData,
        tag_list: answerOptions.join(","), // Save options as comma-separated string
      };
      await createSurveyQuestion(payload);
      fetchQuestions();
      resetForm();
    } catch (err) {
      console.error("Failed to create question:", err);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteSurveyQuestion(id);
      fetchQuestions();
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

  const handleCreateSurvey = async () => {
    if (!surveyName.trim()) {
      return alert("Survey name is required");
    }
    try {
      await createSurvey(surveyName);
      setSurveyName("");
      fetchSurveys();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating survey");
    }
  };

  const openModal = (question: SurveyQuestionData) => {
    setSelectedQuestion(question);
    setFormData(question);
    setAnswerOptions((question.tag_list || "").split(",").filter(Boolean)); // Load existing options
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      content: "",
      intro: "",
      tag_list: "",
      question_format: "multiple_choice",
      survey_id: "",
      is_randomized: true,
      status: "published",
    });
    setAnswerOptions([]);
    setNewOption("");
  };

  const handleUpdateQuestion = async () => {
    if (!selectedQuestion?.id) return;
    try {
      const updatedFields = {
        slug: formData.slug,
        content: formData.content,
        intro: formData.intro,
        tag_list: answerOptions.join(","), // Save updated options
        question_format: formData.question_format,
        is_randomized: formData.is_randomized,
        status: formData.status,
        survey_id: formData.survey_id,
      };
      await updateSurveyQuestion(selectedQuestion.id, updatedFields);
      alert("Question updated successfully!");
      fetchQuestions();
      closeModal();
    } catch (err) {
      console.error("Failed to update question:", err);
    }
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    setAnswerOptions([...answerOptions, newOption.trim()]);
    setNewOption("");
  };

  const removeOption = (index: number) => {
    const updatedOptions = answerOptions.filter((_, i) => i !== index);
    setAnswerOptions(updatedOptions);
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Survey Questions</h1>

      {/* Create Survey Section */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Create New Survey</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Survey Name"
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
            className="border px-2 py-1 rounded w-64"
          />
          <Button onClick={handleCreateSurvey}>Create Survey</Button>
        </div>
      </div>

      {/* Create Question Form */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Create New Question</h2>
        <div className="flex flex-col gap-2">
          <input
            name="slug"
            placeholder="Slug"
            value={formData.slug || ""}
            onChange={handleInputChange}
            className="border px-2 py-1 rounded w-48 mb-2"
          />
          <input
            name="content"
            placeholder="Type your Question (e.g., What is your favorite food?)"
            value={formData.content || ""}
            onChange={handleInputChange}
            className="border px-2 py-1 rounded w-full mb-2"
          />

          {/* Dynamic Options */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Add Option (e.g., Milk)"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="border px-2 py-1 rounded w-64"
            />
            <Button onClick={addOption}>Add Option</Button>
          </div>

          {/* Display added options */}
          {answerOptions.length > 0 && (
            <div className="flex flex-col gap-1 mb-2">
              {answerOptions.map((option, index) => (
                <div key={index} className="flex items-center justify-between border px-2 py-1 rounded">
                  <span>{option}</span>
                  <button onClick={() => removeOption(index)} className="text-red-500">Remove</button>
                </div>
              ))}
            </div>
          )}

          <select
            name="survey_id"
            value={formData.survey_id || ""}
            onChange={handleInputChange}
            className="border px-2 py-1 rounded w-52 mb-2"
          >
            <option value="">Select Survey</option>
            {surveys.map((survey) => (
              <option key={survey.id} value={survey.id}>
                {survey.attributes?.name}
              </option>
            ))}
          </select>

          <Button onClick={handleCreateQuestion}>Create</Button>
        </div>
      </div>

      {/* Questions Display */}
      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="border p-4 rounded flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold text-gray-800">{question.content}</p>
                {/* Show options */}
                {question.tag_list && (
                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
                    {question.tag_list.split(",").map((opt, i) => (
                      <div key={i} className="px-2 py-1 border rounded">{opt}</div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  className="cursor-pointer text-blue-500 hover:scale-110 transition-transform"
                  onClick={() => openModal(question)}
                >
                  <Eye />
                </button>
                <Trash2
                  className="cursor-pointer text-red-500 hover:scale-110 transition-transform"
                  onClick={() => handleDeleteQuestion(question.id!)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Update */}
      {isModalOpen && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Survey Question</h2>

            <input
              name="slug"
              placeholder="Slug"
              value={formData.slug || ""}
              onChange={handleInputChange}
              className="border px-2 py-1 rounded w-full mb-2"
            />
            <input
              name="content"
              placeholder="Type your Question"
              value={formData.content || ""}
              onChange={handleInputChange}
              className="border px-2 py-1 rounded w-full mb-2"
            />

            {/* Dynamic Options (in Modal) */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add Option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="border px-2 py-1 rounded w-64"
              />
              <Button onClick={addOption}>Add Option</Button>
            </div>

            {answerOptions.length > 0 && (
              <div className="flex flex-col gap-1 mb-2">
                {answerOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between border px-2 py-1 rounded">
                    <span>{option}</span>
                    <button onClick={() => removeOption(index)} className="text-red-500">Remove</button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleUpdateQuestion}>Update</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default SurveyQuestionsPage;
