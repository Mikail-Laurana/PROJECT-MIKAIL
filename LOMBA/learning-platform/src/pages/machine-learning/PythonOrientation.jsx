import React, { useState } from 'react';
import { Play, ChevronRight, Rocket, Star, Code, Database, User, Terminal, Book, CheckCircle } from 'lucide-react';

const PythonIntroWebsite = () => {
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([true, false, false, false, false]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lessons = [
    {
      title: "Apa itu Python?",
      subtitle: "Pengenalan",
      icon: <Book className="w-5 h-5" />,
      content: {
        title: "Mengenal Bahasa Pemrograman Python",
        description: "Python adalah bahasa pemrograman tingkat tinggi yang mudah dipelajari dan sangat populer. Dibuat oleh Guido van Rossum pada tahun 1991, Python dirancang dengan filosofi 'sederhana lebih baik daripada rumit'.",
        details: [
          "Python menggunakan sintaks yang mirip dengan bahasa Inggris, membuatnya mudah dipahami",
          "Bahasa ini bersifat open source dan gratis untuk digunakan",
          "Python dapat dijalankan di berbagai platform seperti Windows, Mac, dan Linux",
          "Komunitas Python sangat besar dan aktif di seluruh dunia"
        ],
        example: "Contoh kode Python sederhana:\nprint('Hello, World!')\n\nHasilnya akan menampilkan: Hello, World!"
      }
    },
    {
      title: "Mengapa Belajar Python?",
      subtitle: "Keunggulan",
      icon: <Star className="w-5 h-5" />,
      content: {
        title: "Keunggulan dan Manfaat Python",
        description: "Python memiliki banyak keunggulan yang membuatnya menjadi pilihan utama untuk pemula maupun programmer berpengalaman. Bahasa ini digunakan oleh perusahaan besar seperti Google, Netflix, dan Instagram.",
        details: [
          "Mudah dipelajari - Sintaks yang sederhana dan jelas",
          "Versatile - Dapat digunakan untuk web development, data science, AI, automation",
          "Library yang lengkap - Ribuan library siap pakai untuk berbagai keperluan",
          "Karir yang menjanjikan - Banyak peluang kerja dengan gaji yang kompetitif",
          "Produktivitas tinggi - Dapat membuat program dengan cepat"
        ],
        example: "Bidang-bidang yang menggunakan Python:\n• Web Development (Django, Flask)\n• Data Science & Analytics\n• Artificial Intelligence & Machine Learning\n• Automation & Scripting\n• Game Development"
      }
    },
    {
      title: "Instalasi Python",
      subtitle: "Persiapan",
      icon: <Terminal className="w-5 h-5" />,
      content: {
        title: "Cara Menginstall Python",
        description: "Sebelum mulai belajar Python, Anda perlu menginstall Python di komputer. Python tersedia gratis dan dapat diunduh dari website resmi python.org.",
        details: [
          "Kunjungi website python.org dan klik tombol Download",
          "Pilih versi Python terbaru (saat ini Python 3.11 atau 3.12)",
          "Jalankan file installer dan ikuti petunjuk instalasi",
          "Pastikan mencentang opsi 'Add Python to PATH' saat instalasi",
          "Setelah selesai, buka Command Prompt/Terminal dan ketik 'python --version' untuk memverifikasi"
        ],
        example: "Cara mengecek instalasi Python:\n1. Buka Command Prompt (Windows) atau Terminal (Mac/Linux)\n2. Ketik: python --version\n3. Jika berhasil, akan muncul versi Python yang terinstall"
      }
    },
    {
      title: "Tools untuk Python",
      subtitle: "Editor & IDE",
      icon: <Code className="w-5 h-5" />,
      content: {
        title: "Tools dan Editor untuk Python",
        description: "Ada berbagai tools yang dapat digunakan untuk menulis kode Python. Dari editor sederhana hingga IDE (Integrated Development Environment) yang lengkap dengan fitur debugging dan autocompletion.",
        details: [
          "Text Editor: Notepad++, Sublime Text, Atom - Ringan dan sederhana",
          "IDE Gratis: VS Code, PyCharm Community - Fitur lengkap dan gratis",
          "IDE Professional: PyCharm Professional - Untuk development enterprise",
          "Online Editor: Replit, CodePen - Tidak perlu install, langsung coding di browser",
          "Jupyter Notebook - Ideal untuk data science dan pembelajaran interaktif"
        ],
        example: "Rekomendasi untuk pemula:\n• VS Code - Gratis, ringan, banyak extension\n• PyCharm Community - IDE khusus Python dengan fitur lengkap\n• IDLE - Bawaan Python, sederhana dan mudah digunakan"
      }
    },
    {
      title: "Quiz Pengenalan",
      subtitle: "Tes Pemahaman",
      icon: <CheckCircle className="w-5 h-5" />,
      content: {
        title: "Quiz Pengenalan Python",
        description: "Uji pemahaman Anda tentang dasar-dasar Python dengan quiz ini. Jawab semua pertanyaan dengan benar untuk menyelesaikan pembelajaran pengenalan.",
        details: [],
        example: ""
      }
    }
  ];

  const quizQuestions = [
    {
      question: "Siapa yang menciptakan bahasa pemrograman Python?",
      options: [
        "Linus Torvalds",
        "Guido van Rossum",
        "James Gosling",
        "Bjarne Stroustrup"
      ],
      correct: 1
    },
    {
      question: "Python pertama kali dirilis pada tahun berapa?",
      options: [
        "1989",
        "1990",
        "1991",
        "1992"
      ],
      correct: 2
    },
    {
      question: "Apa keunggulan utama Python dibandingkan bahasa lain?",
      options: [
        "Eksekusi paling cepat",
        "Hanya untuk web development",
        "Sintaks yang mudah dipahami",
        "Hanya bisa di Windows"
      ],
      correct: 2
    },
    {
      question: "Manakah yang BUKAN bidang penggunaan Python?",
      options: [
        "Web Development",
        "Data Science",
        "Machine Learning",
        "Semua jawaban salah"
      ],
      correct: 3
    },
    {
      question: "IDE manakah yang direkomendasikan untuk pemula?",
      options: [
        "Notepad",
        "Microsoft Word",
        "VS Code",
        "Adobe Photoshop"
      ],
      correct: 2
    }
  ];

  const handleNext = () => {
    const newCompleted = [...completedLessons];
    newCompleted[activeLesson] = true;
    setCompletedLessons(newCompleted);
    
    if (activeLesson < lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
      
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
          <p className="text-2xl text-blue-100">Pengenalan Bahasa Pemrograman</p>
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
                  } else {
                    setShowQuiz(false);
                  }
                }}
                className={`bg-white rounded-xl p-6 transition-all duration-300 ${
                  // Check if lesson is accessible
                  index === 0 || completedLessons[index - 1] 
                    ? 'cursor-pointer hover:bg-gray-50' 
                    : 'cursor-not-allowed opacity-50'
                } ${
                  activeLesson === index ? 'ring-4 ring-blue-400 bg-blue-50' : ''
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
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {lessons[activeLesson].content.title}
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {lessons[activeLesson].content.description}
            </p>

            {!showQuiz ? (
              <>
                {/* Content Details */}
                {lessons[activeLesson].content.details.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Poin Penting:</h3>
                    <ul className="space-y-3">
                      {lessons[activeLesson].content.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-lg leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Example Section */}
                {lessons[activeLesson].content.example && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Contoh & Informasi Tambahan:</h3>
                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                      <pre className="text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">
                        {lessons[activeLesson].content.example}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Interactive Tips */}
                <div className="mb-8 bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">💡 Tips untuk Pemula:</h3>
                  <p className="text-green-700 leading-relaxed">
                    {activeLesson === 0 && "Jangan terburu-buru! Python dirancang agar mudah dipelajari. Luangkan waktu untuk memahami konsep dasar sebelum melanjutkan ke topik yang lebih kompleks."}
                    {activeLesson === 1 && "Mulai dengan proyek kecil yang menarik bagi Anda. Apakah itu membuat kalkulator sederhana, game teka-teki, atau menganalisis data favorit Anda."}
                    {activeLesson === 2 && "Pastikan Python terinstall dengan benar sebelum lanjut belajar. Coba jalankan perintah sederhana seperti 'print(\"Hello World\")' untuk memastikan semuanya berfungsi."}
                    {activeLesson === 3 && "Pilih satu editor dan pelajari fitur-fiturnya dengan baik. VS Code dengan Python extension adalah pilihan yang sangat baik untuk pemula."}
                  </p>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-colors text-lg font-medium shadow-lg"
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
                            🎉 Sempurna! Anda sudah memahami dasar-dasar Python dengan baik!
                          </span>
                        ) : quizScore >= quizQuestions.length * 0.8 ? (
                          <span className="text-blue-600 font-semibold">
                            👏 Bagus! Anda sudah memahami sebagian besar konsep dasar Python!
                          </span>
                        ) : (
                          <span className="text-orange-600 font-semibold">
                            📚 Perlu review lagi. Baca ulang materi dan coba quiz sekali lagi!
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={resetQuiz}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mr-4"
                      >
                        Ulangi Quiz
                      </button>
                      <div className="text-sm text-gray-600 mt-4">
                        Selamat! Anda telah menyelesaikan pengenalan Python. 
                        Sekarang Anda siap untuk mempelajari sintaks dan konsep programming Python yang lebih mendalam.
                      </div>
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

export default PythonIntroWebsite;