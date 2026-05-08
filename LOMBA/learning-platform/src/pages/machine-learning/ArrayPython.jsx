import React, { useState } from 'react';
import { Play, ChevronRight, Rocket, Star, Code, Database, User, Terminal, Grid, FileText } from 'lucide-react';

const PythonDataStorageWebsite = () => {
  const [activeLesson, setActiveLesson] = useState(0);
  const [currentCode, setCurrentCode] = useState('# List - Array dalam Python\nangka = [1, 2, 3, 4, 5]\nprint("List angka:", angka)\nprint("Elemen pertama:", angka[0])');
  const [output, setOutput] = useState('List angka: [1, 2, 3, 4, 5]\nElemen pertama: 1');
  const [completedLessons, setCompletedLessons] = useState([true, false, false, false, false, false]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lessons = [
    {
      title: "List (Array) dalam Python",
      subtitle: "Pelajaran 1",
      icon: <Grid className="w-5 h-5" />,
      content: {
        title: "Mengenal List - Array dalam Python",
        description: "List adalah struktur data yang dapat menyimpan multiple nilai dalam satu variabel. List bersifat ordered, changeable, dan allow duplicate values. List adalah salah satu tipe data yang paling sering digunakan dalam Python.",
        code: '# List - Array dalam Python\nangka = [1, 2, 3, 4, 5]\nbuah = ["apel", "jeruk", "pisang"]\ncampur = [1, "hello", 3.14, True]\n\nprint("List angka:", angka)\nprint("List buah:", buah)\nprint("List campur:", campur)\nprint("Elemen pertama angka:", angka[0])\nprint("Elemen terakhir buah:", buah[-1])',
        output: 'List angka: [1, 2, 3, 4, 5]\nList buah: ["apel", "jeruk", "pisang"]\nList campur: [1, "hello", 3.14, True]\nElemen pertama angka: 1\nElemen terakhir buah: pisang'
      }
    },
    {
      title: "Operasi List",
      subtitle: "Pelajaran 2",
      icon: <Code className="w-5 h-5" />,
      content: {
        title: "Operasi pada List",
        description: "List memiliki berbagai method untuk manipulasi data seperti menambah, menghapus, dan mengubah elemen. Anda juga dapat melakukan slicing untuk mengambil sebagian elemen dari list.",
        code: '# Operasi List\nmakanan = ["nasi", "mie", "roti"]\n\n# Menambah elemen\nmakanan.append("sate")\nprint("Setelah append:", makanan)\n\n# Menambah di posisi tertentu\nmakanan.insert(1, "gado-gado")\nprint("Setelah insert:", makanan)\n\n# Slicing\nprint("2 elemen pertama:", makanan[:2])\nprint("2 elemen terakhir:", makanan[-2:])',
        output: 'Setelah append: ["nasi", "mie", "roti", "sate"]\nSetelah insert: ["nasi", "gado-gado", "mie", "roti", "sate"]\n2 elemen pertama: ["nasi", "gado-gado"]\n2 elemen terakhir: ["roti", "sate"]'
      }
    },
    {
      title: "Dictionary (Objek)",
      subtitle: "Pelajaran 3",
      icon: <Database className="w-5 h-5" />,
      content: {
        title: "Dictionary - Objek dalam Python",
        description: "Dictionary adalah struktur data yang menyimpan data dalam pasangan key-value. Dictionary bersifat ordered (Python 3.7+), changeable, dan tidak mengizinkan duplicate keys. Dictionary mirip dengan objek dalam bahasa pemrograman lain.",
        code: '# Dictionary dalam Python\nmahasiswa = {\n    "nama": "Alice",\n    "umur": 20,\n    "jurusan": "Informatika",\n    "ipk": 3.8\n}\n\nprint("Data mahasiswa:", mahasiswa)\nprint("Nama:", mahasiswa["nama"])\nprint("IPK:", mahasiswa.get("ipk"))\n\n# Menambah key baru\nmahasiswa["semester"] = 5\nprint("Setelah ditambah:", mahasiswa)',
        output: 'Data mahasiswa: {"nama": "Alice", "umur": 20, "jurusan": "Informatika", "ipk": 3.8}\nNama: Alice\nIPK: 3.8\nSetelah ditambah: {"nama": "Alice", "umur": 20, "jurusan": "Informatika", "ipk": 3.8, "semester": 5}'
      }
    },
    {
      title: "Tuple dan Set",
      subtitle: "Pelajaran 4",
      icon: <Terminal className="w-5 h-5" />,
      content: {
        title: "Tuple dan Set",
        description: "Tuple adalah koleksi yang ordered dan unchangeable (immutable), sedangkan Set adalah koleksi yang unordered dan unindexed. Keduanya memiliki kegunaan spesifik dalam penyimpanan data.",
        code: '# Tuple - immutable list\nkoordinat = (10, 20)\nwarna = ("merah", "hijau", "biru")\n\nprint("Koordinat:", koordinat)\nprint("Warna pertama:", warna[0])\n\n# Set - unique values\nangka_unik = {1, 2, 3, 3, 4, 4, 5}\nprint("Set angka:", angka_unik)\n\n# Operasi Set\nset_a = {1, 2, 3, 4}\nset_b = {3, 4, 5, 6}\nprint("Union:", set_a | set_b)\nprint("Intersection:", set_a & set_b)',
        output: 'Koordinat: (10, 20)\nWarna pertama: merah\nSet angka: {1, 2, 3, 4, 5}\nUnion: {1, 2, 3, 4, 5, 6}\nIntersection: {3, 4}'
      }
    },
    {
      title: "Nested Data Structures",
      subtitle: "Pelajaran 5",
      icon: <FileText className="w-5 h-5" />,
      content: {
        title: "Struktur Data Bersarang",
        description: "Python memungkinkan pembuatan struktur data kompleks dengan menggabungkan list, dictionary, tuple, dan set. Ini sangat berguna untuk menyimpan data yang lebih kompleks dan terstruktur.",
        code: '# Nested Data Structures\nsekolah = {\n    "nama": "SMA Python",\n    "kelas": [\n        {\n            "nama": "10A",\n            "siswa": ["Ali", "Budi", "Citra"],\n            "wali_kelas": "Pak Ahmad"\n        },\n        {\n            "nama": "10B", \n            "siswa": ["Dina", "Eko", "Fira"],\n            "wali_kelas": "Bu Sari"\n        }\n    ]\n}\n\nprint("Nama sekolah:", sekolah["nama"])\nprint("Kelas pertama:", sekolah["kelas"][0]["nama"])\nprint("Siswa kelas 10A:", sekolah["kelas"][0]["siswa"])',
        output: 'Nama sekolah: SMA Python\nKelas pertama: 10A\nSiswa kelas 10A: ["Ali", "Budi", "Citra"]'
      }
    },
    {
      title: "Quiz Akhir",
      subtitle: "Tes Pemahaman",
      icon: <Star className="w-5 h-5" />,
      content: {
        title: "Quiz Akhir - Penyimpanan Data Python",
        description: "Uji pemahaman Anda tentang berbagai struktur data dalam Python termasuk list, dictionary, tuple, set, dan nested structures dengan quiz ini.",
        code: '',
        output: ''
      }
    }
  ];

  const quizQuestions = [
    {
      question: "Manakah cara yang benar untuk membuat list dalam Python?",
      options: [
        "list = (1, 2, 3)",
        "list = [1, 2, 3]",
        "list = {1, 2, 3}",
        "list = {'a': 1, 'b': 2}"
      ],
      correct: 1
    },
    {
      question: "Apa perbedaan utama antara list dan tuple?",
      options: [
        "List ordered, tuple unordered",
        "List immutable, tuple mutable",
        "List mutable, tuple immutable",
        "Tidak ada perbedaan"
      ],
      correct: 2
    },
    {
      question: "Bagaimana cara mengakses nilai dalam dictionary dengan key 'nama'?",
      options: [
        "dict[0]",
        "dict.nama",
        "dict['nama']",
        "dict('nama')"
      ],
      correct: 2
    },
    {
      question: "Set dalam Python memiliki karakteristik apa?",
      options: [
        "Ordered dan allow duplicates",
        "Unordered dan allow duplicates", 
        "Ordered dan unique values",
        "Unordered dan unique values"
      ],
      correct: 3
    },
    {
      question: "Apa output dari: list1 = [1, 2]; list1.append([3, 4]); print(len(list1))?",
      options: [
        "2",
        "3", 
        "4",
        "Error"
      ],
      correct: 1
    },
    {
      question: "Manakah yang merupakan nested dictionary yang valid?",
      options: [
        "{'a': {'b': 1}}",
        "['a': ['b': 1]]",
        "('a': ('b': 1))",
        "{'a' 'b' 1}"
      ],
      correct: 0
    }
  ];

  const runCode = () => {
    try {
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
            
            // Handle different print formats
            if (content.includes(', ')) {
              const parts = content.split(', ');
              let printResult = '';
              for (let part of parts) {
                part = part.trim();
                if (part.startsWith('"') && part.endsWith('"')) {
                  printResult += part.slice(1, -1);
                } else if (variables[part]) {
                  if (Array.isArray(variables[part])) {
                    printResult += JSON.stringify(variables[part]).replace(/"/g, '"');
                  } else if (typeof variables[part] === 'object') {
                    printResult += JSON.stringify(variables[part]);
                  } else {
                    printResult += variables[part];
                  }
                }
                if (parts.indexOf(part) < parts.length - 1) printResult += ' ';
              }
              result += printResult + '\n';
            }
            // Handle f-strings and string formatting
            else if (content.startsWith('"') && content.endsWith('"')) {
              result += content.slice(1, -1) + '\n';
            }
            // Handle variable access with brackets
            else if (content.includes('[') && content.includes(']')) {
              const varMatch = content.match(/([a-zA-Z_][a-zA-Z0-9_]*)\[([^\]]+)\]/);
              if (varMatch && variables[varMatch[1]]) {
                const varName = varMatch[1];
                const index = varMatch[2];
                if (index.startsWith('"') && index.endsWith('"')) {
                  // Dictionary access
                  const key = index.slice(1, -1);
                  result += variables[varName][key] + '\n';
                } else if (index.includes(':')) {
                  // Slicing
                  const [start, end] = index.split(':');
                  const startIdx = start === '' ? 0 : parseInt(start);
                  const endIdx = end === '' ? variables[varName].length : (parseInt(end) < 0 ? variables[varName].length + parseInt(end) : parseInt(end));
                  result += JSON.stringify(variables[varName].slice(startIdx, endIdx)) + '\n';
                } else {
                  // Array index access
                  const idx = parseInt(index) < 0 ? variables[varName].length + parseInt(index) : parseInt(index);
                  result += variables[varName][idx] + '\n';
                }
              }
            }
            // Handle method calls
            else if (content.includes('.')) {
              const parts = content.split('.');
              const varName = parts[0];
              const method = parts[1];
              
              if (variables[varName] && method.includes('(')) {
                const methodName = method.split('(')[0];
                const param = method.match(/\(([^)]*)\)/)?.[1];
                
                if (methodName === 'get' && param) {
                  const key = param.replace(/"/g, '');
                  result += variables[varName][key] + '\n';
                }
              }
            }
            // Handle regular variables
            else if (variables[content]) {
              if (Array.isArray(variables[content]) || typeof variables[content] === 'object') {
                result += JSON.stringify(variables[content]) + '\n';
              } else {
                result += variables[content] + '\n';
              }
            }
            else {
              result += content + '\n';
            }
          }
        }
        // Handle variable assignments
        else if (line.includes(' = ')) {
          const [varName, varValue] = line.split(' = ', 2);
          let value = varValue.trim();
          
          // Handle list assignment
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              variables[varName.trim()] = JSON.parse(value.replace(/'/g, '"'));
            } catch {
              variables[varName.trim()] = value;
            }
          }
          // Handle dictionary assignment
          else if (value.startsWith('{') && value.endsWith('}')) {
            try {
              variables[varName.trim()] = JSON.parse(value.replace(/'/g, '"'));
            } catch {
              variables[varName.trim()] = value;
            }
          }
          // Handle tuple assignment
          else if (value.startsWith('(') && value.endsWith(')')) {
            try {
              const tupleContent = value.slice(1, -1);
              variables[varName.trim()] = tupleContent.split(',').map(item => {
                item = item.trim();
                if (item.startsWith('"') && item.endsWith('"')) {
                  return item.slice(1, -1);
                } else if (!isNaN(item)) {
                  return Number(item);
                }
                return item;
              });
            } catch {
              variables[varName.trim()] = value;
            }
          }
          // Handle set assignment
          else if (value.match(/^\{.*\}$/) && !value.includes(':')) {
            variables[varName.trim()] = value;
          }
          // Handle string assignment
          else if (value.startsWith('"') && value.endsWith('"')) {
            variables[varName.trim()] = value.slice(1, -1);
          }
          // Handle number assignment
          else if (!isNaN(value)) {
            variables[varName.trim()] = Number(value);
          }
          // Handle boolean assignment
          else if (value === 'True' || value === 'False') {
            variables[varName.trim()] = value === 'True';
          }
          else {
            variables[varName.trim()] = value;
          }
        }
        // Handle method calls on variables
        else if (line.includes('.append(')) {
          const match = line.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.append\(([^)]+)\)/);
          if (match && variables[match[1]]) {
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            } else if (!isNaN(value)) {
              value = Number(value);
            }
            variables[match[1]].push(value);
          }
        }
        else if (line.includes('.insert(')) {
          const match = line.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.insert\(([^,]+),\s*([^)]+)\)/);
          if (match && variables[match[1]]) {
            const index = parseInt(match[2]);
            let value = match[3].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            }
            variables[match[1]].splice(index, 0, value);
          }
        }
        // Handle dictionary key assignment
        else if (line.includes('[') && line.includes(']') && line.includes(' = ')) {
          const match = line.match(/([a-zA-Z_][a-zA-Z0-9_]*)\[([^\]]+)\]\s*=\s*(.+)/);
          if (match && variables[match[1]]) {
            const key = match[2].replace(/"/g, '');
            let value = match[3].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            } else if (!isNaN(value)) {
              value = Number(value);
            }
            variables[match[1]][key] = value;
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
      
      if (activeLesson + 1 === 5) { // Quiz lesson
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
      newCompleted[5] = true;
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-8 h-8 bg-cyan-400 rounded-full opacity-80"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-40 left-1/4 w-4 h-4 bg-emerald-300 rounded-full opacity-70"></div>
        <div className="absolute bottom-20 right-10 w-10 h-10 bg-orange-400 rounded-full opacity-50"></div>
        <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-pink-400 rounded-full opacity-60"></div>
        
        {/* Data structure icons */}
        <div className="absolute top-16 right-16">
          <Database className="w-12 h-12 text-cyan-400 transform rotate-12" />
        </div>
        <div className="absolute top-32 left-20">
          <Grid className="w-10 h-10 text-white opacity-70" />
        </div>
        <div className="absolute bottom-32 left-16">
          <FileText className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>
        
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <Star 
            key={i} 
            className={`absolute w-3 h-3 text-yellow-300 opacity-${Math.random() > 0.5 ? '70' : '40'}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">Python</h1>
          <p className="text-2xl text-purple-200">Penyimpanan Data</p>
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
                  if (index === 5) {
                    setShowQuiz(true);
                    setCurrentCode('');
                    setOutput('');
                  } else {
                    setShowQuiz(false);
                    setCurrentCode(lesson.content.code);
                    setOutput(lesson.content.output);
                  }
                }}
                className={`bg-gray-100 rounded-xl p-6 transition-all duration-300 ${
                  // Check if lesson is accessible
                  index === 0 || completedLessons[index - 1] 
                    ? 'cursor-pointer hover:bg-gray-50 hover:shadow-lg' 
                    : 'cursor-not-allowed opacity-50'
                } ${
                  activeLesson === index ? 'ring-4 ring-purple-400 bg-white shadow-lg' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {completedLessons[index] ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    ) : index === 0 || completedLessons[index - 1] ? (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
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
                <div className="bg-indigo-200 rounded-lg px-3 py-2 inline-block">
                  <span className="text-indigo-800 text-sm font-medium">{lesson.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {lessons[activeLesson].content.title}
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {lessons[activeLesson].content.description}
            </p>

            {!showQuiz ? (
              <>
                {/* Code Editor */}
                <div className="bg-gray-800 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
                    <span className="text-white font-medium">Main.py</span>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex">
                      <div className="text-gray-400 mr-4 select-none font-mono">
                        {currentCode.split('\n').map((_, i) => (
                          <div key={i} className="leading-6">{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        value={currentCode}
                        onChange={(e) => setCurrentCode(e.target.value)}
                        className="bg-transparent text-white font-mono flex-1 outline-none resize-none leading-6"
                        rows={Math.max(6, currentCode.split('\n').length)}
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
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
                    >
                      <Play className="w-4 h-4" />
                      Jalankan
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 min-h-32 border-2 border-gray-200 shadow-inner">
                    <pre className="text-gray-800 font-mono whitespace-pre-wrap text-sm">
                      {output}
                    </pre>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all text-lg font-medium shadow-lg"
                  >
                    {activeLesson === 4 ? 'Mulai Quiz' : 'Berikutnya'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              /* Quiz Section */
              <div className="space-y-6">
                {!quizCompleted ? (
                  <>
                    <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500 shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}
                        </h3>
                        <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
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
                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                : 'border-gray-300 hover:border-purple-300 hover:bg-purple-25'
                            }`}
                          >
                            <span className="font-medium mr-3 text-purple-700">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={submitQuizAnswer}
                        disabled={selectedAnswer === ''}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          selectedAnswer === ''
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                        }`}
                      >
                        {currentQuestion === quizQuestions.length - 1 ? 'Selesai' : 'Lanjut'}
                      </button>
                    </div>
                  </>
                ) : (
                  /* Quiz Results */
                  <div className="bg-green-50 rounded-xl p-8 border-l-4 border-green-500 text-center shadow-md">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-12 h-12 text-white" fill="currentColor" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">
                        Quiz Selesai!
                      </h3>
                      <p className="text-xl text-gray-600 mb-4">
                        Skor Anda: {quizScore}/{quizQuestions.length}
                      </p>
                      <div className="text-lg">
                        {quizScore === quizQuestions.length ? (
                          <span className="text-green-600 font-semibold">
                            🎉 Sempurna! Anda menguasai penyimpanan data Python dengan baik!
                          </span>
                        ) : quizScore >= quizQuestions.length * 0.8 ? (
                          <span className="text-blue-600 font-semibold">
                            👏 Bagus! Anda sudah memahami sebagian besar konsep penyimpanan data!
                          </span>
                        ) : (
                          <span className="text-orange-600 font-semibold">
                            📚 Perlu belajar lagi. Ulangi materi tentang list, dictionary, tuple, dan set!
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={resetQuiz}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md"
                      >
                        Ulangi Quiz
                      </button>
                      <button
                        onClick={() => {
                          setActiveLesson(0);
                          setShowQuiz(false);
                          setCurrentCode(lessons[0].content.code);
                          setOutput(lessons[0].content.output);
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md"
                      >
                        Kembali ke Awal
                      </button>
                    </div>
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

export default PythonDataStorageWebsite;