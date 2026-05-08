import React, { useState } from 'react';
import { Play, ChevronRight, Rocket, Star, Code, Database, User, Terminal } from 'lucide-react';

const PythonLearningWebsite = () => {
  const [activeLesson, setActiveLesson] = useState(0);
  const [currentCode, setCurrentCode] = useState('print("hello world")');
  const [output, setOutput] = useState('hello world');
  const [completedLessons, setCompletedLessons] = useState([true, false, false, false, false]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lessons = [
    {
      title: "Run Your First Program",
      subtitle: "Pelajaran 1",
      icon: <Play className="w-5 h-5" />,
      content: {
        title: "Menjalankan Kode Program Pertama",
        description: "Menulis kode program artinya Anda menuliskan serangkaian instruksi untuk dijalankan oleh komputer. Serangkaian instruksi tersebut dibuat dalam bentuk sintaks kode, Anda sudah mengetahui sintaks kode berikut dari materi sebelumnya.",
        code: 'print("hello world")',
        output: 'hello world'
      }
    },
    {
      title: "Variable and Assignment",
      subtitle: "Pelajaran 2",
      icon: <Code className="w-5 h-5" />,
      content: {
        title: "Variabel dan Assignment",
        description: "Variabel adalah wadah untuk menyimpan data. Dalam Python, Anda dapat membuat variabel dengan memberikan nama dan nilai. Assignment adalah proses memberikan nilai kepada variabel.",
        code: 'nama = "Python"\numur = 30\nprint(f"Bahasa: {nama}, Umur: {umur} tahun")',
        output: 'Bahasa: Python, Umur: 30 tahun'
      }
    },
    {
      title: "Input & Output",
      subtitle: "Pelajaran 3",
      icon: <Terminal className="w-5 h-5" />,
      content: {
        title: "Input dan Output",
        description: "Input memungkinkan program menerima data dari pengguna, sedangkan output menampilkan hasil. Fungsi input() digunakan untuk menerima masukan, dan print() untuk menampilkan output.",
        code: '# Simulasi input\nnama = "Alice"\nprint(f"Halo, {nama}!")\nprint("Selamat datang di Python")',
        output: 'Halo, Alice!\nSelamat datang di Python'
      }
    },
    {
      title: "Tipe Data",
      subtitle: "Pelajaran 4",
      icon: <Database className="w-5 h-5" />,
      content: {
        title: "Tipe Data dalam Python",
        description: "Python memiliki berbagai tipe data seperti string, integer, float, boolean, dan list. Setiap tipe data memiliki karakteristik dan kegunaan yang berbeda dalam pemrograman.",
        code: 'angka = 42\nteks = "Hello"\ndesimal = 3.14\nbenar = True\nlist_data = [1, 2, 3]\n\nprint(f"Integer: {angka}")\nprint(f"String: {teks}")\nprint(f"Float: {desimal}")',
        output: 'Integer: 42\nString: Hello\nFloat: 3.14'
      }
    },
    {
      title: "Quiz Akhir",
      subtitle: "Tes Pemahaman",
      icon: <Star className="w-5 h-5" />,
      content: {
        title: "Quiz Akhir - Inisialisasi Data Python",
        description: "Uji pemahaman Anda tentang materi inisialisasi data dalam Python dengan quiz ini. Jawab semua pertanyaan dengan benar untuk menyelesaikan pembelajaran.",
        code: '',
        output: ''
      }
    }
  ];

  const quizQuestions = [
    {
      question: "Apa fungsi dari perintah print() dalam Python?",
      options: [
        "Menerima input dari pengguna",
        "Menampilkan output ke layar",
        "Membuat variabel baru",
        "Menghitung operasi matematika"
      ],
      correct: 1
    },
    {
      question: "Manakah cara yang benar untuk membuat variabel dalam Python?",
      options: [
        "var nama = 'Python'",
        "nama := 'Python'",
        "nama = 'Python'",
        "create nama = 'Python'"
      ],
      correct: 2
    },
    {
      question: "Tipe data apa yang digunakan untuk menyimpan angka desimal?",
      options: [
        "int",
        "string",
        "boolean",
        "float"
      ],
      correct: 3
    },
    {
      question: "Apa output dari kode: print(type(42))?",
      options: [
        "<class 'str'>",
        "<class 'int'>",
        "<class 'float'>",
        "<class 'bool'>"
      ],
      correct: 1
    },
    {
      question: "Manakah yang merupakan tipe data boolean dalam Python?",
      options: [
        "true/false",
        "True/False",
        "1/0",
        "yes/no"
      ],
      correct: 1
    }
  ];

  const runCode = () => {
    try {
      // Simple Python-like interpreter for basic operations
      let result = '';
      const lines = currentCode.split('\n');
      const variables = {};
      
      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;
        
        // Handle print statements
        if (line.startsWith('print(')) {
          const match = line.match(/print\((.*)\)/);
          if (match) {
            let content = match[1];
            
            // Handle f-strings
            if (content.startsWith('f"') && content.endsWith('"')) {
              content = content.slice(2, -1);
              content = content.replace(/\{([^}]+)\}/g, (match, varName) => {
                return variables[varName] || match;
              });
              result += content + '\n';
            }
            // Handle regular strings
            else if (content.startsWith('"') && content.endsWith('"')) {
              result += content.slice(1, -1) + '\n';
            }
            // Handle variables
            else if (variables[content]) {
              result += variables[content] + '\n';
            }
            // Handle type() function
            else if (content.startsWith('type(')) {
              const typeMatch = content.match(/type\(([^)]+)\)/);
              if (typeMatch) {
                const value = typeMatch[1];
                if (value.match(/^\d+$/)) {
                  result += "<class 'int'>\n";
                } else if (value.match(/^\d+\.\d+$/)) {
                  result += "<class 'float'>\n";
                } else if (value.startsWith('"') && value.endsWith('"')) {
                  result += "<class 'str'>\n";
                } else if (value === 'True' || value === 'False') {
                  result += "<class 'bool'>\n";
                } else if (variables[value] !== undefined) {
                  const varValue = variables[value];
                  if (typeof varValue === 'number' && Number.isInteger(varValue)) {
                    result += "<class 'int'>\n";
                  } else if (typeof varValue === 'number') {
                    result += "<class 'float'>\n";
                  } else if (typeof varValue === 'string') {
                    result += "<class 'str'>\n";
                  } else if (typeof varValue === 'boolean') {
                    result += "<class 'bool'>\n";
                  }
                }
              }
            }
            else {
              result += content + '\n';
            }
          }
        }
        // Handle variable assignments
        else if (line.includes(' = ')) {
          const [varName, varValue] = line.split(' = ');
          let value = varValue.trim();
          
          if (value.startsWith('"') && value.endsWith('"')) {
            variables[varName.trim()] = value.slice(1, -1);
          } else if (value === 'True') {
            variables[varName.trim()] = true;
          } else if (value === 'False') {
            variables[varName.trim()] = false;
          } else if (value.match(/^\d+$/)) {
            variables[varName.trim()] = parseInt(value);
          } else if (value.match(/^\d+\.\d+$/)) {
            variables[varName.trim()] = parseFloat(value);
          } else if (value.startsWith('[') && value.endsWith(']')) {
            variables[varName.trim()] = value;
          } else {
            variables[varName.trim()] = value;
          }
        }
      }
      
      setOutput(result.trim() || 'No output');
    } catch (error) {
      setOutput('Error: ' + error.message);
    }
  };

  const handleNext = () => {
    const newCompleted = [...completedLessons];
    newCompleted[activeLesson] = true;
    setCompletedLessons(newCompleted);
    
    if (activeLesson < lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
      const nextLesson = lessons[activeLesson + 1];
      setCurrentCode(nextLesson.content.code);
      setOutput(nextLesson.content.output);
      
      if (activeLesson + 1 === 4) { // Quiz lesson
        setShowQuiz(true);
      }
    }
  };

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitQuizAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setQuizScore(quizScore + 1);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setQuizCompleted(true);
      const newCompleted = [...completedLessons];
      newCompleted[4] = true;
      setCompletedLessons(newCompleted);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="min-h-screen bg-blue-600">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">Python</h1>
          <p className="text-2xl text-blue-200">Inisialisasi Data</p>
        </div>

        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <div className="w-80 space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                onClick={() => {
                  // Check if this lesson is accessible
                  const isAccessible = index === 0 || completedLessons[index - 1];
                  if (!isAccessible) return;
                  
                  setActiveLesson(index);
                  if (index === 4) {
                    setShowQuiz(true);
                    setCurrentCode('');
                    setOutput('');
                  } else {
                    setShowQuiz(false);
                    setCurrentCode(lesson.content.code);
                    setOutput(lesson.content.output);
                  }
                }}
                className={`bg-gray-300 rounded-xl p-6 transition-all duration-300 ${
                  // Check if lesson is accessible
                  index === 0 || completedLessons[index - 1] 
                    ? 'cursor-pointer hover:bg-gray-200' 
                    : 'cursor-not-allowed opacity-50'
                } ${
                  activeLesson === index ? 'ring-4 ring-blue-400 bg-gray-200' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {completedLessons[index] ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    ) : index === 0 || completedLessons[index - 1] ? (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      </div>
                    )}
                    {lesson.icon}
                  </div>
                  {!(index === 0 || completedLessons[index - 1]) && (
                    <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      Terkunci
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{lesson.title}</h3>
                <div className="bg-purple-200 rounded-lg px-3 py-2 inline-block">
                  <span className="text-purple-800 text-sm font-medium">{lesson.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-200 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {lessons[activeLesson].content.title}
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {lessons[activeLesson].content.description}
            </p>

            {!showQuiz ? (
              <>
                {/* Code Editor */}
                <div className="bg-gray-700 rounded-xl overflow-hidden mb-6">
                  <div className="bg-gray-600 px-4 py-2 flex items-center justify-between">
                    <span className="text-white font-medium">Main.py</span>
                  </div>
                  <div className="p-4">
                    <div className="flex">
                      <div className="text-gray-400 mr-4 select-none">
                        {currentCode.split('\n').map((_, i) => (
                          <div key={i} className="leading-6">{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        value={currentCode}
                        onChange={(e) => setCurrentCode(e.target.value)}
                        className="bg-transparent text-white font-mono flex-1 outline-none resize-none leading-6"
                        rows={Math.max(4, currentCode.split('\n').length)}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Output Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Output</h3>
                    <button
                      onClick={runCode}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Jalankan
                    </button>
                  </div>
                  <div className="bg-white rounded-xl p-4 min-h-24 border">
                    <pre className="text-gray-800 font-mono whitespace-pre-wrap">
                      {output}
                    </pre>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-colors text-lg font-medium"
                  >
                    {activeLesson === 3 ? 'Mulai Quiz' : 'Berikutnya'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              /* Quiz Section */
              <div className="space-y-6">
                {!quizCompleted ? (
                  <>
                    <div className="bg-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}
                        </h3>
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                          Skor: {quizScore}/{quizQuestions.length}
                        </div>
                      </div>
                      <p className="text-lg text-gray-700 mb-6">
                        {quizQuestions[currentQuestion].question}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              selectedAnswer === index
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <span className="font-medium mr-3">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={submitQuizAnswer}
                        disabled={selectedAnswer === ''}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          selectedAnswer === ''
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {currentQuestion === quizQuestions.length - 1 ? 'Selesai' : 'Lanjut'}
                      </button>
                    </div>
                  </>
                ) : (
                  /* Quiz Results */
                  <div className="bg-green-100 rounded-xl p-8 border-l-4 border-green-500 text-center">
                    <div className="mb-6">
                      <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">
                        Quiz Selesai!
                      </h3>
                      <p className="text-xl text-gray-600 mb-4">
                        Skor Anda: {quizScore}/{quizQuestions.length}
                      </p>
                      <div className="text-lg">
                        {quizScore === quizQuestions.length ? (
                          <span className="text-green-600 font-semibold">
                            🎉 Sempurna! Anda menguasai materi dengan baik!
                          </span>
                        ) : quizScore >= quizQuestions.length * 0.8 ? (
                          <span className="text-blue-600 font-semibold">
                            👏 Bagus! Anda sudah memahami sebagian besar materi!
                          </span>
                        ) : (
                          <span className="text-orange-600 font-semibold">
                            📚 Perlu belajar lagi. Ulangi materi dan coba quiz lagi!
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={resetQuiz}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Ulangi Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonLearningWebsite;