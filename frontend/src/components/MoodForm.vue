<script setup>
import { ref } from 'vue'
const emit = defineEmits(['selesai'])

const pertanyaan = [
  "Bagaimana beban kerja Anda hari ini?",
  "Apakah Anda merasa diapresiasi oleh tim/atasan?",
  "Seberapa lelah Anda secara emosional tadi pagi?",
  "Bagaimana kualitas tidur Anda semalam?",
  "Apakah sempat istirahat tanpa gangguan chat kantor?",
  "Apakah Anda merasa punya kontrol atas tugas harian?",
  "Reaksi Anda saat melihat deadline hari ini?",
  "Lingkungan kerja terasa mendukung hari ini?",
  "Sulitkah memisahkan urusan kerja dan pribadi?",
  "Hal apa yang paling memicu stres hari ini?"
]

const index = ref(0)
const jawaban = ref('')
const hasil = ref([])

const lanjut = () => {
  if(!jawaban.value) return alert("Ceritakan sedikit perasaanmu...")
  hasil.value.push(jawaban.value)
  jawaban.value = ''
  if(index.value < pertanyaan.length - 1) index.value++
  else emit('selesai', hasil.value)
}
</script>

<template>
  <div class="form-container">
    <div class="progress">Langkah {{ index + 1 }} dari 10</div>
    <h3>{{ pertanyaan[index] }}</h3>
    <textarea v-model="jawaban" placeholder="Ketik di sini..."></textarea>
    <button @click="lanjut" class="btn-submit">
      {{ index === 9 ? 'Selesaikan Jurnal' : 'Lanjut' }}
    </button>
  </div>
</template>

<style scoped>
.progress { color: #6366f1; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; }
h3 { margin: 15px 0; font-size: 1.2rem; color: #1e293b; }
textarea { width: 100%; height: 130px; padding: 15px; border-radius: 15px; border: 2px solid #e2e8f0; resize: none; margin-bottom: 20px; font-family: inherit; }
.btn-submit { width: 100%; padding: 14px; background: #6366f1; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; }
</style>