<script setup lang="ts">
import Folder from '@/components/Icon/Folder.vue'
import FolderOpen from './Icon/FolderOpen.vue'
import { useNotesStore } from '@/store/notes'

const store = useNotesStore()

await store.loadFolders()
</script>

<template>
	<nav class="mt-1">
		<ul>
			<li
				v-for="folder of store.folders"
				:key="folder"
				@click="store.selectFolder(folder)"
				class="w-full flex items-center px-4 py-2 font-medium text-sm text-zinc-500 hover:text-zinc-900 whitespace-nowrap text-ellipsis overflow-hidden cursor-pointer"
				:class="{
					'bg-zinc-100 text-zinc-900': store.currentFolder === folder,
				}"
			>
				<FolderOpen v-if="store.currentFolder === folder" class="w-4 h-4 mr-3" />
				<Folder v-else class="w-4 h-4 mr-3" />
				<span class="whitespace-nowrap text-ellipsis overflow-hidden">
					{{ folder }}
				</span>
			</li>
		</ul>
	</nav>
</template>