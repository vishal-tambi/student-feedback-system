import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    instructor: '',
    duration: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse}`, courseForm);
      } else {
        await api.post('/courses', courseForm);
      }
      
      resetForm();
      fetchCourses();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course._id);
    setCourseForm({
      name: course.name,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration
    });
    setShowAddForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated feedback.')) {
      try {
        await api.delete(`/courses/${courseId}`);
        fetchCourses();
      } catch (error) {
        console.log(error)
        setError('Failed to delete course');
      }
    }
  };

  const resetForm = () => {
    setCourseForm({
      name: '',
      description: '',
      instructor: '',
      duration: ''
    });
    setShowAddForm(false);
    setEditingCourse(null);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}>
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
          <span className="ml-2">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">Manage courses and view feedback</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          Add New Course
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button
            onClick={() => setError('')}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Add/Edit Course Form */}
      {showAddForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({
                    ...courseForm,
                    name: e.target.value
                  })}
                  className="input-field"
                  placeholder="e.g., React Fundamentals"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor
                </label>
                <input
                  type="text"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({
                    ...courseForm,
                    instructor: e.target.value
                  })}
                  className="input-field"
                  placeholder="e.g., Dr. Sarah Chen"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({
                    ...courseForm,
                    duration: e.target.value
                  })}
                  className="input-field"
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({
                  ...courseForm,
                  description: e.target.value
                })}
                rows={3}
                className="input-field"
                placeholder="Describe what students will learn in this course..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Courses Management</h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No courses available. Add your first course!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {course.name}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {course.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(course.avgRating || 0)}
                        </div>
                        <span className="text-sm text-gray-900">
                          {course.avgRating ? course.avgRating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.totalRatings || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-green-600">
            {courses.reduce((total, course) => total + (course.totalRatings || 0), 0)}
          </p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Rating</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {courses.length > 0 
              ? (courses.reduce((total, course) => total + (course.avgRating || 0), 0) / courses.length).toFixed(1)
              : '0.0'
            }
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm font-medium text-gray-700">Add New Course</div>
            </div>
          </button>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium text-gray-700">Students Active</div>
              <div className="text-lg font-bold text-blue-600 mt-1">
                {/* This would come from a separate API endpoint */}
                Active
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-sm font-medium text-gray-700">Latest Rating</div>
              <div className="text-lg font-bold text-green-600 mt-1">
                {courses.length > 0 && courses.some(c => c.avgRating) 
                  ? Math.max(...courses.filter(c => c.avgRating).map(c => c.avgRating)).toFixed(1)
                  : 'N/A'
                }
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium text-gray-700">Total Feedback</div>
              <div className="text-lg font-bold text-yellow-600 mt-1">
                {courses.reduce((total, course) => total + (course.totalRatings || 0), 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Performance Table */}
      {courses.length > 0 && (
        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-4">Course Performance Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses
                  .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
                  .map((course, index) => (
                    <tr key={course._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-2">
                            {course.avgRating ? course.avgRating.toFixed(1) : '0.0'}
                          </span>
                          <div className="flex">
                            {renderStars(course.avgRating || 0)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.totalRatings || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (course.avgRating || 0) >= 4.5 
                            ? 'bg-green-100 text-green-800'
                            : (course.avgRating || 0) >= 3.5
                            ? 'bg-yellow-100 text-yellow-800'
                            : (course.avgRating || 0) >= 2.5
                            ? 'bg-orange-100 text-orange-800'
                            : (course.avgRating || 0) > 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {(course.avgRating || 0) >= 4.5 
                            ? 'Excellent'
                            : (course.avgRating || 0) >= 3.5
                            ? 'Good'
                            : (course.avgRating || 0) >= 2.5
                            ? 'Average'
                            : (course.avgRating || 0) > 0
                            ? 'Needs Improvement'
                            : 'No Reviews'
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;