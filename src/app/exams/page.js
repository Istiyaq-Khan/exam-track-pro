'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../../components/Navigation';
import { 
  PlusIcon, 
  CalendarIcon, 
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export default function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'SSC Final Exam',
    startDate: '',
    endDate: '',
    subjects: [{ name: '', todos: [] }]
  });

  const examTypes = [
    'SSC Final Exam',
    'Half Yearly',
    '9th Annual',
    '10th Progress Assessment',
    'SSC Pre-Test',
    'Custom'
  ];

  useEffect(() => {
    if (user) {
      fetchExams();
    }
  }, [user]);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exams');
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const url = editingExam ? `/api/exams/${editingExam._id}` : '/api/exams';
      const method = editingExam ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.uid
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingExam(null);
        resetForm();
        fetchExams();
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDelete = async (examId) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchExams();
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'SSC Final Exam',
      startDate: '',
      endDate: '',
      subjects: [{ name: '', todos: [] }]
    });
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { name: '', todos: [] }]
    }));
  };

  const removeSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const updateSubject = (index, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === index ? { ...subject, name: value } : subject
      )
    }));
  };

  const addTodo = (subjectIndex) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === subjectIndex 
          ? { ...subject, todos: [...subject.todos, { title: '', isCompleted: false }] }
          : subject
      )
    }));
  };

  const updateTodo = (subjectIndex, todoIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === subjectIndex 
          ? {
              ...subject,
              todos: subject.todos.map((todo, j) => 
                j === todoIndex ? { ...todo, [field]: value } : todo
              )
            }
          : subject
      )
    }));
  };

  const removeTodo = (subjectIndex, todoIndex) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === subjectIndex 
          ? {
              ...subject,
              todos: subject.todos.filter((_, j) => j !== todoIndex)
            }
          : subject
      )
    }));
  };

  const toggleTodo = async (examId, subjectIndex, todoIndex) => {
    try {
      const exam = exams.find(e => e._id === examId);
      const updatedSubjects = [...exam.subjects];
      updatedSubjects[subjectIndex].todos[todoIndex].isCompleted = 
        !updatedSubjects[subjectIndex].todos[todoIndex].isCompleted;

      const response = await fetch(`/api/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...exam,
          subjects: updatedSubjects
        }),
      });

      if (response.ok) {
        fetchExams();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const calculateProgress = (subject) => {
    if (subject.todos.length === 0) return 0;
    const completed = subject.todos.filter(todo => todo.isCompleted).length;
    return Math.round((completed / subject.todos.length) * 100);
  };

  const calculateOverallProgress = (exam) => {
    if (exam.subjects.length === 0) return 0;
    const totalProgress = exam.subjects.reduce((sum, subject) => sum + calculateProgress(subject), 0);
    return Math.round(totalProgress / exam.subjects.length);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
            <p className="text-gray-300">Please sign in to access your exam tracking dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Exam Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Exam</span>
          </button>
        </div>

        {/* Exam Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingExam ? 'Edit Exam' : 'Add New Exam'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Exam Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Exam Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {examTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-300">
                        Subjects & To-Dos
                      </label>
                      <button
                        type="button"
                        onClick={addSubject}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      >
                        Add Subject
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.subjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="border border-gray-600 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <input
                              type="text"
                              value={subject.name}
                              onChange={(e) => updateSubject(subjectIndex, e.target.value)}
                              placeholder="Subject name"
                              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeSubject(subjectIndex)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {subject.todos.map((todo, todoIndex) => (
                              <div key={todoIndex} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={todo.title}
                                  onChange={(e) => updateTodo(subjectIndex, todoIndex, 'title', e.target.value)}
                                  placeholder="To-do item"
                                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeTodo(subjectIndex, todoIndex)}
                                  className="bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors duration-200"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addTodo(subjectIndex)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                            >
                              Add To-Do
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingExam(null);
                        resetForm();
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      {editingExam ? 'Update Exam' : 'Create Exam'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exams List */}
        <div className="space-y-6">
          {exams.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No exams yet</h3>
              <p className="text-gray-500">Create your first exam to start tracking your progress</p>
            </div>
          ) : (
            exams.map((exam) => (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{exam.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                      </span>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {exam.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingExam(exam);
                        setFormData({
                          name: exam.name,
                          type: exam.type,
                          startDate: exam.startDate.split('T')[0],
                          endDate: exam.endDate.split('T')[0],
                          subjects: exam.subjects
                        });
                        setShowForm(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors duration-200"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exam._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                    <span className="text-sm text-gray-400">{calculateOverallProgress(exam)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateOverallProgress(exam)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-4">
                  {exam.subjects.map((subject, subjectIndex) => (
                    <div key={subjectIndex} className="border border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-white">{subject.name}</h4>
                        <span className="text-sm text-gray-400">{calculateProgress(subject)}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(subject)}%` }}
                        ></div>
                      </div>

                      <div className="space-y-2">
                        {subject.todos.map((todo, todoIndex) => (
                          <div key={todoIndex} className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleTodo(exam._id, subjectIndex, todoIndex)}
                              className={`p-1 rounded transition-colors duration-200 ${
                                todo.isCompleted 
                                  ? 'text-green-500 hover:text-green-400' 
                                  : 'text-gray-400 hover:text-gray-300'
                              }`}
                            >
                              {todo.isCompleted ? (
                                <CheckCircleIcon className="h-5 w-5" />
                              ) : (
                                <XCircleIcon className="h-5 w-5" />
                              )}
                            </button>
                            <span className={`text-sm ${
                              todo.isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'
                            }`}>
                              {todo.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 