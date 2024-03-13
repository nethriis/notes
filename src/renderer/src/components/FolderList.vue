<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

import { useNotesStore } from '@/store/notes'
import Folder from '@/components/Icon/Folder.vue'
import FolderOpen from '@/components/Icon/FolderOpen.vue'
import Pencil from '@/components/Icon/Pencil.vue'
import Trash from '@/components/Icon/Trash.vue'

const store = useNotesStore()

const props = defineProps<{
	newFolder?: boolean
}>()
const emit = defineEmits<{
	'folderCreated': []
}>()

const newFolderInput = ref<HTMLInputElement | null>(null)
const newFolderName = ref('New Folder')
const isEnterPressed = ref(false)

await store.loadFolders()

const createFolder = async (event: KeyboardEvent | FocusEvent) => {
	if (isEnterPressed.value) {
		isEnterPressed.value = false
		return
	}

	if (event instanceof KeyboardEvent && event.target instanceof HTMLInputElement) {
		isEnterPressed.value = true
		event.target.blur()
	}

	if (newFolderName.value !== '') {
		await window.context.createFolder(newFolderName.value)
	}
	emit('folderCreated')
	newFolderName.value = 'New Folder'
}

const deleteFolder = async (folder: string) => {
	await window.context.deleteFolder(folder)
}

watch(() => props.newFolder, async (value) => {
	if (value) {
		await nextTick()
		newFolderInput.value?.focus()
	}
})

onMounted(() => {
	window.context.onFolderCreate(async () => {
		await store.loadFolders()
	})
	window.context.onFolderDelete(async () => {
		await store.loadFolders()
		if (store.folders.length > 0) {
			await store.selectFolder(store.folders[0])
		}
	})
})
</script>

<template>
	<nav class="mt-1">
		<ul>
			<li
				v-if="newFolder"
				class="w-full flex items-center px-4 py-2 font-medium text-sm text-zinc-900 whitespace-nowrap text-ellipsis overflow-hidden cursor-pointer"
			>
				<Folder class="w-4 h-4 mr-3" />
				<span class="whitespace-nowrap text-ellipsis overflow-hidden">
					<input
						ref="newFolderInput"
						type="text"
						v-model="newFolderName"
						@keyup.enter="createFolder"
						@blur="createFolder"
						class="focus:ring-1 ring-inset focus:ring-zinc-400 rounded-sm outline-none"
					/>
				</span>
			</li>
			<li
				v-for="folder of store.folders"
				:key="folder"
				@click="store.selectFolder(folder)"
				class="folder-name w-full flex items-center px-4 py-2 font-medium text-sm text-zinc-500 hover:text-zinc-900 whitespace-nowrap text-ellipsis overflow-hidden cursor-pointer"
				:class="{
					'bg-zinc-100 text-zinc-900': store.currentFolder === folder,
				}"
			>
				<FolderOpen v-if="store.currentFolder === folder" class="w-4 h-4 mr-3" />
				<Folder v-else class="w-4 h-4 mr-3" />
				<span class="relative whitespace-nowrap text-ellipsis overflow-hidden flex-1">
					{{ folder }}
					<div class="space-x-2 absolute top-1/2 right-0 -translate-y-1/2 flex items-center">
						<button
							type="button"
							@click=""
							class="text-zinc-500 hover:text-zinc-900"
						>
							<Pencil class="w-3.5 h-3.5" />
						</button>
						<button
							type="button"
							@click="deleteFolder(folder)"
							class="text-zinc-500 hover:text-zinc-900"
						>
							<Trash class="w-3.5 h-3.5" />
						</button>
					</div>
				</span>
			</li>
		</ul>
	</nav>
</template>

<style>
.folder-name > span > div {
	@apply hidden;
}

.folder-name:hover > span > div {
	@apply block;
}
</style>
