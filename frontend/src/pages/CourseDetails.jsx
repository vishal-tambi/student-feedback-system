import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
      
      // Check if user has already submitted feedback
      const userFeedback = response.data.feedbacks?.find(
        feedback => feedback.studentId._id === user.id
      );
      
      if (userFeedback) {
        setShowFeedbackForm(false);
      }
    } catch (error) {
      setError('Failed to fetch course details');
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post('/feedback', {
        courseId: id,
        rating: parseInt(feedbackForm.rating),
        comment: feedbackForm.comment
      });
      
      setShowFeedbackForm(false);
      setFeedbackForm({ rating: 5, comment: '' });
      fetchCourseDetails(); // Refresh data
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
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

  const getChartData = () => {
    if (!course?.ratingDistribution) return null;

    const data = Object.entries(course.ratingDistribution).map(([rating, count]) => ({
      rating: `${rating} Star${rating !== '1' ? 's' : ''}`,
      count
    }));

    return {
      bar: {
        labels: data.map(item => item.rating),
        datasets: [
          {
            label: 'Number of Reviews',
            data: data.map(item => item.count),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      },
      pie: {
        labels: data.map(item => item.rating),
        datasets: [
          {
            data: data.map(item => item.count),
            backgroundColor: [
              '#ef4444',
              '#f97316',
              '#eab308',
              '#22c55e',
              '#3b82f6',
            ],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading course details...</span>
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

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Course not found</p>
          <Link to="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const userHasFeedback = course.feedbacks?.some(feedback => feedback.studentId._id === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/courses"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Courses
      </Link>

      {/* Course Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.name}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Instructor:</span>
                <span className="ml-2 text-gray-600">{course.instructor}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="ml-2 text-gray-600">{course.duration}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:ml-8 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="flex mr-2">
                {renderStars(Math.round(course.avgRating || 0))}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {course.avgRating ? course.avgRating.toFixed(1) : '0.0'}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Based on {course.totalRatings || 0} reviews
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Feedback</h2>
          
          {userHasFeedback ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">
                You have already submitted feedback for this course. Thank you!
              </p>
            </div>
          ) : (
            <>
              {!showFeedbackForm ? (
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="btn-primary"
                >
                  Submit Feedback
                </button>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={feedbackForm.rating}
                      onChange={(e) => setFeedbackForm({
                        ...feedbackForm,
                        rating: e.target.value
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
                      value={feedbackForm.comment}
                      onChange={(e) => setFeedbackForm({
                        ...feedbackForm,
                        comment: e.target.value
                      })}
                      rows={4}
                      className="input-field"
                      placeholder="Share your experience with this course..."
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFeedbackForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Rating Analytics */}
        {chartData && course.totalRatings > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Bar Chart</h3>
                <Bar
                  data={chartData.bar}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Pie Chart</h3>
                <Pie
                  data={chartData.pie}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Feedback */}
      {course.feedbacks && course.feedbacks.length > 0 && (
        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-6">Recent Feedback</h2>
          <div className="space-y-4">
            {course.feedbacks.slice(0, 5).map((feedback) => (
              <div key={feedback._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-900">
                      {feedback.studentId.name}
                    </span>
                    <div className="flex mt-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;