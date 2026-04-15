<script setup>
defineProps(['items'])
</script>

<template>
  <div class="activity-list">
    <div v-for="item in items" :key="item.id" class="activity-item">
      <div class="item-header">
        <span class="status-tag" :style="{ color: item.warna }">● {{ item.status }}</span>
        <span class="time">{{ item.tanggal }}</span>
      </div>
      <div class="tips-box">
        💡 {{ item.tips }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-list { margin-top: 15px; max-height: 400px; overflow-y: auto; }
.activity-item { margin-bottom: 20px; border-bottom: 1px solid #f8fafc; padding-bottom: 15px; }
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.status-tag { font-weight: 800; font-size: 0.85rem; }
.time { font-size: 0.75rem; color: #94a3b8; }
.tips-box { background: #f8fafc; padding: 12px; border-radius: 10px; font-size: 0.85rem; color: #475569; border-left: 4px solid #e2e8f0; }
</style>