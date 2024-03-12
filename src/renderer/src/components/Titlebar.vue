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
	<header class="absolute flex justify-end inset-0 h-8 bg-zinc-100 z-20">
		<div class="grid grid-cols-3">
			<button ref="minimizer" class="transition-all cursor-default px-4 h-8 hover:bg-zinc-200">
				<Minimize class="text-sm" />
			</button>
			<button ref="maximizer" class="transition-all cursor-default px-4 h-8 hover:bg-zinc-200">
				<Maximize class="text-sm" />
			</button>
			<button ref="closer" class="transition-all cursor-default px-4 h-8 hover:bg-red-500 hover:text-white">
				<Close class="text-sm" />
			</button>
		</div>
	</header>
</template>