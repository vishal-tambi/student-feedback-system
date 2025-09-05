import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const fetchMyFeedback = async () => {
    try {
      const response = await api.get('/feedback/my-feedback');
      setFeedbacks(response.data);
    } catch (error) {
      setError('Failed to fetch your feedback');
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (feedback) => {
    setEditingFeedback(feedback._id);
    setEditForm({
      rating: feedback.rating,
      comment: feedback.comment
    });
  };

  const handleEditSubmit = async (e, feedbackId) => {
    e.preventDefault();
    try {
      await api.put(`/feedback/${feedbackId}`, editForm);
      setEditingFeedback(null);
      fetchMyFeedback(); // Refresh data
    } catch (error) {
        console.log(error)
      setError('Failed to update feedback');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.delete(`/feedback/${feedbackId}`);
        fetchMyFeedback(); // Refresh data
      } catch (error) {
        console.log(error)
        setError('Failed to delete feedback');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading your feedback...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Feedback</h1>
        <p className="mt-2 text-gray-600">Review and manage your course feedback</p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't submitted any feedback yet.</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feedback.courseId.name}
                  </h3>
                  <p className="text-gray-600">
                    Instructor: {feedback.courseId.instructor}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(feedback)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feedback._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingFeedback === feedback._id ? (
                <form onSubmit={(e) => handleEditSubmit(e, feedback._id)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={editForm.rating}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        rating: parseInt(e.target.value)
                      })}
                      className="input-field"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Very Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={editForm.comment}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        comment: e.target.value
                      })}
                      rows={4}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      Update Feedback
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFeedback(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                      {feedback.rating}/5
                    </span>
                  </div>
                  <p className="text-gray-700">{feedback.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFeedback;