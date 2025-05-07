"use client";

import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import {
  getAllSurveyQuestions,
  deleteSurveyQuestion,
  SurveyQuestionData,
  getAllSurveys,
  createSurveyQuestionResponse,
  getAllSurveyQuestionResponses,
} from "../survey/surveyApi";
import { Trash2, Eye } from "lucide-react";
import { listPeople } from "../../../services/people";

function SurveyQuestionsPage() {
  const [questions, setQuestions] = useState<SurveyQuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<SurveyQuestionData | null>(null);
  const [replies, setReplies] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchSurveys();
    fetchPeople();
    fetchResponses();
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

  const fetchPeople = async () => {
    try {
      const response = await listPeople();
      const rawPeople = response?.data || [];
      const mappedPeople = rawPeople.map((person: any) => ({
        id: person.id,
        ...person.attributes,
      }));
      setPeople(mappedPeople);
    } catch (err) {
      console.error("Failed to fetch people:", err);
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await getAllSurveyQuestionResponses();
      const rawResponses = response?.data || [];
      const mappedResponses = rawResponses.map((item: any) => ({
        id: item.id,
        ...item.attributes,
      }));
      setResponses(mappedResponses);
    } catch (err) {
      console.error("Failed to fetch survey responses:", err);
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

  const openModal = (question: SurveyQuestionData) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleReplyChange = (questionId: string, value: string) => {
    setReplies((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitReply = async (questionId: string) => {
    if (!selectedPersonId) {
      alert("Please select a person to associate the response.");
      return;
    }
    if (!replies[questionId]) {
      alert("Please select an option to submit.");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [questionId]: true }));

    try {
      const replyContent = replies[questionId];
      await createSurveyQuestionResponse({
        survey_question_id: questionId,
        signup_id: selectedPersonId,
        author_id: selectedPersonId,
        content: replyContent,
        question_format: "multiple_choice",
      });
      alert("Response submitted!");
      fetchResponses();
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4">
            {questions.map((question) => (
              <div key={question.id} className="border p-4 rounded">
                <h2 className="text-lg font-semibold">{question.content}</h2>
                <p>Status: {question.status}</p>

                {/* Dynamic Radio Buttons */}
                <div className="mt-4">
                  {question.tag_list ? (
                    <div className="flex flex-col gap-2 mb-2">
                      {question.tag_list.split(",").map((option) => (
                        <label
                          key={option.trim()}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            name={`option-${question.id}`}
                            value={option.trim()}
                            checked={
                              replies[question.id || ""] === option.trim()
                            }
                            onChange={() =>
                              handleReplyChange(
                                question.id || "",
                                option.trim()
                              )
                            }
                          />
                          {option.trim()}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500">No options available.</p>
                  )}

                  <div className="mt-2">
                    <select
                      value={selectedPersonId || ""}
                      onChange={(e) => setSelectedPersonId(e.target.value)}
                      className="w-full border p-2"
                    >
                      <option value="" disabled>
                        Select a person (email)
                      </option>
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleSubmitReply(question.id!)}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    disabled={submitting[question.id || ""]}
                  >
                    {submitting[question.id || ""]
                      ? "Submitting..."
                      : "Submit Reply"}
                  </button>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openModal(question)}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id!)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Survey Responses */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Survey Responses</h2>
          <div className="grid gap-2">
            {responses.length > 0 ? (
              responses.map((response) => {
                const person = people.find(
                  (p) =>
                    p.id === response.signup_id || p.id === response.author_id
                );
                return (
                  <div key={response.id} className="border p-4 rounded">
                    <p>
                      <strong>Response Content:</strong> {response.content}
                    </p>
                    <p>
                      <strong>Question ID:</strong>{" "}
                      {response.survey_question_id}
                    </p>
                    <p>
                      <strong>Author:</strong>{" "}
                      {person ? person.email : "Unknown"}
                    </p>
                    <p>
                      <strong>Format:</strong> {response.question_format}
                    </p>
                  </div>
                );
              })
            ) : (
              <p>No responses yet.</p>
            )}
          </div>
        </div>

        {/* Modal for Question View */}
        {isModalOpen && selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                {selectedQuestion.content}
              </h2>

              {selectedQuestion.tag_list ? (
                <div className="flex flex-col gap-2 mb-4">
                  {selectedQuestion.tag_list.split(",").map((option) => (
                    <label
                      key={option.trim()}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name={`option-${selectedQuestion.id}`}
                        value={option.trim()}
                        checked={
                          replies[selectedQuestion.id || ""] === option.trim()
                        }
                        onChange={() =>
                          handleReplyChange(
                            selectedQuestion.id || "",
                            option.trim()
                          )
                        }
                      />
                      {option.trim()}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-red-500">No options available.</p>
              )}

              <div className="mt-2">
                <select
                  value={selectedPersonId || ""}
                  onChange={(e) => setSelectedPersonId(e.target.value)}
                  className="w-full border p-2"
                >
                  <option value="" disabled>
                    Select a person (email)
                  </option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSubmitReply(selectedQuestion.id!)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={submitting[selectedQuestion.id || ""]}
                >
                  {submitting[selectedQuestion.id || ""]
                    ? "Submitting..."
                    : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SurveyQuestionsPage;
