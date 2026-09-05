window.addEventListener('DOMContentLoaded', function() {
    
    const overlayTirai = document.getElementById('pintuDepan');
    const kotakSampul = document.getElementById('envelopeContainer');
    const btnBukaSampul = document.getElementById('btnBukaPintu');
    const laguKahwin = document.getElementById('bgMusic');

    if (btnBukaSampul && kotakSampul && overlayTirai) {
        btnBukaSampul.addEventListener('click', function() {
            
            // Langkah A: Buka penutup surat dan tarik kad naik ke atas
            kotakSampul.classList.add('buka-flap');

            // 📍 KOD KUNCI: Memaksa butang "Buka Undangan" ini hilang serta-merta apabila diklik
            this.style.display = 'none'; 
            
            // Mengaktifkan lagu perkahwinan anda secara automatik
            if (laguKahwin) {
                laguKahwin.play().catch(err => console.log("Muzik disekat browser:", err));
            }

            // Langkah B: Tunggu 1.5 saat (animasi surat selesai), kemudian luncurkan seluruh tirai keluar
            setTimeout(function() {
                overlayTirai.classList.add('tutup-tirai');
            }, 1800);
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

// Ambil elemen paparan kad dari HTML
const cardHari = document.getElementById("flip-hari");
const cardJam = document.getElementById("flip-jam");
const cardMinit = document.getElementById("flip-minit");
const cardSaat = document.getElementById("flip-saat");

if (cardHari && cardJam && cardMinit && cardSaat) {
    setInterval(function() {
        const masaKini = new Date().getTime();
        const bakiMasa = tarikhMajlis - masaKini;

        // Logik pengiraan matematik masa
        let hari = Math.floor(bakiMasa / (1000 * 60 * 60 * 24));
        let jam = Math.floor((bakiMasa % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minit = Math.floor((bakiMasa % (1000 * 60 * 60)) / (1000 * 60));
        let saat = Math.floor((bakiMasa % (1000 * 60)) / 1000);

        // Fungsi padPad (Format: jika 9 saat, ditukar paparan ke '09')
        hari = hari < 10 ? "0" + hari : hari;
        jam = jam < 10 ? "0" + jam : jam;
        minit = minit < 10 ? "0" + minit : minit;
        saat = saat < 10 ? "0" + saat : saat;

        // Masukkan angka ke dalam kotak kad masing-masing
        cardHari.innerHTML = hari;
        cardJam.innerHTML = jam;
        cardMinit.innerHTML = minit;
        cardSaat.innerHTML = saat;

        // Jika tarikh perkahwinan telah tiba/lepas
        if (bakiMasa < 0) {
            cardHari.innerHTML = "00";
            cardJam.innerHTML = "00";
            cardMinit.innerHTML = "00";
            cardSaat.innerHTML = "00";
        }
    }, 1000);
}

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
 
