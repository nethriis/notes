<script setup lang="ts">
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogPanel,
	DialogTitle
} from '@headlessui/vue'
import CloseIcon from '@/components/Icon/Close.vue'

const isOpen = defineModel<boolean>('open', {
	required: true
})
</script>

<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="() => isOpen = false" class="relative z-10">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="duration-200 ease-in"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div class="fixed inset-0 bg-black/25" />
			</TransitionChild>
			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center p-4 text-center"
				>
					<TransitionChild
						as="template"
						enter="duration-100 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-75 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						>
							<div class="flex items-center justify-between">
								<DialogTitle
									as="h3"
									class="text-xl font-semibold leading-none"
								>
									<slot name="header" />
								</DialogTitle>
								<button type="button" @click="() => isOpen = false" class="p-2 rounded-md transition-colors hover:bg-zinc-100">
									<CloseIcon class="w-4 h-4" />
								</button>
							</div>
							<div class="mt-2">
                <slot />
              </div>
							<div v-if="$slots.footer" class="mt-4">
                <slot name="footer" />
              </div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>