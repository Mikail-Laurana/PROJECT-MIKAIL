from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Data
nama = "Alfath"
nama_pkl = "CV Enuma Technology"
bidang = "Pengembangan Perangkat Lunak dan Gim"
lokasi = "Daratan, RT.02/RW.06, Senden, Tohudan, Kec. Colomadu, Kabupaten Karanganyar, Jawa Tengah 57173"
bahasa = "HTML, CSS, JavaScript, Python"
penggunaan = "Pengembangan Website"
proses = "Membuat struktur → Membuat sketsa → Membuat website → Finishing"
kolaborasi = "GitHub"
workflow = "Tidak ada workflow formal"
debugging = "Tidak ada proses debugging khusus"

# Buat presentasi
prs = Presentation()

# Fungsi tambah slide judul
def add_title_slide(title, subtitle):
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    slide.shapes.title.text = title
    slide.placeholders[1].text = subtitle

# Fungsi tambah slide konten bullet
def add_bullet_slide(title, bullet_points):
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = title
    body_shape = slide.shapes.placeholders[1]
    tf = body_shape.text_frame
    for i, point in enumerate(bullet_points):
        if i == 0:
            tf.text = point
        else:
            tf.add_paragraph().text = point

# Slide 1 - Cover
add_title_slide("Laporan PKL", f"Observasi Pemrograman Teks\n{nama}\n{nama_pkl}")

# Slide 2 - Profil Tempat PKL
add_bullet_slide("Profil Tempat PKL", [
    f"Nama: {nama_pkl}",
    f"Bidang: {bidang}",
    f"Lokasi: {lokasi}"
])

# Slide 3 - Penerapan Pemrograman Teks
add_bullet_slide("Penerapan Pemrograman Teks", [
    f"Bahasa Pemrograman: {bahasa}",
    f"Digunakan untuk: {penggunaan}"
])

# Slide 4 - Proses Pengembangan
add_bullet_slide("Proses Pengembangan", [
    proses
])

# Slide 5 - Sistem Kolaborasi
add_bullet_slide("Sistem Kolaborasi", [
    f"Platform: {kolaborasi}"
])

# Slide 6 - Workflow & Debugging
add_bullet_slide("Workflow & Debugging", [
    f"Workflow: {workflow}",
    f"Debugging: {debugging}"
])

# Slide 7 - Manfaat di Industri
add_bullet_slide("Manfaat di Industri", [
    "Meningkatkan efisiensi pembuatan website",
    "Memudahkan kolaborasi antar programmer",
    "Mempercepat proses pengembangan produk"
])

# Slide 8 - Refleksi Pribadi
add_bullet_slide("Refleksi Pribadi", [
    "Pengalaman PKL ini memberikan wawasan tentang pengembangan website.",
    "Memahami pentingnya struktur dan perencanaan sebelum membuat web.",
    "Belajar penggunaan GitHub untuk kolaborasi."
])

# Simpan file
output_path = "/mnt/data/Laporan_PKL_Pemrograman_Teks.pptx"
prs.save(output_path)
output_path
