<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Minimize from '@/components/Icon/Minimize.vue'
import Maximize from '@/components/Icon/Maximize.vue'
import Close from '@/components/Icon/Close.vue'

const minimizer = ref<HTMLButtonElement | null>(null)
const maximizer = ref<HTMLButtonElement | null>(null)
const closer = ref<HTMLButtonElement | null>(null)

onMounted(() => {
	minimizer.value?.addEventListener('click',
		() => window.context.minimize()
	)
	maximizer.value?.addEventListener('click',
		() => window.context.maximize()
	)
	closer.value?.addEventListener('click',
		() => window.context.close()
	)
})
</script>

<template>
	<header class="absolute flex justify-end inset-0 h-8 bg-transparent">
		<div class="grid grid-cols-3">
			<button ref="minimizer" class="transition-all cursor-default px-4 h-8 hover:bg-zinc-100">
				<Minimize />
			</button>
			<button ref="maximizer" class="transition-all cursor-default px-4 h-8 hover:bg-zinc-100">
				<Maximize />
			</button>
			<button ref="closer" class="transition-all cursor-default px-4 h-8 hover:bg-red-500 hover:text-white">
				<Close />
			</button>
		</div>
	</header>
</template>