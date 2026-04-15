<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MoodForm from './components/MoodForm.vue'
import MoodList from './components/MoodList.vue'
import MoodChart from './components/MoodChart.vue'

const currentMenu = ref('dashboard')
const step = ref('view')
const riwayat = ref([])
const namaUser = ref(localStorage.getItem('namaWorker') || 'Pekerja')

// Fungsi Tarik Data
const fetchRiwayat = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/moods')
    riwayat.value = res.data
  } catch (e) { console.error("Gagal load data") }
}

// Fungsi Simpan Data
const handleSelesai = async (jawaban) => {
  try {
    await axios.post('http://localhost:3000/api/moods', { jawabanTeks: jawaban })
    step.value = 'view'
    currentMenu.value = 'dashboard'
    fetchRiwayat()
  } catch (e) { alert("Gagal kirim data") }
}

// Fungsi Hapus Data
const hapusRiwayat = async (id) => {
  if (!confirm("Hapus catatan ini permanen?")) return
  try {
    await axios.delete(`http://localhost:3000/api/moods/${id}`)
    fetchRiwayat()
  } catch (e) { alert("Gagal menghapus") }
}

onMounted(fetchRiwayat)
</script>

<template>
  <div class="dashboard-wrapper">
    <aside class="sidebar">
      <div class="logo">SimpleMoodTracker</div>
      <nav class="menu">
        <div class="menu-item" :class="{ active: currentMenu === 'dashboard' }" @click="currentMenu = 'dashboard'">📊 Dashboard</div>
        <div class="menu-item" :class="{ active: currentMenu === 'history' }" @click="currentMenu = 'history'">📅 History</div>
        <div class="menu-item" :class="{ active: currentMenu === 'settings' }" @click="currentMenu = 'settings'">⚙️ Settings</div>
      </nav>

      <div class="stress-indicator-box">
        <p class="indicator-title">Level Stress Terakhir:</p>
        <div class="status-badge" :style="{ backgroundColor: riwayat.length > 0 ? riwayat[0].warna : '#cbd5e1' }">
          {{ riwayat.length > 0 ? riwayat[0].status : 'Belum Ada Data' }}
        </div>
        <div class="legend">
          <small><span class="dot red"></span> Tinggi</small>
          <small><span class="dot orange"></span> Sedang</small>
          <small><span class="dot blue"></span> Rendah</small>
          <small><span class="dot green"></span> Bahagia</small>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <div>
          <h1>{{ currentMenu.toUpperCase() }}</h1>
          <p>Halo <b>{{ namaUser }}</b>, monitor kesehatan mentalmu.</p>
        </div>
        <button @click="step = 'survey'" class="btn-new-journal">+ New Journal</button>
      </header>

      <div v-if="step === 'survey'" class="overlay">
        <div class="modal">
          <button @click="step = 'view'" class="btn-close">✕</button>
          <MoodForm @selesai="handleSelesai" />
        </div>
      </div>

      <div v-if="currentMenu === 'dashboard'" class="grid-layout">
        <div class="card chart-card">
          <h3>Weekly Stress Trend</h3>
          <MoodChart v-if="riwayat.length > 0" :items="riwayat" />
          <div v-else class="empty-state">Data grafik akan muncul setelah mengisi jurnal.</div>
        </div>
        <div class="card list-card">
          <h3>Recent Activity</h3>
          <MoodList :items="riwayat.slice(0, 3)" />
        </div>
      </div>

      <div v-else-if="currentMenu === 'history'" class="card full-history">
        <h3>Journal History</h3>
        <div v-if="riwayat.length > 0" class="history-list">
           <div v-for="item in riwayat" :key="item.id" class="history-item">
            <div class="meta">
              <span class="badge" :style="{ background: item.warna }">{{ item.status }}</span>
              <div class="meta-right">
                <span class="date">{{ item.tanggal }}</span>
                <button @click="hapusRiwayat(item.id)" class="btn-delete">🗑️</button>
              </div>
            </div>
            <p><strong>Tips:</strong> {{ item.tips }}</p>
          </div>
        </div>
        <div v-else class="empty-state">Belum ada riwayat.</div>
      </div>

      <div v-else-if="currentMenu === 'settings'" class="settings-container">
        <div class="card settings-card">
          <h3>Pengaturan Profil</h3>
          <div class="form-group">
            <label>Ganti Nama</label>
            <input v-model="namaUser" @input="localStorage.setItem('namaWorker', namaUser)">
          </div>
        </div>
      </div>
    </main>
  </div>
</template>