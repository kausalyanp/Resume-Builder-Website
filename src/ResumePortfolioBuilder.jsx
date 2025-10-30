import React, { useState, useEffect, useRef } from 'react';
import { User, Briefcase, GraduationCap, Code, Award, Settings, Download, Trash2, Plus, X, Moon, Sun, Github, Eye, Layout, Palette, Type, Upload, FileImage, ExternalLink } from 'lucide-react';

const ResumePortfolioBuilder = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [profileImage, setProfileImage] = useState('');
  const [includePortfolio, setIncludePortfolio] = useState(false);
  
  const [resumeData, setResumeData] = useState({
    personal: { name: '', title: '', email: '', phone: '', location: '', about: '' },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    customSections: []
  });

  const [portfolioProjects, setPortfolioProjects] = useState([]);
  
  const [customization, setCustomization] = useState({
    primaryColor: '#3b82f6',
    fontFamily: 'Inter'
  });

  const previewRef = useRef(null);

  // Load external scripts for PDF generation
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    ]).catch(err => console.error('Failed to load PDF libraries:', err));
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    const savedPortfolio = localStorage.getItem('portfolioProjects');
    const savedCustomization = localStorage.getItem('customization');
    const savedImage = localStorage.getItem('profileImage');
    
    if (saved) setResumeData(JSON.parse(saved));
    if (savedPortfolio) setPortfolioProjects(JSON.parse(savedPortfolio));
    if (savedCustomization) setCustomization(JSON.parse(savedCustomization));
    if (savedImage) setProfileImage(savedImage);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem('portfolioProjects', JSON.stringify(portfolioProjects));
  }, [portfolioProjects]);

  useEffect(() => {
    localStorage.setItem('customization', JSON.stringify(customization));
  }, [customization]);

  useEffect(() => {
    if (profileImage) localStorage.setItem('profileImage', profileImage);
  }, [profileImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '', gpa: '' }]
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 50 }]
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', technologies: '' }]
    }));
  };

  const addPortfolioProject = () => {
    setPortfolioProjects(prev => [...prev, {
      id: Date.now(),
      title: '',
      description: '',
      image: '',
      liveLink: '',
      githubLink: ''
    }]);
  };

  const updateResumeField = (section, index, field, value) => {
    setResumeData(prev => {
      const newData = { ...prev };
      if (index !== undefined) {
        newData[section][index][field] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });
  };

  const deleteItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const deletePortfolioProject = (id) => {
    setPortfolioProjects(prev => prev.filter(p => p.id !== id));
  };

  const updatePortfolioProject = (id, field, value) => {
    setPortfolioProjects(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handlePortfolioImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updatePortfolioProject(id, 'image', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setResumeData({
        personal: { name: '', title: '', email: '', phone: '', location: '', about: '' },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        customSections: []
      });
      setPortfolioProjects([]);
      setProfileImage('');
      localStorage.clear();
    }
  };

  const downloadPDF = async () => {
    try {
      // Dynamically import html2canvas and jsPDF from CDN
      const html2canvas = window.html2canvas;
      const { jsPDF } = window.jspdf;

      if (!html2canvas || !jsPDF) {
        alert('PDF libraries are loading... Please try again in a moment.');
        return;
      }

      const element = previewRef.current;
      if (!element) return;

      // Show loading state
      const btn = document.querySelector('.download-btn');
      if (btn) btn.textContent = 'Generating PDF...';

      // Store original styles
      const originalMaxHeight = element.style.maxHeight;
      const originalOverflow = element.style.overflow;
      const originalFontSize = element.style.fontSize;
      
      // Apply PDF-optimized styles temporarily
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      element.style.fontSize = '16px'; // Set base font to 12px for PDF
      
      // Scale down all text elements for PDF
      const allElements = element.querySelectorAll('*');
      const originalStyles = [];
      
      allElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el);
        originalStyles[index] = {
          fontSize: el.style.fontSize,
          lineHeight: el.style.lineHeight,
          padding: el.style.padding,
          margin: el.style.margin
        };
        
        // Apply PDF-friendly sizes
        const currentSize = parseFloat(computedStyle.fontSize);
        if (currentSize) {
          // Scale down by 40% for PDF (makes it more professional)
          el.style.fontSize = `${currentSize * 0.8}px`;
        }
        
        // Adjust line heights
        if (computedStyle.lineHeight !== 'normal') {
          el.style.lineHeight = '1.5';
        }
        
        // Reduce padding/margins slightly
        const currentPadding = parseFloat(computedStyle.padding);
        if (currentPadding > 0) {
          el.style.padding = `${currentPadding * 0.7}px`;
        }
        
        const currentMargin = parseFloat(computedStyle.marginBottom);
        if (currentMargin > 0) {
          el.style.marginBottom = `${currentMargin * 0.7}px`;
        }
      });

      // Wait for layout to settle
      await new Promise(resolve => setTimeout(resolve, 200));

      // Capture the element as canvas with higher quality
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      // Restore ALL original styles
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;
      element.style.fontSize = originalFontSize;
      
      allElements.forEach((el, index) => {
        if (originalStyles[index]) {
          el.style.fontSize = originalStyles[index].fontSize;
          el.style.lineHeight = originalStyles[index].lineHeight;
          el.style.padding = originalStyles[index].padding;
          el.style.margin = originalStyles[index].margin;
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add additional pages if content is longer
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      // Download the PDF
      const fileName = resumeData.personal.name ? `${resumeData.personal.name.replace(/\s+/g, '_')}_resume.pdf` : 'resume.pdf';
      pdf.save(fileName);

      // Reset button text
      if (btn) {
        btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download PDF';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      const btn = document.querySelector('.download-btn');
      if (btn) {
        btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download PDF';
      }
    }
  };

  const templates = {
    classic: {
      name: 'Classic',
      bg: 'bg-white',
      headerBg: 'bg-gray-100',
      textColor: 'text-gray-800'
    },
    modern: {
      name: 'Modern',
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      headerBg: 'bg-white',
      textColor: 'text-gray-900'
    },
    creative: {
      name: 'Creative',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      headerBg: 'bg-white',
      textColor: 'text-gray-900'
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} transition-all duration-300`} style={{ fontFamily: customization.fontFamily }}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-lg'} shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Builder Pro
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create your perfect resume</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={downloadPDF}
              className="download-btn px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={resetAll}
              className={`p-2 rounded-lg ${darkMode ? 'bg-red-900/30 hover:bg-red-900/50' : 'bg-red-100 hover:bg-red-200'} text-red-600 transition-colors`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/60 backdrop-blur-lg'} rounded-2xl shadow-xl p-6`}>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {['resume', 'portfolio', 'templates', 'customize'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {/* Resume Tab */}
              {activeTab === 'resume' && (
                <>
                  {/* Personal Info */}
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-md`}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" style={{ color: customization.primaryColor }} />
                      Personal Information
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">Profile Photo</label>
                      <div className="flex items-center gap-4">
                        {profileImage && (
                          <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                        )}
                        <label className={`cursor-pointer px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition-colors flex items-center gap-2`}>
                          <Upload className="w-4 h-4" />
                          Upload Photo
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Full Name"
                      value={resumeData.personal.name}
                      onChange={(e) => updateResumeField('personal', undefined, 'name', e.target.value)}
                      className={`w-full p-3 mb-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    <input
                      type="text"
                      placeholder="Professional Title"
                      value={resumeData.personal.title}
                      onChange={(e) => updateResumeField('personal', undefined, 'title', e.target.value)}
                      className={`w-full p-3 mb-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={resumeData.personal.email}
                      onChange={(e) => updateResumeField('personal', undefined, 'email', e.target.value)}
                      className={`w-full p-3 mb-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={resumeData.personal.phone}
                      onChange={(e) => updateResumeField('personal', undefined, 'phone', e.target.value)}
                      className={`w-full p-3 mb-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={resumeData.personal.location}
                      onChange={(e) => updateResumeField('personal', undefined, 'location', e.target.value)}
                      className={`w-full p-3 mb-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    <textarea
                      placeholder="About Me / Professional Summary"
                      value={resumeData.personal.about}
                      onChange={(e) => updateResumeField('personal', undefined, 'about', e.target.value)}
                      rows="4"
                      className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
                    />
                  </div>

                  {/* Education */}
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-md`}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-between">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" style={{ color: customization.primaryColor }} />
                        Education
                      </span>
                      <button onClick={addEducation} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </h3>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className={`mb-4 p-4 ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} rounded-lg relative`}>
                        <button
                          onClick={() => deleteItem('education', idx)}
                          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => updateResumeField('education', idx, 'degree', e.target.value)}
                          className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateResumeField('education', idx, 'institution', e.target.value)}
                          className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Year"
                            value={edu.year}
                            onChange={(e) => updateResumeField('education', idx, 'year', e.target.value)}
                            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                          />
                          <input
                            type="text"
                            placeholder="GPA"
                            value={edu.gpa}
                            onChange={(e) => updateResumeField('education', idx, 'gpa', e.target.value)}
                            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Experience */}
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-md`}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-between">
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" style={{ color: customization.primaryColor }} />
                        Work Experience
                      </span>
                      <button onClick={addExperience} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </h3>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className={`mb-4 p-4 ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} rounded-lg relative`}>
                        <button
                          onClick={() => deleteItem('experience', idx)}
                          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => updateResumeField('experience', idx, 'title', e.target.value)}
                          className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateResumeField('experience', idx, 'company', e.target.value)}
                          className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., Jan 2020 - Present)"
                          value={exp.duration}
                          onChange={(e) => updateResumeField('experience', idx, 'duration', e.target.value)}
                          className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                        <textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => updateResumeField('experience', idx, 'description', e.target.value)}
                          rows="3"
                          className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'} resize-none`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-md`}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-between">
                      <span className="flex items-center gap-2">
                        <Code className="w-5 h-5" style={{ color: customization.primaryColor }} />
                        Skills
                      </span>
                      <button onClick={addSkill} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </h3>
                    {resumeData.skills.map((skill, idx) => (
                      <div key={idx} className={`mb-4 p-4 ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} rounded-lg relative`}>
                        <button
                          onClick={() => deleteItem('skills', idx)}
                          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Skill Name"
                          value={skill.name}
                          onChange={(e) => updateResumeField('skills', idx, 'name', e.target.value)}
                          className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => updateResumeField('skills', idx, 'level', e.target.value)}
                            className="flex-1"
                            style={{ accentColor: customization.primaryColor }}
                          />
                          <span className="text-sm font-medium">{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Projects */}
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-md`}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-between">
                      <span className="flex items-center gap-2">
                        <Award className="w-5 h-5" style={{ color: customization.primaryColor }} />
                        Projects / Achievements
                      </span>
                      <button onClick={addProject} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </h3>
                    {resumeData.projects.map((project, idx) => (
                      <div key={idx} className={`mb-4 p-4 ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} rounded-lg relative`}>
                        <button
                          onClick={() => deleteItem('projects', idx)}
                          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={project.title}
                          onChange={(e) => updateResumeField('projects', idx, 'title', e.target.value)}
                          className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                        <textarea
                          placeholder="Description"
                          value={project.description}
                          onChange={(e) => updateResumeField('projects', idx, 'description', e.target.value)}
                          rows="2"
                          className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'} resize-none`}
                        />
                        <input
                          type="text"
                          placeholder="Technologies Used"
                          value={project.technologies}
                          onChange={(e) => updateResumeField('projects', idx, 'technologies', e.target.value)}
                          className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-md`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2">
                      <Layout className="w-5 h-5" style={{ color: customization.primaryColor }} />
                      Portfolio Projects
                    </span>
                    <button onClick={addPortfolioProject} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </h3>

                  <div className="mb-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includePortfolio"
                      checked={includePortfolio}
                      onChange={(e) => setIncludePortfolio(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="includePortfolio" className="text-sm">Include portfolio in resume</label>
                  </div>

                  {portfolioProjects.map((project) => (
                    <div key={project.id} className={`mb-6 p-4 ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} rounded-lg relative`}>
                      <button
                        onClick={() => deletePortfolioProject(project.id)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {project.image && (
                        <img src={project.image} alt={project.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                      )}
                      
                      <label className={`cursor-pointer px-3 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition-colors flex items-center gap-2 justify-center mb-3`}>
                        <FileImage className="w-4 h-4" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePortfolioImageUpload(project.id, e)}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => updatePortfolioProject(project.id, 'title', e.target.value)}
                        className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                      />
                      <textarea
                        placeholder="Project Description"
                        value={project.description}
                        onChange={(e) => updatePortfolioProject(project.id, 'description', e.target.value)}
                        rows="3"
                        className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'} resize-none`}
                      />
                      <input
                        type="url"
                        placeholder="Live Link"
                        value={project.liveLink}
                        onChange={(e) => updatePortfolioProject(project.id, 'liveLink', e.target.value)}
                        className={`w-full p-2 mb-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                      />
                      <input
                        type="url"
                        placeholder="GitHub Link"
                        value={project.githubLink}
                        onChange={(e) => updatePortfolioProject(project.id, 'githubLink', e.target.value)}
                        className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Templates Tab */}
              {activeTab === 'templates' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
                  {Object.entries(templates).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      className={`w-full p-6 rounded-xl text-left transition-all ${
                        selectedTemplate === key
                          ? 'ring-4 ring-blue-500 shadow-lg'
                          : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold">{template.name}</h4>
                        {selectedTemplate === key && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className={`h-32 ${template.bg} ${template.headerBg} rounded-lg border-2 ${selectedTemplate === key ? 'border-blue-500' : 'border-gray-300'}`}>
                        <div className="p-4">
                          <div className="h-2 bg-gray-400 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Customize Tab */}
              {activeTab === 'customize' && (
                <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6 rounded-xl shadow-md space-y-6`}>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Primary Color
                    </h3>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={customization.primaryColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-16 rounded-lg cursor-pointer"
                      />
                      <div>
                        <p className="text-sm font-medium">Selected Color</p>
                        <p className="text-sm text-gray-500">{customization.primaryColor}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Type className="w-5 h-5" />
                      Font Family
                    </h3>
                    <select
                      value={customization.fontFamily}
                      onChange={(e) => setCustomization(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Lato">Lato</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Open Sans">Open Sans</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'].map(color => (
                      <button
                        key={color}
                        onClick={() => setCustomization(prev => ({ ...prev, primaryColor: color }))}
                        className={`h-12 rounded-lg transition-all ${
                          customization.primaryColor === color ? 'ring-4 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/60 backdrop-blur-lg'} rounded-2xl shadow-xl p-6 sticky top-24 h-fit`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </h3>
            </div>
            
            <div
              ref={previewRef}
              className={`${templates[selectedTemplate].bg} p-8 rounded-xl shadow-lg overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar`}
              style={{ fontFamily: customization.fontFamily }}
            >
              {/* Header Section */}
              <div className={`${templates[selectedTemplate].headerBg} p-6 rounded-xl mb-6 shadow-md`}>
                <div className="flex items-start gap-6">
                  {profileImage && (
                    <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-lg" />
                  )}
                  <div className="flex-1">
                    <h1 className={`text-3xl font-bold ${templates[selectedTemplate].textColor} mb-2`}>
                      {resumeData.personal.name || 'Your Name'}
                    </h1>
                    <p className="text-lg mb-3" style={{ color: customization.primaryColor }}>
                      {resumeData.personal.title || 'Professional Title'}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {resumeData.personal.email && <span>📧 {resumeData.personal.email}</span>}
                      {resumeData.personal.phone && <span>📱 {resumeData.personal.phone}</span>}
                      {resumeData.personal.location && <span>📍 {resumeData.personal.location}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              {resumeData.personal.about && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: customization.primaryColor }}>
                    About Me
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{resumeData.personal.about}</p>
                </div>
              )}

              {/* Experience Section */}
              {resumeData.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: customization.primaryColor }}>
                    Work Experience
                  </h2>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                        <span className="text-sm text-gray-600">{exp.duration}</span>
                      </div>
                      <p className="font-medium mb-2" style={{ color: customization.primaryColor }}>
                        {exp.company}
                      </p>
                      <p className="text-gray-700 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Section */}
              {resumeData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: customization.primaryColor }}>
                    Education
                  </h2>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold">{edu.degree}</h3>
                        <span className="text-sm text-gray-600">{edu.year}</span>
                      </div>
                      <p className="font-medium" style={{ color: customization.primaryColor }}>
                        {edu.institution}
                      </p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Section */}
              {resumeData.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: customization.primaryColor }}>
                    Skills
                  </h2>
                  <div className="space-y-3">
                    {resumeData.skills.map((skill, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${skill.level}%`,
                              backgroundColor: customization.primaryColor
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {resumeData.projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: customization.primaryColor }}>
                    Projects & Achievements
                  </h2>
                  {resumeData.projects.map((project, idx) => (
                    <div key={idx} className="mb-3">
                      <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                      <p className="text-gray-700 text-sm mb-1">{project.description}</p>
                      {project.technologies && (
                        <p className="text-sm" style={{ color: customization.primaryColor }}>
                          Technologies: {project.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Portfolio Section (if included) */}
              {includePortfolio && portfolioProjects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: customization.primaryColor }}>
                    Portfolio
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {portfolioProjects.map((project) => (
                      <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {project.image && (
                          <img src={project.image} alt={project.title} className="w-full h-32 object-cover" />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                          <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                          <div className="flex gap-3">
                            {project.liveLink && (
                              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1" style={{ color: customization.primaryColor }}>
                                <ExternalLink className="w-4 h-4" />
                                Live Demo
                              </a>
                            )}
                            {project.githubLink && (
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1" style={{ color: customization.primaryColor }}>
                                <Github className="w-4 h-4" />
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#374151' : '#f1f5f9'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${customization.primaryColor};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${customization.primaryColor}dd;
        }
      `}</style>
    </div>
  );
};

export default ResumePortfolioBuilder;