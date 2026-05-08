import React, { useState } from 'react';
import { Play, ChevronRight, Rocket, Star, Code, Database, User, Terminal } from 'lucide-react';

const PythonFunctionLearningWebsite = () => {
  const [activeLesson, setActiveLesson] = useState(0);
  const [currentCode, setCurrentCode] = useState('def salam():\n    print("Halo dari fungsi!")\n\nsalam()');
  const [output, setOutput] = useState('Halo dari fungsi!');
  const [completedLessons, setCompletedLessons] = useState([true, false, false, false, false]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lessons = [
    {
      title: "Pengenalan Function",
      subtitle: "Pelajaran 1",
      icon: <Code className="w-5 h-5" />,
      content: {
        title: "Mengenal Function dalam Python",
        description: "Function adalah blok kode yang dapat digunakan kembali untuk melakukan tugas tertentu. Function membantu membuat kode lebih terorganisir, mudah dibaca, dan menghindari pengulangan kode yang sama.",
        code: 'def salam():\n    print("Halo dari fungsi!")\n\nsalam()',
        output: 'Halo dari fungsi!'
      }
    },
    {
      title: "Function dengan Parameter",
      subtitle: "Pelajaran 2",
      icon: <Terminal className="w-5 h-5" />,
      content: {
        title: "Function dengan Parameter dan Argumen",
        description: "Parameter memungkinkan function menerima input dari luar. Dengan parameter, function menjadi lebih fleksibel karena dapat bekerja dengan data yang berbeda-beda setiap kali dipanggil.",
        code: 'def salam_personal(nama):\n    print(f"Halo, {nama}!")\n\ndef tambah(a, b):\n    hasil = a + b\n    print(f"{a} + {b} = {hasil}")\n\nsalam_personal("Alice")\ntambah(5, 3)',
        output: 'Halo, Alice!\n5 + 3 = 8'
      }
    },
    {
      title: "Return Statement",
      subtitle: "Pelajaran 3",
      icon: <Database className="w-5 h-5" />,
      content: {
        title: "Mengembalikan Nilai dengan Return",
        description: "Statement return memungkinkan function mengembalikan nilai ke pemanggil. Ini berguna ketika kita ingin menggunakan hasil perhitungan function untuk operasi lain atau menyimpannya dalam variabel.",
        code: 'def kali(x, y):\n    return x * y\n\ndef luas_persegi(sisi):\n    return sisi * sisi\n\nhasil_kali = kali(4, 6)\nluas = luas_persegi(5)\n\nprint(f"4 × 6 = {hasil_kali}")\nprint(f"Luas persegi = {luas}")',
        output: '4 × 6 = 24\nLuas persegi = 25'
      }
    },
    {
      title: "Default Parameter & Scope",
      subtitle: "Pelajaran 4",
      icon: <Code className="w-5 h-5" />,
      content: {
        title: "Default Parameter dan Variable Scope",
        description: "Default parameter memberikan nilai default jika argumen tidak diberikan. Variable scope menentukan dimana variabel dapat diakses - variabel lokal hanya ada di dalam function, sedangkan variabel global dapat diakses dari mana saja.",
        code: 'def perkenalan(nama, umur=25):\n    return f"Nama: {nama}, Umur: {umur}"\n\n# Global variable\ncounter = 0\n\ndef increment():\n    global counter\n    counter += 1\n    return counter\n\nprint(perkenalan("Bob"))\nprint(perkenalan("Alice", 30))\nprint(f"Counter: {increment()}")',
        output: 'Nama: Bob, Umur: 25\nNama: Alice, Umur: 30\nCounter: 1'
      }
    },
    {
      title: "Quiz Akhir",
      subtitle: "Tes Pemahaman",
      icon: <Star className="w-5 h-5" />,
      content: {
        title: "Quiz Akhir - Function Python",
        description: "Uji pemahaman Anda tentang materi function dalam Python dengan quiz ini. Jawab semua pertanyaan dengan benar untuk menyelesaikan pembelajaran.",
        code: '',
        output: ''
      }
    }
  ];

  const quizQuestions = [
    {
      question: "Apa kegunaan utama dari function dalam Python?",
      options: [
        "Menyimpan data dalam variabel",
        "Membuat kode yang dapat digunakan kembali",
        "Menampilkan output ke layar",
        "Menerima input dari pengguna"
      ],
      correct: 1
    },
    {
      question: "Keyword apa yang digunakan untuk mendefinisikan function?",
      options: [
        "function",
        "def",
        "create",
        "make"
      ],
      correct: 1
    },
    {
      question: "Apa fungsi dari statement 'return' dalam function?",
      options: [
        "Menampilkan output",
        "Menghentikan program",
        "Mengembalikan nilai ke pemanggil",
        "Membuat variabel baru"
      ],
      correct: 2
    },
    {
      question: "Bagaimana cara memanggil function bernama 'hitung' dengan parameter 5?",
      options: [
        "call hitung(5)",
        "hitung(5)",
        "run hitung(5)",
        "execute hitung(5)"
      ],
      correct: 1
    },
    {
      question: "Apa itu default parameter?",
      options: [
        "Parameter yang tidak bisa diubah",
        "Parameter yang harus selalu diberikan",
        "Parameter yang memiliki nilai default",
        "Parameter yang bersifat global"
      ],
      correct: 2
    }
  ];

  const runCode = () => {
    try {
      let result = '';
      const lines = currentCode.split('\n');
      const variables = {};
      const functions = {};
      let globalCounter = 0;
      
      // First pass: collect function definitions
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trim();
        if (line.startsWith('def ')) {
          const funcMatch = line.match(/def\s+(\w+)\s*\(([^)]*)\)\s*:/);
          if (funcMatch) {
            const funcName = funcMatch[1];
            const paramsStr = funcMatch[2].trim();
            const params = paramsStr ? paramsStr.split(',').map(p => p.trim()) : [];
            
            const funcBody = [];
            i++; // Move to next line
            while (i < lines.length && (lines[i].startsWith('    ') || lines[i].trim() === '')) {
              if (lines[i].trim()) {
                funcBody.push(lines[i].replace(/^    /, '')); // Remove indentation
              }
              i++;
            }
            i--; // Back up one line
            
            functions[funcName] = { params, body: funcBody };
          }
        }
        i++;
      }
      
      // Second pass: execute non-function code
      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#') || line.startsWith('def ') || line.startsWith('    ')) continue;
        
        // Handle global variable declaration
        if (line === 'counter = 0') {
          variables.counter = 0;
          globalCounter = 0;
          continue;
        }
        
        // Handle function calls
        const funcCallMatch = line.match(/^(\w+)\s*\(([^)]*)\)$/);
        if (funcCallMatch && functions[funcCallMatch[1]]) {
          const funcName = funcCallMatch[1];
          const argsStr = funcCallMatch[2].trim();
          const args = argsStr ? argsStr.split(',').map(arg => {
            arg = arg.trim();
            if (arg.startsWith('"') && arg.endsWith('"')) {
              return arg.slice(1, -1);
            }
            if (arg.match(/^\d+$/)) {
              return parseInt(arg);
            }
            if (arg.match(/^\d+\.\d+$/)) {
              return parseFloat(arg);
            }
            return variables[arg] || arg;
          }) : [];
          
          result += executeFunction(funcName, args, functions, variables) + '\n';
        }
        
        // Handle variable assignments from function calls
        else if (line.includes(' = ') && line.includes('(')) {
          const [varName, funcCall] = line.split(' = ');
          const funcCallMatch = funcCall.trim().match(/^(\w+)\s*\(([^)]*)\)$/);
          
          if (funcCallMatch && functions[funcCallMatch[1]]) {
            const funcName = funcCallMatch[1];
            const argsStr = funcCallMatch[2].trim();
            const args = argsStr ? argsStr.split(',').map(arg => {
              arg = arg.trim();
              if (arg.startsWith('"') && arg.endsWith('"')) {
                return arg.slice(1, -1);
              }
              if (arg.match(/^\d+$/)) {
                return parseInt(arg);
              }
              return variables[arg] || arg;
            }) : [];
            
            const funcResult = executeFunction(funcName, args, functions, variables);
            if (funcResult !== null && !funcResult.includes('\n')) {
              variables[varName.trim()] = funcResult;
            }
          }
        }
        
        // Handle print statements
        else if (line.startsWith('print(')) {
          const match = line.match(/print\((.*)\)/);
          if (match) {
            let content = match[1];
            
            // Handle f-strings
            if (content.startsWith('f"') && content.endsWith('"')) {
              content = content.slice(2, -1);
              content = content.replace(/\{([^}]+)\}/g, (match, expr) => {
                if (variables[expr] !== undefined) {
                  return variables[expr];
                }
                return match;
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
          }
        }
      }
      
      function executeFunction(funcName, args, functions, variables) {
        const func = functions[funcName];
        if (!func) return '';
        
        const localVars = { ...variables };
        
        // Handle special case for increment function
        if (funcName === 'increment') {
          globalCounter++;
          variables.counter = globalCounter;
          return globalCounter.toString();
        }
        
        // Assign parameters
        func.params.forEach((param, index) => {
          let paramName = param;
          let defaultValue = null;
          
          // Handle default parameters
          if (param.includes('=')) {
            [paramName, defaultValue] = param.split('=').map(s => s.trim());
            if (defaultValue.match(/^\d+$/)) {
              defaultValue = parseInt(defaultValue);
            }
          }
          
          if (index < args.length) {
            localVars[paramName] = args[index];
          } else if (defaultValue !== null) {
            localVars[paramName] = defaultValue;
          }
        });
        
        let funcResult = '';
        let returnValue = null;
        
        for (let bodyLine of func.body) {
          bodyLine = bodyLine.trim();
          if (!bodyLine || bodyLine.startsWith('#')) continue;
          
          // Handle return statements
          if (bodyLine.startsWith('return ')) {
            const returnExpr = bodyLine.replace('return ', '');
            
            // Handle mathematical expressions
            if (returnExpr.includes('*')) {
              const [a, b] = returnExpr.split('*').map(s => s.trim());
              const valA = localVars[a] || parseInt(a) || 0;
              const valB = localVars[b] || parseInt(b) || 0;
              returnValue = valA * valB;
            }
            else if (returnExpr.includes('+')) {
              const [a, b] = returnExpr.split('+').map(s => s.trim());
              const valA = localVars[a] || parseInt(a) || 0;
              const valB = localVars[b] || parseInt(b) || 0;
              returnValue = valA + valB;
            }
            // Handle f-strings in return
            else if (returnExpr.startsWith('f"') && returnExpr.endsWith('"')) {
              let content = returnExpr.slice(2, -1);
              content = content.replace(/\{([^}]+)\}/g, (match, varName) => {
                return localVars[varName] || match;
              });
              returnValue = content;
            }
            else if (localVars[returnExpr] !== undefined) {
              returnValue = localVars[returnExpr];
            }
            else if (returnExpr.match(/^\d+$/)) {
              returnValue = parseInt(returnExpr);
            }
            break;
          }
          
          // Handle variable assignments
          else if (bodyLine.includes(' = ')) {
            const [varName, expr] = bodyLine.split(' = ').map(s => s.trim());
            
            if (expr.includes('+')) {
              const [a, b] = expr.split('+').map(s => s.trim());
              const valA = localVars[a] || parseInt(a) || 0;
              const valB = localVars[b] || parseInt(b) || 0;
              localVars[varName] = valA + valB;
            }
            else if (expr.includes('*')) {
              const [a, b] = expr.split('*').map(s => s.trim());
              const valA = localVars[a] || parseInt(a) || 0;
              const valB = localVars[b] || parseInt(b) || 0;
              localVars[varName] = valA * valB;
            }
            else if (localVars[expr] !== undefined) {
              localVars[varName] = localVars[expr];
            }
            else if (expr.match(/^\d+$/)) {
              localVars[varName] = parseInt(expr);
            }
            else if (expr.startsWith('"') && expr.endsWith('"')) {
              localVars[varName] = expr.slice(1, -1);
            }
          }
          
          // Handle print statements
          else if (bodyLine.startsWith('print(')) {
            const match = bodyLine.match(/print\((.*)\)/);
            if (match) {
              let content = match[1];
              
              if (content.startsWith('f"') && content.endsWith('"')) {
                content = content.slice(2, -1);
                content = content.replace(/\{([^}]+)\}/g, (match, varName) => {
                  return localVars[varName] || match;
                });
                funcResult += content;
              }
              else if (content.startsWith('"') && content.endsWith('"')) {
                funcResult += content.slice(1, -1);
              }
              else if (localVars[content] !== undefined) {
                funcResult += localVars[content];
              }
            }
          }
        }
        
        return returnValue !== null ? returnValue : funcResult;
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
          <p className="text-2xl text-blue-100">Function & Procedures</p>
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
                className={`bg-white rounded-xl p-6 transition-all duration-300 shadow-md ${
                  // Check if lesson is accessible
                  index === 0 || completedLessons[index - 1] 
                    ? 'cursor-pointer hover:shadow-lg' 
                    : 'cursor-not-allowed opacity-50'
                } ${
                  activeLesson === index ? 'ring-4 ring-blue-300' : ''
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
                <div className="bg-blue-100 rounded-lg px-3 py-2 inline-block">
                  <span className="text-blue-800 text-sm font-medium">{lesson.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {lessons[activeLesson].content.title}
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {lessons[activeLesson].content.description}
            </p>

            {!showQuiz ? (
              <>
                {/* Code Editor */}
                <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
                  <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Jalankan
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 min-h-24 border">
                    <pre className="text-gray-800 font-mono whitespace-pre-wrap">
                      {output}
                    </pre>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-colors text-lg font-medium"
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
                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}
                        </h3>
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
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
                  <div className="bg-green-50 rounded-xl p-8 border-l-4 border-green-500 text-center">
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
                            🎉 Sempurna! Anda menguasai function dengan baik!
                          </span>
                        ) : quizScore >= quizQuestions.length * 0.8 ? (
                          <span className="text-blue-600 font-semibold">
                            👏 Bagus! Anda sudah memahami sebagian besar materi function!
                          </span>
                        ) : (
                          <span className="text-orange-600 font-semibold">
                            📚 Perlu belajar lagi. Ulangi materi function dan coba quiz lagi!
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

export default PythonFunctionLearningWebsite;