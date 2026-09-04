window.addEventListener('DOMContentLoaded', function() {
    
    const pintu = document.getElementById('pintuDepan');
    const btnBuka = document.getElementById('btnBukaPintu');
    const lagu = document.getElementById('bgMusic');
    const butangLagu = document.getElementById('musicToggleBtn');


    // 1. LOGIK LOG MASUK / BUKA PINTU DEPAN
     if (btnBuka && pintu) {
        btnBuka.addEventListener('click', function() {
            // Memaksa pintu meluncur naik ke atas dengan menambah kelas CSS
            pintu.classList.add('pintu-tertutup');
            
            // Mengaktifkan lagu secara selamat tanpa membekukan kod jika ralat
            if (lagu) {
                lagu.play().then(() => {
                    if (butangLagu) {
                        butangLagu.innerHTML = "🎶";
                        butangLagu.classList.add('music-playing');
                    }
                }).catch(err => {
                    console.log("Muzik disekat pelayar web, memerlukan klik tambahan:", err);
                });
            }
        });
    }

    // 2. BONUS: MEMBACA NAMA TETAMU DARI LINK (Contoh: ://webanda.com)
    const pautanParameter = new URLSearchParams(window.location.search);
    const namaTetamu = pautanParameter.get('to');
    const paparanNamaPintu = document.getElementById('namaTetamuPintu');

    if (namaTetamu && paparanNamaPintu) {
        paparanNamaPintu.innerHTML = decodeURIComponent(namaTetamu);
    } else if (paparanNamaPintu) {
        paparanNamaPintu.innerHTML = "Ahli Keluarga & Rakan Tersayang";
    }

});

// 1. KIRAAN DETIK (COUNTDOWN) MAJLIS
const tarikhMajlis = new Date("Mar 20, 2027 11:00:00").getTime();

const pemasa = setInterval(function() {
    const masaKini = new Date().getTime();
    const bakiMasa = tarikhMajlis - masaKini;

    const hari = Math.floor(bakiMasa / (1000 * 60 * 60 * 24));
    const jam = Math.floor((bakiMasa % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minit = Math.floor((bakiMasa % (1000 * 60 * 60)) / (1000 * 60));
    const saat = Math.floor((bakiMasa % (1000 * 60)) / 1000);

    document.getElementById("countdownDisplay").innerHTML = `${hari} Hari ${jam} Jam ${minit} Minit ${saat} Saat`;

    if (bakiMasa < 0) {
        clearInterval(pemasa);
        document.getElementById("countdownDisplay").innerHTML = "Majlis Sedang Berlangsung!";
    }
}, 1000);

// 2. BORANG RSVP PENGHANTARAN MOCK
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwHftf0idOHWFcXVOPDmiwRt8eSPTFmhZ3xdRU0tK4-dvI6It9YbDpSSVNE1HwjSw/exec";

    // 📍 1. TETAPAN TARIKH TUTUP RSVP (13 Mac 2027)
    // Kita tetapkan masa tamat tepat pada pukul 11:59:59 Malam
    const tarikTutupRSVP = new Date("March 13, 2027 23:59:59".getTime);
    const masaKini = new Date().getTime();

    const borangRSVP = document.getElementById('rsvpForm');
    const maklumbalasRSVP = document.getElementById('rsvpFeedback');

     // Cari semua elemen input di dalam borang untuk fungsi menyekat (disable)
     const elemenInput = borangRSVP ? borangRSVP.querySelectorAll('input, select, button') : [];

     // 📍 2. SEMAKAN AUTOMATIK SEBAIK SAHAJA WEB DIBUKA
    if (masaKini > tarikhTutupRSVP) {
        if (maklumbalasRSVP) {
            maklumbalasRSVP.style.color = "#c62828"; // Warna merah ralat
            maklumbalasRSVP.innerHTML = "🔒 Maaf, tarikh tutup pengisian RSVP telah tamat pada 13 Mac 2027.";
        }
        
        // Menghalang tetamu daripada menaip atau klik elemen borang
        elemenInput.forEach(elemen => {
            elemen.disabled = true;
            if (elemen.tagName === 'BUTTON') {
                elemen.innerHTML = "RSVP Ditutup";
                elemen.style.backgroundColor = "#888888"; // Tukar butang jadi warna kelabu mati
                elemen.style.cursor = "not-allowed";
            }
        });
    }

    // 📍 3. LOGIK PENGHANTARAN BORANG RSVP (DENGAN PERLINDUNGAN EKSTRA)
    if (borangRSVP) {
        borangRSVP.addEventListener('submit', function(e) {
            e.preventDefault();

            // Semakan sekali lagi semasa butang ditekan (untuk keselamatan)
            const masaKlik = new Date().getTime();
            if (masaKlik > tarikhTutupRSVP) {
                maklumbalasRSVP.style.color = "#c62828";
                maklumbalasRSVP.innerHTML = "🔒 Gagal menghantar. Tarikh mengisi RSVP telah pun ditutup.";
                return; // Menghentikan koding daripada terus menghantar data ke Google Sheets
            }

            // --- KOD ASAL HANTAR KE GOOGLE SHEETS ANDA BERMULA DI SINI ---
            maklumbalasRSVP.style.color = "#333";
            maklumbalasRSVP.innerHTML = "Sedang menghantar RSVP...";

            const dataPayload = {
                formType: "rsvp",
                nama: document.getElementById('rsvpNama').value,
                kehadiran: document.getElementById('rsvpStatus').value,
                pax: document.getElementById('rsvpPax').value || 0
            };

            // GOOGLE_SCRIPT_URL merujuk kepada pemboleh ubah URL Google Sheets anda
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataPayload)
            })
            .then(() => {
                maklumbalasRSVP.style.color = "#2e7d32";
                maklumbalasRSVP.innerHTML = "RSVP anda telah berjaya dihantar! ✨";
                borangRSVP.reset();
            })
            .catch(error => {
                maklumbalasRSVP.style.color = "#c62828";
                maklumbalasRSVP.innerHTML = "Ralat berlaku. Sila cuba lagi.";
                console.error('Error:', error);
            });
            // --- KOD ASAL HANTAR KE GOOGLE SHEETS TAMAT DI SINI ---
        });
    }



// 2. PENGENDALI BORANG UCAPAN
document.getElementById('wishesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const feedback = document.getElementById('wishFeedback');
    feedback.style.color = "#333";
    feedback.innerHTML = "Sedang menghantar ucapan...";

    const dataPayload = {
        formType: "ucapan",
        nama: document.getElementById('wishNama').value,
        ucapan: document.getElementById('wishMesej').value
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload)
    })
    .then(() => {
        feedback.style.color = "#2e7d32";
        feedback.innerHTML = "Ucapan dan doa restu anda selamat disimpan! Terima kasih. ❤️";
        document.getElementById('wishesForm').reset();
    })
    .catch(error => {
        feedback.style.color = "#c62828";
        feedback.innerHTML = "Gagal menghantar ucapan. Sila cuba lagi.";
        console.error('Error:', error);
    });
});
// Fungsi untuk memuatkan ucapan dari Google Sheets
function muatTurunUcapan() {
    const wishesBox = document.getElementById('wishesBox');

    fetch(GOOGLE_SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
        wishesBox.innerHTML = ""; // Padam teks "Sedang memuatkan..."

        if (data.length === 0) {
            wishesBox.innerHTML = "<p class='loading-text'>Belum ada ucapan lagi. Jadilah yang pertama!</p>";
            return;
        }

        // Bina elemen HTML bagi setiap ucapan
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'wish-card';
            card.innerHTML = `<strong>👤 ${item.nama}</strong><p>${item.ucapan}</p>`;
            wishesBox.appendChild(card);
        });
    })
    .catch(error => {
        wishesBox.innerHTML = "<p class='loading-text' style='color:red;'>Gagal memuatkan ucapan.</p>";
        console.error('Error fetching wishes:', error);
    });
}

// Jalankan fungsi ini secara automatik sebaik sahaja halaman web selesai dimuatkan
window.addEventListener('DOMContentLoaded', muatTurunUcapan);

const rsvpPaxInput = document.getElementById('rsvpPax');

// 1. Kawalan Menggunakan Butang Anak Panah (Keyboard / Spin Buttons)
rsvpPaxInput.addEventListener('keydown', function(e) {
    let nilaiSemasa = parseInt(this.value) || 1;

    // Jika pengguna menekan butang anak panah ATAS
    if (e.key === 'ArrowUp') {
        if (nilaiSemasa >= 4) {
            e.preventDefault(); // Sekat fungsi asal browser
            this.value = 1;     // Pusing balik ke 1
        }
    }
    // Jika pengguna menekan butang anak panah BAWAH
    else if (e.key === 'ArrowDown') {
        if (nilaiSemasa <= 1) {
            e.preventDefault(); // Sekat fungsi asal browser
            this.value = 4;     // Pusing balik ke 4
        }
    }
});

// 2. Kawalan Keselamatan (Jika pengguna menaip sendiri nombor di luar julat 1-4)
rsvpPaxInput.addEventListener('input', function() {
    let nilaiSemasa = parseInt(this.value);
    
    if (nilaiSemasa > 4) {
        this.value = 1;
    } else if (nilaiSemasa < 1) {
        this.value = 4;
    }
});

const lagu = document.getElementById('bgMusic');

// Automatik mainkan muzik sebaik sahaja tetamu mula skrol skrin (Sistem pintas sekat autoplay browser)
window.addEventListener('scroll', function() {
    lagu.play().then(() => {
        butangLagu.innerHTML = "🎶";
        butangLagu.classList.add('music-playing');
    }).catch(error => {
        // Abaikan jika browser masih menyekat audio sebelum klik pertama
        console.log("Autoplay disekat, tetamu perlu klik butang manual.");
    });
}, { once: true }); // Fungsi skrol ini hanya berjalan sekali sahaja
 
