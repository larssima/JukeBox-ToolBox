<script setup>
import { ref, watch, onMounted } from 'vue'
import { drawCard } from '../utils/renderCard.js'

const props = defineProps({
  card: { type: Object, required: true },
  width: { type: Number, default: 900 }, // render resolution; aspect is fixed 3:1
})

const canvasEl = ref(null)

async function render() {
  if (!canvasEl.value) return
  await drawCard(canvasEl.value, props.card, props.width)
}

onMounted(render)
watch(
  () => [props.card.templateId, props.card.fontId, props.card.artist, props.card.songA, props.card.songB, props.card.songAScale, props.card.artistScale, props.card.songBScale, props.width],
  render,
)

defineExpose({ render, canvasEl })
</script>

<template>
  <canvas ref="canvasEl" class="card-canvas"></canvas>
</template>

<style scoped>
.card-canvas {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid #d8d8d8;
  background: #fff;
}
</style>
