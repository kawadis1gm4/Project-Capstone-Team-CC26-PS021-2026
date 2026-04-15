<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)

const props = defineProps(['items'])

const chartData = computed(() => {
  const data = [...props.items].reverse().slice(-7)
  return {
    labels: data.map(i => i.tanggal),
    datasets: [{
      label: 'Skor Stress',
      data: data.map(i => i.skor),
      borderColor: '#6366f1',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      borderWidth: 3
    }]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { min: 0, max: 100 } }
}
</script>

<template>
  <div style="height: 300px;"><Line :data="chartData" :options="options" /></div>
</template>